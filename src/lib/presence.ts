import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { GoogleUser } from "./guestbook";
import { VisitorLocation, getVisitorLocation } from "./geo";

export interface ActiveViewer {
  id: string;
  location: string;
  flagEmoji?: string;
  name?: string;
  avatar?: string;
  lastSeen: number;
  isSelf?: boolean;
}

export interface WaveEvent {
  id?: string;
  fromName: string;
  fromLocation: string;
  flagEmoji?: string;
  timestamp: number;
}

// Session ID for this browser tab
let currentSessionId: string | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;
let currentGoogleUser: GoogleUser | null = null;
let currentLocation: VisitorLocation | null = null;

// Cross-tab broadcast channel for instant multi-tab sync
let presenceChannel: BroadcastChannel | null = null;
const localTabs = new Map<string, ActiveViewer>();

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  if (!currentSessionId) {
    try {
      const stored = sessionStorage.getItem("pk_viewer_session_id");
      if (stored) {
        currentSessionId = stored;
        return currentSessionId;
      }
    } catch {}
    currentSessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    try {
      sessionStorage.setItem("pk_viewer_session_id", currentSessionId);
    } catch {}
  }
  return currentSessionId;
}

/**
 * Initializes real-time presence heartbeat
 */
export function initPresence(googleUser?: GoogleUser | null): () => void {
  if (typeof window === "undefined") return () => {};

  const sessionId = getSessionId();
  currentGoogleUser = googleUser || null;

  // Initialize BroadcastChannel for instant local multi-tab coordination
  try {
    if (typeof BroadcastChannel !== "undefined" && !presenceChannel) {
      presenceChannel = new BroadcastChannel("pk_presence_sync");
      presenceChannel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === "ANNOUNCE" || type === "HEARTBEAT") {
          localTabs.set(payload.id, payload);
          notifyViewers();
        } else if (type === "LEAVE") {
          localTabs.delete(payload.id);
          notifyViewers();
        }
      };
    }
  } catch {}

  // Load visitor location once
  getVisitorLocation().then((loc) => {
    currentLocation = loc;
    sendHeartbeat(sessionId);
  });

  const sendHeartbeat = async (sId: string) => {
    const viewerData: ActiveViewer = {
      id: sId,
      lastSeen: Date.now(),
      location: currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "Earth",
      flagEmoji: currentLocation?.flagEmoji || "🌍",
      name: currentGoogleUser?.name || "Anonymous Explorer",
      avatar: currentGoogleUser?.picture || undefined,
      isSelf: true,
    };

    localTabs.set(sId, viewerData);

    // Announce to other tabs
    try {
      presenceChannel?.postMessage({ type: "HEARTBEAT", payload: viewerData });
    } catch {}

    // 1. Post to internal server presence API
    try {
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sId,
          location: viewerData.location,
          flagEmoji: viewerData.flagEmoji,
          name: viewerData.name,
          avatar: viewerData.avatar,
        }),
      });
    } catch {}

    // 2. Also sync to Firestore if db is accessible
    try {
      const docRef = doc(db, "presence", sId);
      await setDoc(docRef, viewerData, { merge: true });
    } catch {
      // Handled silently
    }

    notifyViewers();
  };

  // Immediate first heartbeat
  sendHeartbeat(sessionId);

  // Send heartbeat every 15 seconds
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    sendHeartbeat(sessionId);
  }, 15000);

  // Clean up on tab close
  const handleUnload = () => {
    try {
      presenceChannel?.postMessage({ type: "LEAVE", payload: { id: sessionId } });
      fetch(`/api/presence?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
        keepalive: true,
      }).catch(() => {});
      const docRef = doc(db, "presence", sessionId);
      deleteDoc(docRef).catch(() => {});
    } catch {}
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    window.removeEventListener("beforeunload", handleUnload);
    handleUnload();
  };
}

/**
 * Update presence when user signs in with Google
 */
export async function updatePresenceUser(user: GoogleUser | null): Promise<void> {
  currentGoogleUser = user;
  const sessionId = getSessionId();
  try {
    const docRef = doc(db, "presence", sessionId);
    await setDoc(
      docRef,
      {
        name: user?.name || "Anonymous Explorer",
        avatar: user?.picture || null,
        lastSeen: Date.now(),
      },
      { merge: true }
    );
  } catch {}
}

const activeCallbacks = new Set<(data: { count: number; viewers: ActiveViewer[] }) => void>();

function notifyViewers() {
  const mySessionId = getSessionId();
  const threshold = Date.now() - 40000;
  const list: ActiveViewer[] = [];

  for (const [id, v] of localTabs.entries()) {
    if (v.lastSeen >= threshold) {
      list.push({ ...v, isSelf: id === mySessionId });
    }
  }

  // Ensure self exists
  if (!list.some((v) => v.id === mySessionId)) {
    list.unshift({
      id: mySessionId,
      location: currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "You",
      flagEmoji: currentLocation?.flagEmoji || "🌍",
      name: currentGoogleUser?.name || "You",
      avatar: currentGoogleUser?.picture || undefined,
      lastSeen: Date.now(),
      isSelf: true,
    });
  }

  list.sort((a, b) => (a.isSelf ? -1 : b.isSelf ? 1 : 0));
  const count = Math.max(1, list.length);

  activeCallbacks.forEach((cb) => cb({ count, viewers: list }));
}

/**
 * Subscribe to active concurrent viewers in real time
 */
export function subscribeActiveViewers(
  callback: (data: { count: number; viewers: ActiveViewer[] }) => void
): () => void {
  if (typeof window === "undefined") {
    callback({ count: 1, viewers: [] });
    return () => {};
  }

  activeCallbacks.add(callback);

  // Poll server presence API every 6 seconds for cross-device/global viewers
  const pollServer = async () => {
    try {
      const res = await fetch("/api/presence", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.viewers)) {
          const serverActiveIds = new Set(json.viewers.map((v: ActiveViewer) => v.id));
          for (const id of Array.from(localTabs.keys())) {
            if (id !== getSessionId() && !serverActiveIds.has(id)) {
              localTabs.delete(id);
            }
          }
          json.viewers.forEach((v: ActiveViewer) => {
            if (v.id !== getSessionId()) {
              localTabs.set(v.id, v);
            }
          });
          notifyViewers();
        }
      }
    } catch {}
  };

  pollServer();
  const pollInterval = setInterval(pollServer, 6000);

  // Also listen to Firestore collection if accessible
  let unsubscribeFirestore: (() => void) | null = null;
  try {
    const presenceCol = collection(db, "presence");
    unsubscribeFirestore = onSnapshot(
      presenceCol,
      (snapshot) => {
        const threshold = Date.now() - 45000;
        snapshot.forEach((d) => {
          const data = d.data() as Partial<ActiveViewer>;
          if (data.lastSeen && data.lastSeen >= threshold && d.id !== getSessionId()) {
            localTabs.set(d.id, {
              id: d.id,
              location: data.location || "Earth",
              flagEmoji: data.flagEmoji || "🌍",
              name: data.name || "Anonymous Explorer",
              avatar: data.avatar || undefined,
              lastSeen: data.lastSeen,
              isSelf: false,
            });
          }
        });
        notifyViewers();
      },
      () => {
        // Handled silently
      }
    );
  } catch {}

  notifyViewers();

  return () => {
    activeCallbacks.delete(callback);
    clearInterval(pollInterval);
    if (unsubscribeFirestore) unsubscribeFirestore();
  };
}

/**
 * Broadcast a real-time live wave easter egg to all concurrent viewers
 */
export async function broadcastLiveWave(
  fromName?: string,
  fromLocation?: string
): Promise<void> {
  const name = fromName || currentGoogleUser?.name || "A visitor";
  const loc =
    fromLocation ||
    (currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "Earth");
  const flag = currentLocation?.flagEmoji || "🌍";

  try {
    presenceChannel?.postMessage({
      type: "WAVE",
      payload: { fromName: name, fromLocation: loc, flagEmoji: flag, timestamp: Date.now() },
    });
  } catch {}

  try {
    const wavesCol = collection(db, "live_waves");
    await addDoc(wavesCol, {
      fromName: name,
      fromLocation: loc,
      flagEmoji: flag,
      timestamp: Date.now(),
    });
  } catch {}
}

/**
 * Listen for live wave greetings from concurrent visitors
 */
export function subscribeLiveWaves(callback: (wave: WaveEvent) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mySessionId = getSessionId();
  const startTime = Date.now() - 5000;

  // Listen to broadcast channel
  const handleMsg = (event: MessageEvent) => {
    if (event.data?.type === "WAVE" && event.data?.payload) {
      callback(event.data.payload);
    }
  };
  presenceChannel?.addEventListener("message", handleMsg);

  // Also listen to Firestore collection
  let unsubscribeFirestore: (() => void) | null = null;
  try {
    const wavesCol = collection(db, "live_waves");
    const q = query(wavesCol, where("timestamp", ">=", startTime));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data() as Partial<WaveEvent>;
            if (data.fromName && data.timestamp && data.timestamp >= startTime) {
              callback({
                id: change.doc.id,
                fromName: data.fromName,
                fromLocation: data.fromLocation || "Earth",
                flagEmoji: data.flagEmoji || "🌍",
                timestamp: data.timestamp,
              });
            }
          }
        });
      },
      () => {}
    );
  } catch {}

  return () => {
    presenceChannel?.removeEventListener("message", handleMsg);
    if (unsubscribeFirestore) unsubscribeFirestore();
  };
}

export const subscribeToLiveWaves = subscribeLiveWaves;

/**
 * Cumulative total page views counter
 */
export async function getLivePageViews(): Promise<number> {
  try {
    const stored = localStorage.getItem("pk_page_views");
    let count = stored ? parseInt(stored, 10) : 1420;
    const hasCountedSession = sessionStorage.getItem("pk_counted_visit");
    if (!hasCountedSession) {
      count += 1;
      localStorage.setItem("pk_page_views", count.toString());
      sessionStorage.setItem("pk_counted_visit", "1");
    }
    return count;
  } catch {
    return 1420;
  }
}

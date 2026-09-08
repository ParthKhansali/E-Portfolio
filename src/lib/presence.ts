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
  id: string;
  fromName: string;
  fromLocation: string;
  timestamp: number;
}

// Session ID for this browser tab
let currentSessionId: string | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;
let currentGoogleUser: GoogleUser | null = null;
let currentLocation: VisitorLocation | null = null;

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  if (!currentSessionId) {
    const stored = sessionStorage.getItem("pk_viewer_session_id");
    if (stored) {
      currentSessionId = stored;
    } else {
      currentSessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem("pk_viewer_session_id", currentSessionId);
    }
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

  // Load visitor location once
  getVisitorLocation().then((loc) => {
    currentLocation = loc;
    sendHeartbeat(sessionId);
  });

  const sendHeartbeat = async (sId: string) => {
    try {
      const docRef = doc(db, "presence", sId);
      await setDoc(
        docRef,
        {
          id: sId,
          lastSeen: Date.now(),
          location: currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "Earth",
          flagEmoji: currentLocation?.flagEmoji || "🌍",
          name: currentGoogleUser?.name || "Anonymous Explorer",
          avatar: currentGoogleUser?.picture || null,
        },
        { merge: true }
      );
    } catch (err) {
      console.debug("Presence heartbeat issue:", err);
    }
  };

  // Immediate first heartbeat
  sendHeartbeat(sessionId);

  // Send heartbeat every 25 seconds
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    sendHeartbeat(sessionId);
  }, 25000);

  // Clean up on tab close or navigation
  const handleUnload = () => {
    try {
      const docRef = doc(db, "presence", sessionId);
      deleteDoc(docRef).catch(() => {});
    } catch {
      // Ignore unload errors
    }
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    window.removeEventListener("beforeunload", handleUnload);
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
  } catch (err) {
    console.debug("Update presence user issue:", err);
  }
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

  const mySessionId = getSessionId();

  try {
    const presenceCol = collection(db, "presence");
    const unsubscribe = onSnapshot(
      presenceCol,
      (snapshot) => {
        const threshold = Date.now() - 50000; // active within last 50s
        const viewers: ActiveViewer[] = [];

        snapshot.forEach((d) => {
          const data = d.data() as Partial<ActiveViewer>;
          if (data.lastSeen && data.lastSeen >= threshold) {
            viewers.push({
              id: d.id,
              location: data.location || "Earth",
              flagEmoji: data.flagEmoji || "🌍",
              name: data.name || "Anonymous Explorer",
              avatar: data.avatar || undefined,
              lastSeen: data.lastSeen,
              isSelf: d.id === mySessionId,
            });
          }
        });

        // Ensure current viewer is represented even if Firestore read is propagating
        const hasSelf = viewers.some((v) => v.id === mySessionId);
        if (!hasSelf) {
          viewers.unshift({
            id: mySessionId,
            location: currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "You",
            flagEmoji: currentLocation?.flagEmoji || "🌍",
            name: currentGoogleUser?.name || "You",
            avatar: currentGoogleUser?.picture || undefined,
            lastSeen: Date.now(),
            isSelf: true,
          });
        }

        // Put self first in list
        viewers.sort((a, b) => (a.isSelf ? -1 : b.isSelf ? 1 : 0));

        callback({
          count: Math.max(1, viewers.length),
          viewers,
        });
      },
      (err) => {
        console.debug("Presence snapshot issue:", err);
        // Graceful fallback: 1 viewer (self)
        callback({
          count: 1,
          viewers: [
            {
              id: mySessionId,
              location: currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "You",
              flagEmoji: currentLocation?.flagEmoji || "🌍",
              name: currentGoogleUser?.name || "You",
              avatar: currentGoogleUser?.picture || undefined,
              lastSeen: Date.now(),
              isSelf: true,
            },
          ],
        });
      }
    );

    return unsubscribe;
  } catch (err) {
    console.debug("Presence subscription error:", err);
    callback({ count: 1, viewers: [] });
    return () => {};
  }
}

/**
 * Broadcast a real-time live wave easter egg to all concurrent viewers
 */
export async function broadcastLiveWave(fromName?: string, fromLocation?: string): Promise<boolean> {
  try {
    const waveCol = collection(db, "presence_events");
    await addDoc(waveCol, {
      type: "wave",
      fromName: fromName || currentGoogleUser?.name || "A visitor",
      fromLocation: fromLocation || (currentLocation ? `${currentLocation.city}, ${currentLocation.country}` : "nearby"),
      flagEmoji: currentLocation?.flagEmoji || "🌍",
      timestamp: Date.now(),
    });
    return true;
  } catch (err) {
    console.debug("Broadcast wave error:", err);
    return false;
  }
}

/**
 * Subscribe to real-time live waves sent by other concurrent visitors
 */
export function subscribeToLiveWaves(
  callback: (wave: { fromName: string; fromLocation: string; flagEmoji?: string }) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const startTimestamp = Date.now();

  try {
    const waveCol = collection(db, "presence_events");
    const q = query(waveCol, where("timestamp", ">=", startTimestamp));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            if (data.type === "wave") {
              callback({
                fromName: data.fromName || "Someone",
                fromLocation: data.fromLocation || "online",
                flagEmoji: data.flagEmoji,
              });
            }
          }
        });
      },
      (err) => {
        console.debug("Wave subscription issue:", err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.debug("Live wave subscription error:", err);
    return () => {};
  }
}

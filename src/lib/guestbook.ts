import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import { auth, db, googleProvider } from "./firebase";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatar: string;
  isGoogleVerified?: boolean;
  email?: string;
  createdAt: string;
}

export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const COUNTAPI_URL = "https://countapi.mileshilliard.com/api/v1/hit/parthkhansali-portfolio";

/**
 * Sign in using Firebase Google Auth popup
 */
export async function signInWithGoogle(): Promise<{ user?: GoogleUser; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const user: GoogleUser = {
      name: fbUser.displayName || "Google User",
      email: fbUser.email || "",
      picture: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fbUser.displayName || "User")}`,
      sub: fbUser.uid,
    };
    return { user };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn("Firebase Google sign-in:", error);
    if (error.code === "auth/popup-closed-by-user") {
      return { error: "Sign-in cancelled." };
    }
    if (error.code === "auth/configuration-not-found" || error.code === "auth/operation-not-allowed") {
      return { error: "Please enable Google Sign-In in your Firebase Console (Authentication > Sign-in method)." };
    }
    if (error.code === "auth/unauthorized-domain") {
      return { error: "This domain is not authorized in Firebase Console. Add your Vercel domain under Authentication > Settings > Authorized domains." };
    }
    return { error: error.message || "Failed to sign in with Google." };
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutGoogle(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn("Sign out issue:", err);
  }
}

/**
 * Fetch guestbook reviews: tries Firestore first, falls back to KV
 */
export async function fetchReviews(): Promise<ReviewItem[]> {
  try {
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"), limit(50));
    const snapshot = await getDocs(q);
    const items: ReviewItem[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      items.push({
        id: doc.id,
        name: d.name || "Anonymous",
        role: d.role || "Verified Visitor",
        message: d.message || "",
        rating: d.rating || 5,
        avatar: d.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(d.name || "Visitor")}`,
        isGoogleVerified: d.isGoogleVerified ?? true,
        email: d.email,
        createdAt: d.createdAt || new Date().toISOString(),
      });
    });
    return items;
  } catch (err) {
    console.warn("Firestore fetch issue:", err);
    return [];
  }
}

/**
 * Submit review: saves to Firestore
 */
export async function submitGoogleReview(
  user: GoogleUser,
  role: string,
  message: string,
  rating: number
): Promise<{ success: boolean; entry?: ReviewItem; error?: string }> {
  if (!user || !user.name) {
    return { success: false, error: "Google authentication required." };
  }
  if (!message.trim()) {
    return { success: false, error: "Please write a short note." };
  }

  const newEntry: ReviewItem = {
    id: `gb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: user.name.trim().slice(0, 50),
    role: (role.trim() || "Google Verified User").slice(0, 50),
    message: message.trim().slice(0, 500),
    rating: Math.max(1, Math.min(5, rating)),
    avatar: user.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`,
    isGoogleVerified: true,
    email: user.email ? user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : undefined,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "guestbook"), {
      name: newEntry.name,
      role: newEntry.role,
      message: newEntry.message,
      rating: newEntry.rating,
      avatar: newEntry.avatar,
      isGoogleVerified: true,
      email: newEntry.email,
      createdAt: newEntry.createdAt,
      uid: user.sub,
    });
    newEntry.id = docRef.id;
    return { success: true, entry: newEntry };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Firestore write failed:", err);
    return {
      success: false,
      error: error?.message || "Failed to submit note. Please try again.",
    };
  }
}

export async function getLivePageViews(): Promise<number> {
  if (typeof window === "undefined") return 1;

  const statsDocRef = doc(db, "site_stats", "views");

  // 1. Check session deduplication to record only 1 genuine hit per visitor session
  const alreadyCounted = sessionStorage.getItem("pk_session_view_recorded");

  if (!alreadyCounted) {
    try {
      // Atomic increment on Firestore
      await updateDoc(statsDocRef, {
        count: increment(1),
        lastVisitedAt: new Date().toISOString(),
      });
      sessionStorage.setItem("pk_session_view_recorded", "1");
    } catch {
      try {
        // Create document if it doesn't exist yet
        await setDoc(statsDocRef, {
          count: 1,
          createdAt: new Date().toISOString(),
          lastVisitedAt: new Date().toISOString(),
        }, { merge: true });
        sessionStorage.setItem("pk_session_view_recorded", "1");
      } catch (err) {
        console.debug("Firestore live views increment issue:", err);
      }
    }
  }

  // 2. Fetch the authentic current count from Firestore
  try {
    const snap = await getDoc(statsDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (typeof data.count === "number") {
        return data.count;
      }
    }
  } catch (err) {
    console.debug("Firestore live views fetch issue:", err);
  }

  // 3. Fallback: CountAPI or local counter without artificial offset
  try {
    const res = await fetch(COUNTAPI_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        return data.value;
      }
    }
  } catch (e) {
    console.debug("CountAPI fallback issue:", e);
  }

  // 4. Client local storage fallback
  try {
    const local = parseInt(localStorage.getItem("pk_live_views") || "1", 10);
    const updated = alreadyCounted ? local : local + 1;
    localStorage.setItem("pk_live_views", updated.toString());
    return updated;
  } catch {
    return 1;
  }
}

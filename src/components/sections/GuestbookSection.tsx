"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Send, LogOut, Loader2, ChevronDown, ChevronUp, PenLine, ShieldCheck, AlertCircle } from "lucide-react";
import {
  fetchReviews,
  submitGoogleReview,
  getLivePageViews,
  signInWithGoogle,
  signOutGoogle,
  ReviewItem,
  GoogleUser,
} from "@/lib/guestbook";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function GuestbookSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [liveViews, setLiveViews] = useState<number>(0);
  const [displayViews, setDisplayViews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Google User Auth
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("pk_google_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync with Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const user: GoogleUser = {
          name: fbUser.displayName || "Google User",
          email: fbUser.email || "",
          picture: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fbUser.displayName || "User")}`,
          sub: fbUser.uid,
        };
        setGoogleUser(user);
        localStorage.setItem("pk_google_user", JSON.stringify(user));
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [loadedReviews, views] = await Promise.all([
          fetchReviews(),
          getLivePageViews(),
        ]);
        if (isMounted) {
          setReviews(loadedReviews);
          setLiveViews(views);
        }
      } catch (e) {
        console.warn("Guestbook load issue:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth count-up for live views
  useEffect(() => {
    if (liveViews === 0) return;
    let current = 0;
    const target = liveViews;
    const duration = 1000;
    const interval = 25;
    const step = target / (duration / interval);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayViews(target);
        clearInterval(timer);
      } else {
        setDisplayViews(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [liveViews]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    const { user, error } = await signInWithGoogle();
    setIsSigningIn(false);

    if (user) {
      setGoogleUser(user);
      localStorage.setItem("pk_google_user", JSON.stringify(user));
      setIsSignInOpen(false);
    } else if (error && error !== "Sign-in cancelled.") {
      setAuthError(error);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    localStorage.removeItem("pk_google_user");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    if (!googleUser) {
      setIsSignInOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const res = await submitGoogleReview(googleUser, "", message.trim(), 5);

    if (res.success && res.entry) {
      startTransition(() => {
        setReviews((prev) => [res.entry!, ...prev]);
      });
      setMessage("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3500);
    } else {
      setSubmitError(res.error || "Well, that wasn't supposed to happen.");
    }

    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const displayedReviews = reviews.slice(0, visibleCount);

  return (
    <section
      id="guestbook"
      className="relative bg-[#050505] py-24 px-6 border-t border-white/[0.04] scroll-mt-24"
      aria-label="Community Guestbook"
    >
      <div className="mx-auto max-w-2xl">
        {/* Sleek Minimal Header */}
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                Say hi
              </h2>
              {reviews.length > 0 && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-neutral-400">
                  {reviews.length} {reviews.length === 1 ? "note" : "notes"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              You&apos;ve made it this far. Leave a little evidence.
            </p>
          </div>

          {/* Discreet Live View Counter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06d6a0]" />
            </span>
            <span>
              {displayViews ? `${displayViews.toLocaleString()} views` : "..."}
            </span>
          </div>
        </div>

        {/* Input Composer / Sign In Prompt */}
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors focus-within:border-white/20">
          {!googleUser ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#4285F4]" />
                <span className="text-xs sm:text-sm text-neutral-400">
                  Want to leave a note? Sign in with Google.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSignInOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.1] px-4 py-2 text-xs font-medium text-white transition-all cursor-pointer hover:border-white/25 shadow-sm"
              >
                {/* Minimal Google 'G' icon */}
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Leave a note</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Authenticated User Status Bar */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10 bg-white/[0.05]">
                    <Image
                      src={googleUser.picture || "/profile.jpg"}
                      alt={googleUser.name}
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="font-medium text-neutral-200">{googleUser.name}</span>
                  <span className="text-[10px] font-mono text-[#06d6a0] bg-[#06d6a0]/10 px-2 py-0.2 rounded-full border border-[#06d6a0]/20">
                    Google Verified
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sign out</span>
                </button>
              </div>

              {/* Note Textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Say something nice. Or brutally honest. Both are useful."
                rows={2}
                maxLength={400}
                required
                className="w-full resize-none rounded-lg bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden leading-relaxed"
              />

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono text-neutral-600">
                  {message.length > 0 ? `${message.length}/400 · ` : ""}⌘ + Enter to send
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 px-3.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      <span>Leave it here</span>
                    </>
                  )}
                </button>
              </div>

              {submitSuccess && (
                <span className="text-[11px] text-[#06d6a0]">Message received. I&apos;ll pretend this made my day.</span>
              )}
              {submitError && (
                <span className="text-[11px] text-red-400">{submitError}</span>
              )}
            </form>
          )}
        </div>

        {/* Notes Stream (Clean Minimalist Timeline) */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-white/[0.04] bg-white/[0.01] p-8">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <PenLine className="h-4 w-4 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-300">No notes yet. You could be first.</p>
            </div>
          ) : (
            displayedReviews.map((entry) => (
              <div
                key={entry.id}
                className="group rounded-xl border border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03] p-4 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/10 bg-white/[0.05] flex-shrink-0">
                      <Image
                        src={entry.avatar}
                        alt={entry.name}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-200 truncate">
                      {entry.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-neutral-500 flex-shrink-0">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed break-words pl-8">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Scalable "Show More Notes" Pill Button */}
        {reviews.length > 4 && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  prev >= reviews.length ? 4 : Math.min(reviews.length, prev + 5)
                )
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 px-5 py-2 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
            >
              {visibleCount >= reviews.length ? (
                <>
                  <span>Show Less Notes</span>
                  <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <span>Show More Notes ({reviews.length - visibleCount} remaining)</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Clean Minimal Google Auth Dialog */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0e] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#4285F4]" />
                <span>Sign in to leave a note</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsSignInOpen(false);
                  setAuthError(null);
                }}
                className="text-neutral-500 hover:text-white text-xs cursor-pointer p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              A quick Google sign-in connects your verified name and picture so notes remain authentic and bot-free.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white hover:bg-neutral-100 text-black py-2.5 px-4 text-xs font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Google G SVG */}
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {authError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-[11px] text-red-300">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <p className="text-center text-[10px] text-neutral-500 pt-1">
                Powered by Firebase Auth · Your email is never shown publicly
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

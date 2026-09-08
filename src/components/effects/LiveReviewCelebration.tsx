"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, MessageSquareQuote, Sparkles, X, ArrowRight } from "lucide-react";
import { ReviewItem, subscribeToNewReviews } from "@/lib/guestbook";
import { subscribeToLiveWaves } from "@/lib/presence";
import { SgaRune } from "@/components/effects/EnchantingParticles";

interface CelebrationItem {
  id: string;
  type: "review" | "wave";
  title: string;
  subtitle: string;
  avatar?: string;
  rating?: number;
  message?: string;
}

export default function LiveReviewCelebration() {
  const [activeItem, setActiveItem] = useState<CelebrationItem | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rune: number; color: string }>>([]);

  // Trigger floating SGA particles celebration
  const triggerParticles = () => {
    const runesList = [0, 4, 8, 12, 16, 20, 24];
    const colors = ["#c77dff", "#00f5d4", "#7209b7", "#4361ee", "#f72585"];
    const newParticles = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80, // percentage across viewport
      y: 20 + Math.random() * 60,
      rune: runesList[Math.floor(Math.random() * runesList.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 4000);
  };

  useEffect(() => {
    // 1. Subscribe to new reviews in real-time
    const unsubscribeReviews = subscribeToNewReviews((review: ReviewItem) => {
      setActiveItem({
        id: review.id,
        type: "review",
        title: `${review.name} just signed the Guestbook!`,
        subtitle: review.role || "Verified Visitor",
        avatar: review.avatar,
        rating: review.rating,
        message: review.message,
      });

      triggerParticles();

      // Dispatch event to Oneko companion
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("live-review-celebration", {
            detail: { name: review.name },
          })
        );
      }

      // Auto dismiss toast after 9 seconds
      setTimeout(() => {
        setActiveItem((prev) => (prev?.id === review.id ? null : prev));
      }, 9000);
    });

    // 2. Subscribe to live wave events from concurrent viewers
    const unsubscribeWaves = subscribeToLiveWaves((wave) => {
      const waveId = `wave_${Date.now()}`;
      setActiveItem({
        id: waveId,
        type: "wave",
        title: `${wave.fromName} sent a wave!`,
        subtitle: `Visiting from ${wave.fromLocation} ${wave.flagEmoji || "🌍"}`,
      });

      triggerParticles();

      // Dispatch event to Oneko companion
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("live-wave-received", {
            detail: { fromName: wave.fromName },
          })
        );
      }

      setTimeout(() => {
        setActiveItem((prev) => (prev?.id === waveId ? null : prev));
      }, 7000);
    });

    return () => {
      unsubscribeReviews();
      unsubscribeWaves();
    };
  }, []);

  const scrollToGuestbook = () => {
    const el = document.getElementById("guestbook");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveItem(null);
  };

  return (
    <>
      {/* Floating SGA Enchanting Particles Burst */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none fixed z-[999999] animate-[sga-float_3.5s_ease-out_forwards]"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            color: p.color,
          }}
        >
          <SgaRune runeIndex={p.rune} className="w-5 h-5 drop-shadow-[0_0_12px_currentColor]" />
        </div>
      ))}

      {/* Floating Celebratory Toast Notification */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-4 sm:right-6 z-[999998] max-w-sm w-full"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#0d0d12]/95 backdrop-blur-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              {/* Glowing Top Edge Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  activeItem.type === "review"
                    ? "bg-gradient-to-r from-[#06d6a0] via-[#4361ee] to-[#7209b7]"
                    : "bg-gradient-to-r from-[#c77dff] to-[#06d6a0]"
                }`}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Avatar / Icon */}
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex-shrink-0">
                    {activeItem.avatar ? (
                      <Image
                        src={activeItem.avatar}
                        alt="User"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#7209b7]/30 text-[#c77dff]">
                        {activeItem.type === "review" ? (
                          <MessageSquareQuote className="h-5 w-5" />
                        ) : (
                          <span className="text-lg">👋</span>
                        )}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#06d6a0] ring-2 ring-black text-[8px] font-bold text-black">
                      ★
                    </span>
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-[#c77dff] animate-pulse flex-shrink-0" />
                      <h4 className="text-xs font-bold text-white truncate">
                        {activeItem.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#aaa] font-mono truncate">
                      {activeItem.subtitle}
                    </p>

                    {/* Star Rating if Review */}
                    {activeItem.rating && (
                      <div className="flex items-center gap-0.5 mt-1 text-[#ffb703]">
                        {Array.from({ length: activeItem.rating }).map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 fill-current" />
                        ))}
                      </div>
                    )}

                    {/* Message Snippet if Review */}
                    {activeItem.message && (
                      <p className="text-[11px] text-[#e0e0e0] mt-1.5 italic line-clamp-2 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.05]">
                        &ldquo;{activeItem.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  aria-label="Dismiss celebration toast"
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.15] transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Action Button for Review */}
              {activeItem.type === "review" && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={scrollToGuestbook}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#06d6a0] hover:text-[#00f5d4] transition-colors cursor-pointer"
                  >
                    <span>Read in Guestbook</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

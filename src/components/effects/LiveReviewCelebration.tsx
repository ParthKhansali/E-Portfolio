"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, MessageSquareQuote, Sparkles, X, ArrowRight } from "lucide-react";
import { ReviewItem, subscribeToNewReviews } from "@/lib/guestbook";
import { subscribeToLiveWaves } from "@/lib/presence";

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

  useEffect(() => {
    // 1. Subscribe to new reviews in real-time
    const unsubscribeReviews = subscribeToNewReviews((review: ReviewItem) => {
      setActiveItem({
        id: review.id,
        type: "review",
        title: `${review.name} signed the Guestbook`,
        subtitle: review.role || "Visitor",
        avatar: review.avatar,
        rating: review.rating,
        message: review.message,
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("assistant-reaction", {
            detail: { type: "heart", message: "New guestbook entry!" },
          })
        );
      }

      setTimeout(() => setActiveItem(null), 8000);
    });

    // 2. Subscribe to live visitor waves
    const unsubscribeWaves = subscribeToLiveWaves((wave) => {
      setActiveItem({
        id: `wave-${wave.timestamp}`,
        type: "wave",
        title: `${wave.fromName} sent a wave 👋`,
        subtitle: `From ${wave.fromLocation || "Earth"}`,
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("assistant-reaction", {
            detail: { type: "wave", message: "Someone waved!" },
          })
        );
      }

      setTimeout(() => setActiveItem(null), 6000);
    });

    return () => {
      unsubscribeReviews();
      unsubscribeWaves();
    };
  }, []);

  const scrollToGuestbook = () => {
    setActiveItem(null);
    const el = document.getElementById("guestbook");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-4 sm:right-6 z-[999998] max-w-sm w-full"
        >
          <div className="relative overflow-hidden rounded-xl border border-[#333328] bg-[#171714]/95 backdrop-blur-md p-4 shadow-2xl text-[#f0ece4]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {/* Avatar / Icon */}
                <div className="relative h-9 w-9 rounded-full overflow-hidden border border-[#333328] bg-[#1e1e1a] flex-shrink-0">
                  {activeItem.avatar ? (
                    <Image
                      src={activeItem.avatar}
                      alt="User"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm">
                      {activeItem.type === "review" ? (
                        <MessageSquareQuote className="h-4 w-4 text-[#d4a843]" />
                      ) : (
                        <span>👋</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#d4a843] flex-shrink-0" />
                    <h4 className="text-xs font-semibold text-[#f0ece4] truncate">
                      {activeItem.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#8a8a7a] truncate mt-0.5">
                    {activeItem.subtitle}
                  </p>

                  {/* Star Rating if Review */}
                  {activeItem.rating && (
                    <div className="flex items-center gap-0.5 mt-1 text-[#d4a843]">
                      {Array.from({ length: activeItem.rating }).map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-current" />
                      ))}
                    </div>
                  )}

                  {/* Message Snippet */}
                  {activeItem.message && (
                    <p className="text-[11px] text-[#b5b0a1] mt-1.5 italic line-clamp-2 bg-[#1e1e1a] p-1.5 rounded border border-[#333328]">
                      &ldquo;{activeItem.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Dismiss toast"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Action for Review */}
            {activeItem.type === "review" && (
              <div className="mt-3 pt-2.5 border-t border-[#333328] flex items-center justify-end">
                <button
                  type="button"
                  onClick={scrollToGuestbook}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d4a843] hover:text-[#f0ece4] transition-colors cursor-pointer"
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
  );
}

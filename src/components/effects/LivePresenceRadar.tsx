"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Sparkles, MapPin, Radio } from "lucide-react";
import { ActiveViewer, broadcastLiveWave } from "@/lib/presence";

interface LivePresenceRadarProps {
  isOpen: boolean;
  onClose: () => void;
  viewers: ActiveViewer[];
  count: number;
}

export default function LivePresenceRadar({
  isOpen,
  onClose,
  viewers,
  count,
}: LivePresenceRadarProps) {
  const [hasWaved, setHasWaved] = useState(false);
  const [waveCooldown, setWaveCooldown] = useState(0);

  const handleWave = async () => {
    if (waveCooldown > 0) return;
    setHasWaved(true);
    setWaveCooldown(10);

    const selfViewer = viewers.find((v) => v.isSelf);
    await broadcastLiveWave(selfViewer?.name, selfViewer?.location);

    // Countdown cooldown
    const interval = setInterval(() => {
      setWaveCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasWaved(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Radar Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0e]/95 p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.95)] z-10"
          >
            {/* Ambient Purple/Cyan Glow Accent */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#06d6a0]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#7209b7]/20 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#06d6a0]/10 border border-[#06d6a0]/30 text-[#06d6a0] shadow-[0_0_15px_rgba(6,214,160,0.2)]">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-80" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#06d6a0]" />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Live Viewers Radar</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-[#06d6a0]/15 text-[#06d6a0] border border-[#06d6a0]/30">
                      {count} online
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#888] font-mono">
                    People exploring this portfolio right now
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close live viewers modal"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Active Viewers List */}
            <div className="my-4 max-h-[260px] overflow-y-auto space-y-2 pr-1">
              {viewers.map((viewer) => (
                <div
                  key={viewer.id}
                  className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                    viewer.isSelf
                      ? "bg-[#06d6a0]/[0.06] border-[#06d6a0]/30 shadow-[0_0_15px_rgba(6,214,160,0.08)]"
                      : "bg-white/[0.03] border-white/[0.06] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20 bg-neutral-900 flex-shrink-0">
                      {viewer.avatar ? (
                        <Image
                          src={viewer.avatar}
                          alt={viewer.name || "User"}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4361ee]/30 to-[#7209b7]/30 text-xs font-mono text-white">
                          {viewer.flagEmoji || "🐱"}
                        </div>
                      )}
                      {viewer.isSelf && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#06d6a0] ring-1 ring-black" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white truncate">
                          {viewer.name}
                        </span>
                        {viewer.isSelf && (
                          <span className="text-[9px] font-mono uppercase bg-[#06d6a0]/20 text-[#06d6a0] px-1.5 py-0.2 rounded border border-[#06d6a0]/30">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#888] font-mono truncate">
                        <MapPin className="h-3 w-3 text-[#4361ee] flex-shrink-0" />
                        <span className="truncate">{viewer.location}</span>
                        {viewer.flagEmoji && <span>{viewer.flagEmoji}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06d6a0]" />
                    </span>
                    <span className="text-[10px] font-mono text-[#06d6a0]">Live</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Easter Egg Action Card: Wave to Live Viewers */}
            <div className="rounded-xl border border-[#c77dff]/25 bg-[#7209b7]/10 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c77dff]/20 text-[#c77dff] border border-[#c77dff]/40 flex-shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Live Easter Egg</div>
                  <div className="text-[10px] text-[#bbb]">
                    Wave to say hi to all concurrent viewers!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWave}
                disabled={waveCooldown > 0}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  waveCooldown > 0
                    ? "bg-white/10 text-neutral-400 border border-white/10 cursor-not-allowed"
                    : "bg-[#7209b7] hover:bg-[#8318d1] text-white shadow-[0_0_15px_rgba(114,9,183,0.5)] active:scale-95"
                }`}
              >
                <span>👋</span>
                <span>
                  {waveCooldown > 0 ? `Sent! (${waveCooldown}s)` : "Wave 👋"}
                </span>
              </button>
            </div>

            {/* Footer tip */}
            <div className="mt-3 text-center">
              <p className="text-[10px] text-[#666] font-mono">
                Real-time Firebase presence · Refreshes dynamically
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

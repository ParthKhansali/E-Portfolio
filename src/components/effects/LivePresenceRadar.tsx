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
  count?: number;
  activeCount?: number;
}

export default function LivePresenceRadar({
  isOpen,
  onClose,
  viewers,
  count,
  activeCount,
}: LivePresenceRadarProps) {
  const displayCount = activeCount ?? count ?? viewers.length;
  const [waveCooldown, setWaveCooldown] = useState(0);

  const handleWave = async () => {
    if (waveCooldown > 0) return;
    setWaveCooldown(10);

    const selfViewer = viewers.find((v) => v.isSelf);
    await broadcastLiveWave(selfViewer?.name, selfViewer?.location);

    const interval = setInterval(() => {
      setWaveCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#333328] bg-[#171714] p-5 sm:p-6 shadow-2xl z-10 text-[#f0ece4]"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between pb-4 border-b border-[#333328]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#8fb573]/15 border border-[#8fb573]/30 text-[#8fb573]">
                  <Radio className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#f0ece4] flex items-center gap-2">
                    <span>Live Viewers Radar</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded border border-[#8fb573]/30 bg-[#8fb573]/10 text-[#8fb573]">
                      {displayCount} online
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#8a8a7a]">
                    People exploring this portfolio right now
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close live viewers modal"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Active Viewers List */}
            <div className="my-4 max-h-[260px] overflow-y-auto space-y-2 pr-1">
              {viewers.map((viewer) => (
                <div
                  key={viewer.id}
                  className={`flex items-center justify-between rounded-lg p-2.5 border transition-all ${
                    viewer.isSelf
                      ? "bg-[#1e1e1a] border-[#d4a843]/40"
                      : "bg-[#1e1e1a]/50 border-[#333328] hover:border-[#555548]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar */}
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-[#333328] bg-[#121210] flex-shrink-0">
                      {viewer.avatar ? (
                        <Image
                          src={viewer.avatar}
                          alt={viewer.name || "User"}
                          width={28}
                          height={28}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs">
                          {viewer.flagEmoji || "🐱"}
                        </div>
                      )}
                      {viewer.isSelf && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#8fb573] ring-1 ring-[#171714]" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-xs text-[#f0ece4] truncate">
                          {viewer.name}
                        </span>
                        {viewer.isSelf && (
                          <span className="text-[9px] uppercase bg-[#d4a843]/20 text-[#d4a843] px-1 py-0.2 rounded border border-[#d4a843]/30">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#8a8a7a] truncate">
                        <MapPin className="h-3 w-3 text-[#d4a843] flex-shrink-0" />
                        <span className="truncate">{viewer.location}</span>
                        {viewer.flagEmoji && <span>{viewer.flagEmoji}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fb573] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8fb573]" />
                    </span>
                    <span className="text-[10px] text-[#8fb573]">Live</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Easter Egg Action Card: Wave to Live Viewers */}
            <div className="rounded-lg border border-[#333328] bg-[#1e1e1a] p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="text-lg">👋</span>
                <div>
                  <div className="text-xs font-semibold text-[#f0ece4]">Wave to the Room</div>
                  <div className="text-[11px] text-[#8a8a7a]">
                    Say hi to everyone viewing right now
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWave}
                disabled={waveCooldown > 0}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  waveCooldown > 0
                    ? "bg-[#2a2a22] text-[#6a6a5e] border border-[#333328] cursor-not-allowed"
                    : "bg-[#f0ece4] hover:bg-white text-[#0f0f0d] active:scale-95"
                }`}
              >
                <span>{waveCooldown > 0 ? `Sent (${waveCooldown}s)` : "Wave 👋"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radio, Volume2, VolumeX, Coffee, Mail, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import {
  initPresence,
  subscribeActiveViewers,
  ActiveViewer,
} from "@/lib/presence";
import { getLivePageViews } from "@/lib/guestbook";
import { getVisitorLocation, VisitorLocation } from "@/lib/geo";
import { sounds } from "@/lib/soundFx";
import LivePresenceRadar from "@/components/effects/LivePresenceRadar";

const footerLinks = [
  { label: "Projects", href: "#projects" },
  { label: "How I Work", href: "#systems" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
];

export default function SiteFooter() {
  const [activeCount, setActiveCount] = useState(1);
  const [activeViewers, setActiveViewers] = useState<ActiveViewer[]>([]);
  const [views, setViews] = useState<number | null>(null);
  const [location, setLocation] = useState<VisitorLocation | null>(null);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getMuted());
    let isMounted = true;

    // 1. Initialize real-time presence heartbeat
    const cleanupPresence = initPresence();

    // 2. Subscribe to active concurrent viewers
    const unsubscribeViewers = subscribeActiveViewers((data) => {
      if (isMounted) {
        setActiveCount(data.count);
        setActiveViewers(data.viewers);
      }
    });

    // 3. Cumulative page visits
    getLivePageViews().then((count) => {
      if (isMounted) setViews(count);
    });

    // 4. Visitor Geo location
    getVisitorLocation().then((loc) => {
      if (isMounted && loc) setLocation(loc);
    });

    return () => {
      isMounted = false;
      cleanupPresence();
      unsubscribeViewers();
    };
  }, []);

  return (
    <footer className="border-t border-[#333328] bg-[#0f0f0d] px-6 py-12">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-7 text-center">
        {/* Brand & Identity */}
        <div className="space-y-1">
          <h3 className="font-display text-sm font-bold tracking-[0.2em] text-[#f0ece4] uppercase">
            PARTH KHANSALI
          </h3>
          <p className="text-xs text-[#8a8a7a]">
            Computer Science @ GEHU · Developer, Builder, Problem Solver
          </p>
        </div>

        {/* Minimal Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#8a8a7a]">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#f0ece4]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Unified Sleek Status & Utility Dock */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Live Presence Pill */}
          <button
            type="button"
            onClick={() => setIsRadarOpen(true)}
            title="Click to view live visitor radar"
            className="group inline-flex items-center gap-2 rounded-full border border-[#333328] bg-[#141412] hover:border-[#4a4a3c] px-3.5 py-1.5 text-xs text-[#8a8a7a] transition-all cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fb573] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8fb573]" />
            </span>
            <span className="text-[#f0ece4] font-medium">Dehradun, India</span>
            <span className="text-[#4a4a3c]">·</span>
            <span className="text-[#c5c2b8] font-medium">{activeCount} online</span>
            {views && (
              <>
                <span className="text-[#4a4a3c]">·</span>
                <span>{views.toLocaleString()} views</span>
              </>
            )}
            {location && location.city !== "Earth" && (
              <>
                <span className="text-[#4a4a3c]">·</span>
                <span className="text-[#d4a843] flex items-center gap-1">
                  <span>{location.city}</span>
                  {location.flagEmoji && <span>{location.flagEmoji}</span>}
                </span>
              </>
            )}
          </button>

          {/* Micro Utility Actions */}
          <div className="inline-flex items-center gap-1 rounded-full border border-[#333328] bg-[#141412] p-1">
            {/* Cozy Lounge Button with subtle steam wisp */}
            <button
              type="button"
              onClick={() => {
                sounds.playAchievement();
                window.dispatchEvent(new CustomEvent("open-arcade"));
              }}
              title="Open The Late Night Lounge (Multi-game arcade and visitor room)"
              className="group relative flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[#d4a843] hover:bg-[#d4a843]/15 transition-all cursor-pointer"
            >
              <span className="relative flex items-center justify-center">
                <Coffee className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <motion.span
                  animate={{ y: [-1, -4, -1], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1.5 text-[8px] pointer-events-none"
                >
                  ~
                </motion.span>
              </span>
              <span className="text-[11px] font-semibold">Lounge</span>
            </button>

            {/* Radar Button */}
            <button
              type="button"
              onClick={() => setIsRadarOpen(true)}
              title="Open visitor radar"
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a8a7a] hover:text-[#8fb573] hover:bg-[#8fb573]/10 transition-colors cursor-pointer"
            >
              <Radio className="h-3.5 w-3.5" />
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextMuted = sounds.toggleMute();
                setIsMuted(nextMuted);
              }}
              title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a8a7a] hover:text-[#f0ece4] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#c87941]" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#8fb573]" />
              )}
            </button>
          </div>
        </div>

        {/* Minimal Animated Socials Icons Dock */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <a
            href="https://github.com/ParthKhansali"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4] hover:border-[#555548] hover:scale-105 active:scale-95 transition-all"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/in/parth-khansali"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4] hover:border-[#555548] hover:scale-105 active:scale-95 transition-all"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com/parth_khansali"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4] hover:border-[#555548] hover:scale-105 active:scale-95 transition-all"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:parthkhansali@gmail.com"
            title="Send Email"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4] hover:border-[#555548] hover:scale-105 active:scale-95 transition-all"
          >
            <Mail className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
            title="View Resume PDF"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#d4a843] hover:text-[#f0ece4] hover:border-[#d4a843]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>

        {/* Clean Signoff */}
        <p className="text-[11px] text-[#6b6b5c] pt-2 border-t border-[#333328] w-full max-w-sm mx-auto">
          Handbuilt in Dehradun. Probably while listening to something good.
        </p>
      </div>

      {/* Real-Time Live Presence Radar Drawer Modal */}
      <LivePresenceRadar
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        activeCount={activeCount}
        viewers={activeViewers}
      />
    </footer>
  );
}

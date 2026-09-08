"use client";

import { useState, useEffect } from "react";
import { Eye, MapPin } from "lucide-react";
import { getLivePageViews } from "@/lib/guestbook";
import { getVisitorLocation, VisitorLocation } from "@/lib/geo";

const footerLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#portal-marquee" },
  { label: "Build Log", href: "#dev-dashboard" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function SiteFooter() {
  const [views, setViews] = useState<number | null>(null);
  const [location, setLocation] = useState<VisitorLocation | null>(null);

  useEffect(() => {
    let isMounted = true;
    getLivePageViews().then((count) => {
      if (isMounted) setViews(count);
    });
    getVisitorLocation().then((loc) => {
      if (isMounted && loc) setLocation(loc);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505] px-6 py-14">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-8 text-center">
        {/* Brand & Tagline */}
        <div className="space-y-1.5">
          <h3 className="font-display text-sm sm:text-base font-bold tracking-[0.2em] text-white uppercase">
            PARTH KHANSALI
          </h3>
          <p className="text-xs sm:text-sm text-[#777]">
            Still learning. Still building. Still opening too many tabs.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#999]">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Status, Live Views & Instagram Badge Row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Status: Currently building */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-[#aaa]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06d6a0]" />
            </span>
            <span>Currently building</span>
          </div>

          {/* Real-Time Live Views */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-[#888]">
            <Eye className="h-3.5 w-3.5 text-[#06d6a0]" />
            <span className="font-mono font-bold text-white">
              {views ? views.toLocaleString() : "..."}
            </span>
            <span className="text-[#666]">live views</span>
          </div>

          {/* Dynamic Visitor Location */}
          {location && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-xs text-[#aaa] animate-in fade-in duration-300">
              <MapPin className="h-3.5 w-3.5 text-[#4361ee]" />
              <span>
                You&apos;re visiting from{" "}
                <strong className="font-medium text-white">
                  {location.formatted}
                </strong>
                {location.flagEmoji ? ` ${location.flagEmoji}` : ""}
              </span>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/[0.04] pt-6 w-full text-center">
          <p className="text-[11px] text-[#555]">
            © 2026 Parth Khansali · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

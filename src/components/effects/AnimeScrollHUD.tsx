"use client";

import { useEffect, useRef, useState } from "react";
import { animate, onScroll } from "animejs";
import { ArrowUp, Compass } from "lucide-react";
import { sounds } from "@/lib/soundFx";

interface SectionInfo {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: SectionInfo[] = [
  { id: "hero", num: "01", label: "HERO" },
  { id: "portal-marquee", num: "02", label: "TOOLBOX" },
  { id: "projects", num: "03", label: "PROJECTS" },
  { id: "dev-dashboard", num: "04", label: "SYSTEMS" },
  { id: "about", num: "05", label: "ABOUT" },
  { id: "experience", num: "06", label: "CAREER" },
  { id: "guestbook", num: "07", label: "COMMUNITY" },
  { id: "contact", num: "08", label: "CONTACT" },
];

export default function AnimeScrollHUD() {
  const [percent, setPercent] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<SectionInfo>(SECTIONS[0]);
  const [isScrollingUp, setIsScrollingUp] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let hudObserver: ReturnType<typeof onScroll> | null = null;

    try {
      // Telemetry observer monitoring scroll progress, velocity, and active section
      hudObserver = onScroll({
        target: document.body,
        enter: "top top",
        leave: "bottom bottom",
        sync: 0.1,
        onUpdate: (self) => {
          const rawProgress = typeof self.progress === "number" ? self.progress : 0;
          const currentPercent = Math.min(100, Math.max(0, Math.round(rawProgress * 100)));
          setPercent(currentPercent);
          setIsScrollingUp(Boolean(self.backward));
          setHasScrolled(window.scrollY > 80);

          // Determine current section in viewport
          const scrollAnchor = window.scrollY + window.innerHeight * 0.35;
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(SECTIONS[i].id);
            if (el) {
              const top = el.offsetTop;
              if (scrollAnchor >= top) {
                setActiveSection(SECTIONS[i]);
                break;
              }
            }
          }
        },
      });
    } catch (err) {
      console.warn("Anime.js onScroll initialization notice:", err);
    }

    return () => {
      hudObserver?.revert();
    };
  }, []);

  const scrollToTop = () => {
    sounds.playClick();
    const lenis = typeof window !== "undefined" ? (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: { duration?: number }) => void } }).__lenis : null;
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Anime.js Telemetry HUD Pill (Bottom Right) */}
      <aside
        aria-label="Scroll Telemetry"
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[800] transition-all duration-300 ${
          hasScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-[#333328] bg-[#171714]/90 px-3.5 py-1.5 shadow-2xl backdrop-blur-md text-[11px] font-mono text-[#b5b0a1] select-none hover:border-[#555548] transition-colors">
          {/* Pulsing telemetry beacon */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
          </span>

          {/* Active section breadcrumb */}
          <span className="text-[#8a8a7a]">
            {activeSection.num}
          </span>
          <span className="font-semibold text-[#f0ece4] tracking-wider">
            {activeSection.label}
          </span>

          <span className="text-[#333328]">|</span>

          {/* Scroll progress % */}
          <span className="w-8 text-right font-medium text-[#d4a843]">
            {String(percent).padStart(2, "0")}%
          </span>

          {/* Direction vector glyph */}
          <span
            className={`transition-transform duration-200 text-[#8a8a7a] ${
              isScrollingUp ? "-rotate-90" : "rotate-90"
            }`}
            title={isScrollingUp ? "Scrolling upward" : "Scrolling downward"}
          >
            ▸
          </span>

          {/* Jump to top action button */}
          <button
            type="button"
            onClick={scrollToTop}
            title="Scroll to top (window 0,0)"
            className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#24241f] text-[#b5b0a1] hover:bg-[#d4a843] hover:text-[#0f0f0d] transition-all cursor-pointer"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </aside>
    </>
  );
}

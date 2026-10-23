"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate, onScroll } from "animejs";

interface SectionDot {
  id: string;
  label: string;
}

const SECTIONS: SectionDot[] = [
  { id: "hero", label: "Home" },
  { id: "portal-marquee", label: "Stack" },
  { id: "projects", label: "Work" },
  { id: "systems", label: "Build Log" },
  { id: "about", label: "About" },
  { id: "experience", label: "Journey" },
  { id: "guestbook", label: "Guestbook" },
  { id: "contact", label: "Contact" },
];

export default function ScrollDots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: ReturnType<typeof onScroll> | null = null;

    try {
      // Use anime.js onScroll to track page progress
      observer = onScroll({
        target: document.body,
        enter: "top top",
        leave: "bottom bottom",
        sync: 0.08,
        onUpdate: (self) => {
          const progress = typeof self.progress === "number" ? self.progress : 0;
          const clamped = Math.min(1, Math.max(0, progress));
          setScrollProgress(clamped);
          setIsVisible(window.scrollY > 120);

          // Determine active section
          const scrollAnchor = window.scrollY + window.innerHeight * 0.4;
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const el = document.getElementById(SECTIONS[i].id);
            if (el && scrollAnchor >= el.offsetTop) {
              setActiveIndex(i);
              break;
            }
          }
        },
      });
    } catch (err) {
      console.warn("ScrollDots onScroll init:", err);
    }

    return () => {
      observer?.revert();
    };
  }, []);

  // Animate the progress fill line with anime.js
  useEffect(() => {
    if (!progressRef.current) return;
    animate(progressRef.current, {
      scaleY: scrollProgress,
      duration: 120,
      ease: "outQuad",
    });
  }, [scrollProgress]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className={`fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[700] transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Track line (background) */}
        <div
          ref={trackRef}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-[#f0ece4]/[0.06] rounded-full"
          style={{ top: 6, bottom: 6 }}
        />
        {/* Progress fill line (animated with anime.js) */}
        <div
          ref={progressRef}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-[#d4a843]/40 rounded-full origin-top"
          style={{ top: 6, bottom: 6, transform: "scaleY(0)" }}
        />

        {/* Dots */}
        <div className="relative flex flex-col items-center gap-[18px] py-1.5">
          {SECTIONS.map((section, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;
            const isHovered = idx === hoveredIndex;

            return (
              <div key={section.id} className="relative group">
                {/* Label tooltip */}
                <span
                  className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono tracking-wide transition-all duration-200 pointer-events-none ${
                    isHovered || isActive
                      ? "opacity-100 translate-x-0 text-[#f0ece4]"
                      : "opacity-0 translate-x-2 text-[#8a8a7a]"
                  }`}
                >
                  {section.label}
                </span>

                {/* Dot button */}
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-label={`Scroll to ${section.label}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isActive ? "scale-100" : "scale-100 hover:scale-110"
                  }`}
                  style={{ width: 14, height: 14 }}
                >
                  {/* Outer glow ring for active */}
                  {isActive && (
                    <span className="absolute inset-[-3px] rounded-full border border-[#d4a843]/30 animate-pulse" />
                  )}

                  {/* The dot itself */}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-[8px] h-[8px] bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.5)]"
                        : isPast
                        ? "w-[5px] h-[5px] bg-[#d4a843]/50"
                        : isHovered
                        ? "w-[6px] h-[6px] bg-[#f0ece4]/40"
                        : "w-[4px] h-[4px] bg-[#f0ece4]/15"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

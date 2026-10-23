"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Cat, Download, Menu, X } from "lucide-react";
import { asset } from "@/lib/basepath";
import { sounds } from "@/lib/soundFx";

const navLinks = [
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "portal-marquee" },
  { label: "Build Log", id: "dev-dashboard" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assistantMode, setAssistantMode] = useState<"cat" | "off">("cat");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Magnetic avatar physics for the existing top profile icon
  const pfpRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { damping: 14, stiffness: 220, mass: 0.1 });
  const smoothY = useSpring(rawY, { damping: 14, stiffness: 220, mass: 0.1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = pfpRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const magnetRadius = 100; // magnetic attraction radius

      if (dist < magnetRadius) {
        const pull = (1 - dist / magnetRadius) * 11; // smooth max 11px pull
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        rawX.set(Math.cos(angle) * pull);
        rawY.set(Math.sin(angle) * pull);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleModalState = (e: CustomEvent<{ open: boolean }>) => {
      setIsModalOpen(Boolean(e.detail?.open));
    };
    window.addEventListener("resume-modal-state", handleModalState as EventListener);
    return () => window.removeEventListener("resume-modal-state", handleModalState as EventListener);
  }, []);

  // Lock scroll and Lenis when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const triggerSearch = () => {
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const toggleAssistant = () => {
    const next = assistantMode === "cat" ? "off" : "cat";
    setAssistantMode(next);
    window.dispatchEvent(new CustomEvent("toggle-assistant", { detail: next }));
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] flex justify-center px-4 pt-4 sm:pt-5 pointer-events-none transition-all duration-300 ${
          isModalOpen ? "opacity-0 -translate-y-6" : "opacity-100 translate-y-0"
        }`}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "border-[#3a3a30] bg-[#121210]/95"
              : "border-[#2b2b24]/90 bg-[#141412]/90"
          }`}
        >
          {/* Integrated Magnetic Profile Avatar with Discord Pulse Dot */}
          <div ref={pfpRef} className="relative flex items-center select-none flex-shrink-0">
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              whileTap={{ scale: 0.94 }}
              onMouseEnter={() => sounds.playMinecraftPop()}
              onClick={() => sounds.playMinecraftXp()}
            >
              <Link
                href="/"
                className="group relative flex items-center gap-2.5"
                title="Parth Khansali"
              >
                <div className="relative">
                  <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 overflow-hidden rounded-full border border-white/20 bg-[#0c0c0e] shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#55FF55]/60">
                    <Image
                      src={asset("/profile.jpg")}
                      alt="Parth Khansali"
                      width={34}
                      height={34}
                      className="h-full w-full object-cover grayscale contrast-110"
                      priority
                    />
                  </div>
                  {/* Discord-style Online Green Dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 z-30 flex h-2.5 w-2.5 pointer-events-none">
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-[#121210] bg-[#06d6a0] shadow-sm" />
                  </span>
                </div>
                <span className="font-display text-xs font-bold tracking-wider text-white uppercase group-hover:text-[#d4a843] transition-colors">
                  PARTH
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-4 lg:gap-6 md:flex">
            {navLinks.map((link) => {
              const href = isHome ? `#${link.id}` : `/#${link.id}`;
              return (
                <a
                  key={link.label}
                  href={href}
                  className="px-1 py-1 text-xs font-medium text-[#9e9e92] transition-colors hover:text-[#f0ece4]"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search */}
            <button
              onClick={triggerSearch}
              title="Quick Search (Cmd+K)"
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#9e9e92] transition-colors hover:text-[#f0ece4] cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-[#9e9e92]" />
              <span className="hidden sm:inline-block">Search</span>
              <kbd className="hidden sm:inline-block rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-[#7a7a6e]">
                ⌘K
              </kbd>
            </button>

            {/* Pet Toggle */}
            <button
              onClick={toggleAssistant}
              title={assistantMode === "cat" ? "Let the cat sleep" : "Wake the cat"}
              className={`flex h-8 w-8 items-center justify-center transition-all cursor-pointer ${
                assistantMode === "cat"
                  ? "text-[#eab308]"
                  : "text-[#6a6a5e] hover:text-[#f0ece4]"
              }`}
            >
              <Cat className="h-4 w-4" />
            </button>

            {/* Resume (Desktop) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#f4f0e6] px-4 py-1.5 sm:py-2 text-xs font-semibold text-[#121210] transition-all hover:bg-white active:scale-95 cursor-pointer shadow-sm"
              title="Preview and Download CV"
            >
              <Download className="h-3.5 w-3.5 text-[#121210]" />
              <span>Resume</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#1a1a16] text-[#f0ece4] md:hidden hover:bg-[#252520] transition-colors cursor-pointer"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-[#f0ece4]" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1001] flex flex-col bg-[#0f0f0d]/98 backdrop-blur-2xl md:hidden overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 pt-[max(1.2rem,env(safe-area-inset-top))] pb-4 border-b border-[#2b2b24]">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full overflow-hidden border border-[#333328]">
                  <Image
                    src={asset("/profile.jpg")}
                    alt="Parth Khansali"
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display text-sm font-bold tracking-wider text-[#f0ece4] uppercase">
                  Parth Khansali
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#1a1a16] text-[#8a8a7a] hover:text-[#f0ece4]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col items-start px-8 py-8 gap-5 flex-1">
              {navLinks.map((link) => {
                const href = isHome ? `#${link.id}` : `/#${link.id}`;
                return (
                  <a
                    key={link.label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-xl font-bold tracking-tight text-[#f0ece4] transition-colors hover:text-[#d4a843]"
                  >
                    {link.label}
                  </a>
                );
              })}

              <div className="w-full pt-6 mt-2 border-t border-[#2b2b24] space-y-3">
                <button
                  type="button"
                  onClick={triggerSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#333328] bg-[#171714] px-4 py-3 text-sm font-medium text-[#c5c2b8] hover:text-[#f0ece4] transition-colors"
                >
                  <Search className="h-4 w-4 text-[#8a8a7a]" />
                  <span>Search Projects &amp; Skills</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("open-resume-modal"));
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0ece4] px-4 py-3 text-sm font-semibold text-[#0f0f0d] transition-colors hover:bg-white"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume (PDF)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

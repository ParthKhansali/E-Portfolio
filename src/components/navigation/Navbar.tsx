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

  const triggerSearch = () => {
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
        className={`fixed top-0 left-0 right-0 z-[999] flex justify-center px-4 py-4 sm:py-5 pointer-events-none transition-all duration-300 ${
          isModalOpen ? "opacity-0 -translate-y-6" : "opacity-100 translate-y-0"
        }`}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 rounded-full border px-4 py-2 sm:px-5 sm:py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "border-[#3e3e34] bg-[#141412]/92 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
              : "border-[#333328]/70 bg-[#141412]/80"
          }`}
          style={{ minWidth: "min(100%, 680px)" }}
        >
          {/* Integrated Magnetic Profile Avatar with Discord Pulse Dot */}
          <div ref={pfpRef} className="relative flex items-center select-none">
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
                  <div className="h-9 w-9 sm:h-9.5 sm:w-9.5 overflow-hidden rounded-full border border-white/20 bg-[#0c0c0e] shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-[#55FF55]/60">
                    <Image
                      src={asset("/profile.jpg")}
                      alt="Parth Khansali"
                      width={38}
                      height={38}
                      className="h-full w-full object-cover grayscale contrast-110"
                      priority
                    />
                  </div>
                  {/* Discord-style Online Green Pulse Dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 z-30 flex h-3 w-3 pointer-events-none">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-80" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#08080a] bg-[#06d6a0] shadow-sm" />
                  </span>
                </div>
                <span className="hidden sm:inline-block font-display text-xs font-bold tracking-wider text-white uppercase group-hover:text-[#d4a843] transition-colors">
                  Parth
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const href = isHome ? `#${link.id}` : `/#${link.id}`;
              return (
                <a
                  key={link.label}
                  href={href}
                  className="px-3 py-1 text-xs font-medium text-[#8a8a7a] transition-colors hover:text-[#f0ece4]"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={triggerSearch}
              title="Quick Search (Cmd+K)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8a8a7a] transition-colors hover:text-[#f0ece4]"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Search</span>
              <kbd className="hidden sm:inline-block rounded bg-[#f0ece4]/[0.06] px-1 text-[10px] text-[#6a6a5e]">
                ⌘K
              </kbd>
            </button>

            {/* Pet Toggle */}
            <button
              onClick={toggleAssistant}
              title={assistantMode === "cat" ? "Let the cat sleep" : "Wake the cat"}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                assistantMode === "cat"
                  ? "text-[#d4a843]"
                  : "text-[#6a6a5e] hover:text-[#f0ece4]"
              }`}
            >
              <Cat className="h-4 w-4" />
            </button>

            {/* Resume */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg bg-[#f0ece4] px-4 py-1.5 text-xs font-semibold text-[#0f0f0d] transition-all hover:bg-white cursor-pointer active:scale-95"
              title="Preview and Download CV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Resume</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="flex h-8 w-8 items-center justify-center text-[#f0ece4] md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center bg-[#0f0f0d]/97 px-6 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl font-bold tracking-tight text-[#f0ece4] transition-colors hover:text-[#d4a843]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("open-resume-modal"));
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-[#f0ece4] px-6 py-3 text-sm font-semibold text-[#0f0f0d] cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Resume</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

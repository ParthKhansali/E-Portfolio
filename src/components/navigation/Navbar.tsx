"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Search, Cat, Download, Menu, X } from "lucide-react";
import { asset } from "@/lib/basepath";

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
          className={`pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 rounded-full border border-white/10 px-4 py-2 sm:px-6 sm:py-2.5 transition-all duration-500 ${
            scrolled
              ? "bg-[#08080a]/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "bg-[#08080a]/50 backdrop-blur-md"
          }`}
        >
          {/* Profile Avatar with Discord Pulse Dot */}
          <Link href="/" className="group relative flex items-center gap-2.5">
            <div className="relative">
              <div className="h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-[#0c0c0e] shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={asset("/profile.jpg")}
                  alt="Parth Khansali"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover grayscale contrast-110"
                  priority
                />
              </div>
              {/* Discord-style Online Green Pulse Dot - completely unclipped, sits over both pfp and navbar header */}
              <span className="absolute -bottom-0.5 -right-0.5 z-30 flex h-3 w-3 pointer-events-none">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-80" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#08080a] bg-[#06d6a0] shadow-sm" />
              </span>
            </div>
            <span className="hidden sm:inline-block font-display text-xs font-bold tracking-wider text-white uppercase">
              Parth
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const href = isHome ? `#${link.id}` : `/#${link.id}`;
              return (
                <a
                  key={link.label}
                  href={href}
                  className="px-3.5 py-1 text-xs font-medium tracking-wide text-[#999] transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2">
            {/* Search Command Palette Trigger Button */}
            <button
              onClick={triggerSearch}
              title="Quick Search (⌘K)"
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-[#aaa] transition-all hover:border-[#4361ee]/40 hover:bg-white/[0.06] hover:text-white"
            >
              <Search className="h-3.5 w-3.5 text-[#888]" />
              <span className="hidden sm:inline-block">Search</span>
              <kbd className="hidden sm:inline-block rounded bg-white/[0.06] px-1 text-[10px] font-mono text-[#777]">
                ⌘K
              </kbd>
            </button>

            {/* Pet Assistant Toggle */}
            <button
              onClick={toggleAssistant}
              title={assistantMode === "cat" ? "Let the cat sleep" : "Wake the cat"}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                assistantMode === "cat"
                  ? "border-[#4361ee]/40 bg-[#4361ee]/15 text-white"
                  : "border-white/[0.08] bg-white/[0.02] text-[#666] hover:text-white"
              }`}
            >
              <Cat className="h-4 w-4" />
            </button>

            {/* Resume Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[#4361ee] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(67,97,238,0.3)] transition-all hover:bg-[#3451d1] cursor-pointer active:scale-95"
              title="Preview & Download CV / Resume"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Resume</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
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
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-2xl px-6 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl font-bold tracking-tight text-white transition-colors hover:text-[#4361ee]"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("open-resume-modal"));
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4361ee] px-6 py-3 text-sm font-semibold text-white cursor-pointer"
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

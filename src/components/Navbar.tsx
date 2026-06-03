"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MagneticButton from "./MagneticButton";

const navLinks = [
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      setHidden(current > lastScroll && current > 300);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#050505]/70 backdrop-blur-xl border-b border-white/[0.04]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link href="/" className="group relative" data-cursor="pointer">
            <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#4361ee]">
              PK
            </span>
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#4361ee] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const href = isHome ? `#${link.id}` : `/#${link.id}`;
              return (
                <MagneticButton
                  key={link.label}
                  href={href}
                  strength={0.2}
                  className="relative px-4 py-2 text-sm font-medium text-[#888] transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </MagneticButton>
              );
            })}
            <MagneticButton
              href="/resume"
              className="ml-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-[#4361ee]/40 hover:bg-[#4361ee]/10"
            >
              Resume
            </MagneticButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="relative z-[1001] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-cursor="pointer"
          >
            <motion.span
              className="block h-[1.5px] w-6 bg-white"
              animate={{
                rotate: mobileOpen ? 45 : 0,
                y: mobileOpen ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block h-[1.5px] w-6 bg-white"
              animate={{
                opacity: mobileOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[1.5px] w-6 bg-white"
              animate={{
                rotate: mobileOpen ? -45 : 0,
                y: mobileOpen ? -4 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-2xl"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => {
                const href = isHome ? `#${link.id}` : `/#${link.id}`;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="text-3xl font-light tracking-wide text-white transition-colors hover:text-[#4361ee]"
                      data-cursor="pointer"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  delay: navLinks.length * 0.08,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                <Link
                  href="/resume"
                  onClick={() => setMobileOpen(false)}
                  className="text-3xl font-light tracking-wide text-[#4361ee] transition-colors hover:text-white"
                  data-cursor="pointer"
                >
                  Resume
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

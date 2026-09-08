"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/SocialIcons";

const roleItems = [
  { role: "Developer", line: "I build things I wish already existed." },
  { role: "Builder", line: "I like ideas better once they're running." },
  { role: "Problem Solver", line: "I enjoy the part where \"this should be easy\" stops being true." },
  { role: "CS Student", line: "Usually building something." },
  { role: "Curious Engineer", line: "Currently somewhere between AI, systems and a lot of tabs." },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roleItems.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const currentItem = roleItems[currentIndex];

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* Ambient background glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#4361ee]/[0.03] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#7209b7]/[0.03] blur-[120px]" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Availability Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06d6a0] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06d6a0]" />
          </span>
          <span className="text-xs font-medium tracking-wide text-[#bbb]">
            Open to internships &amp; interesting engineering problems
          </span>
        </motion.div>

        {/* Name Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-[clamp(2.75rem,8vw,5.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white"
        >
          PARTH <span className="text-gradient">KHANSALI</span>
        </motion.h1>

        {/* Dynamic Role Ticker */}
        <div className="mt-3 mb-4 flex items-center justify-center gap-2 text-base md:text-lg text-[#777]">
          <span>Role:</span>
          <div className="relative h-[1.6em] min-w-[160px] overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentItem.role}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute font-semibold text-[#4361ee]"
              >
                {currentItem.role}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-3 max-w-2xl font-display text-2xl font-bold tracking-tight text-white md:text-3xl"
        >
          I build things I wish already existed.
        </motion.h2>

        {/* Rotating Supporting Thought */}
        <div className="h-7 mb-6 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentItem.line}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-sm font-medium italic text-[#888]"
            >
              &ldquo;{currentItem.line}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Hero Description */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-10 max-w-2xl space-y-3 text-sm leading-relaxed text-[#999] md:text-base text-center"
        >
          <p>
            I&apos;m Parth — a Computer Science student at Graphic Era Hill University. I like taking rough ideas, figuring out what actually matters, and turning them into software that feels good to use.
          </p>
          <p className="text-[#777]">
            I&apos;m strongest on the product side of engineering, but I like knowing what&apos;s happening underneath the screen too — from APIs and databases to systems, deployment and the occasional bug that refuses to explain itself.
          </p>
        </motion.div>

        {/* Tactile Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary CTA: See what I'm building */}
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 rounded-full border border-transparent bg-[#4361ee] px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_25px_rgba(67,97,238,0.3)] transition-all duration-300 hover:bg-[#3451d1] hover:shadow-[0_0_35px_rgba(67,97,238,0.5)] hover:scale-105"
          >
            See what I&apos;m building
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          {/* Secondary CTA: Read my story */}
          <a
            href="#about"
            className="btn-tactile group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.05] px-7 py-3.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#4361ee]"
          >
            <span className="btn-fill" />
            <span className="btn-content flex items-center gap-2">
              <BookOpen className="h-4 w-4 btn-icon" />
              Read my story
            </span>
          </a>
        </motion.div>

        {/* Social Icons Dock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center gap-3"
        >
          <SocialIcon
            href="https://github.com/ParthKhansali"
            label="GitHub"
            icon={GithubIcon}
          />
          <SocialIcon
            href="https://linkedin.com/in/parth-khansali"
            label="LinkedIn"
            icon={LinkedinIcon}
          />
          <SocialIcon
            href="mailto:parthkhansali@gmail.com"
            label="Email"
            icon={Mail}
          />
          <SocialIcon
            href="https://instagram.com/parth_khansali"
            label="Instagram"
            icon={InstagramIcon}
          />
        </motion.div>
      </div>

      {/* Scroll indicator with exact text: THERE'S MORE DOWN HERE ↓ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
      >
        <a
          href="#portal-marquee"
          aria-label="Scroll down"
          className="flex flex-col items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-[#666] transition-colors hover:text-white"
        >
          <span>THERE&apos;S MORE DOWN HERE ↓</span>
        </a>
      </motion.div>
    </section>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-[#888] transition-all duration-300 hover:border-[#4361ee]/40 hover:bg-[#4361ee]/10 hover:text-white hover:scale-105"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

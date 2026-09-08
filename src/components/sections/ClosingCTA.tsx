"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/SocialIcons";

export default function ClosingCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax scroll for the voxel night sky background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const skyY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // Relative mouse tracking on the card using CSS variables (0 React re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 py-32"
      aria-label="Contact and Collaboration"
    >
      {/* 1. Parallax Voxel Night Sky Background */}
      <motion.div
        style={{ y: skyY }}
        className="pointer-events-none absolute inset-x-0 -top-24 h-[160%] w-full z-0 opacity-40"
      >
        <Image
          src="/voxel-night-sky.png"
          alt="Voxel Night Sky Landscape"
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>

      {/* 2. Top Edge Blend Gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent z-1" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-1" />

      {/* 3. Centered Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Mascot Perched Directly on the Card */}
        <div className="relative mx-auto -mb-10 w-28 sm:w-36 z-20 transition-transform duration-500 hover:scale-110">
          <Image
            src="/llama-nobg.png"
            alt="Voxel Llama Mascot"
            width={240}
            height={240}
            className="h-auto w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>

        {/* MagicCard Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="group/cta relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/85 p-8 sm:p-12 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(67,97,238,0.15)]"
          style={
            {
              "--mouse-x": "-999px",
              "--mouse-y": "-999px",
            } as React.CSSProperties
          }
        >
          {/* Spotlight Radial Glow following cursor relative to card */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100"
            style={{
              background:
                "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(67, 97, 238, 0.15), transparent 70%)",
            }}
          />

          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-[#4361ee]">
            ONE LAST THING
          </span>

          <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-white leading-tight">
            Got something worth building?
          </h2>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#888] sm:text-base max-w-lg mx-auto">
            I&apos;m always interested in good ideas, interesting problems and projects where there&apos;s something new to learn.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="mailto:parthkhansali@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#4361ee] px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(67,97,238,0.4)] transition-all duration-300 hover:bg-[#3451d1] hover:shadow-[0_0_40px_rgba(67,97,238,0.6)] hover:scale-105"
            >
              <Mail className="h-4 w-4" />
              Let&apos;s talk
            </a>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-[#4361ee] hover:bg-white/[0.08] cursor-pointer"
            >
              Grab my resume
            </button>
          </div>

          {/* Contact Links Bar with Bullets */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-6 text-xs text-[#aaa]">
            <a
              href="https://github.com/ParthKhansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span className="text-[#444]">•</span>
            <a
              href="https://linkedin.com/in/parth-khansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <span className="text-[#444]">•</span>
            <a
              href="https://instagram.com/parth_khansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[#e1306c]"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

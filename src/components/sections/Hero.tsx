"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleField from "../ParticleField";
import MagneticButton from "../MagneticButton";
import RevealText from "../RevealText";

const titles = [
  "Developer",
  "Strategist",
  "Speaker",
  "Builder",
  "Problem Solver",
];

export default function Hero() {
  const [currentTitle, setCurrentTitle] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      id="hero"
    >
      {/* Particle Field */}
      <ParticleField />

      {/* Ambient gradient orbs */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(67, 97, 238, 0.04), transparent 50%)`,
        }}
      />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#4361ee]/[0.02] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#7209b7]/[0.02] blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        {/* Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <RevealText
            mode="char"
            className="mb-4 font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.05] tracking-[-0.04em] text-white"
            delay={0.3}
          >
            PARTH KHANSALI
          </RevealText>
        </motion.div>

        {/* Rotating subtitle */}
        <div className="mb-8 flex items-center justify-center gap-3 text-lg md:text-xl text-[#666]">
          <span>I am a</span>
          <div className="relative h-[1.5em] overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTitle}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="inline-block font-semibold text-[#4361ee]"
              >
                {titles[currentTitle]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-12 max-w-2xl text-base leading-relaxed text-[#888] md:text-lg"
        >
          Building digital systems and experiences at the intersection of
          technology, communication, and strategy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <MagneticButton
            href="#projects"
            className="inline-flex items-center justify-center group relative overflow-hidden rounded-full bg-[#4361ee] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(67,97,238,0.3)]"
          >
            <span className="relative z-10">View Projects</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </MagneticButton>
          <MagneticButton
            href="#about"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
          >
            Explore
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">
            Scroll
          </span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-[#666] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

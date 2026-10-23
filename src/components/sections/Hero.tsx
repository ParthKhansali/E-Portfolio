"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Mail, Gamepad2, RotateCw, Sparkles, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { asset } from "@/lib/basepath";
import { sounds } from "@/lib/soundFx";

const roles = [
  "Builder",
  "Systems Thinker",
  "MUN Director General",
  "Midnight Debugger",
  "Curious by Default",
];

const HERO_VISUALS = [
  {
    title: "Cosmic Event Horizon",
    video: "/media/cosmic-portal.mp4",
    gif: "/media/cosmic-portal.gif",
    tag: "COSMOS_PORTAL",
  },
  {
    title: "Dither Cyber Companion",
    video: "/media/dither-cat.mp4",
    gif: "/media/dither-cat.gif",
    tag: "AI_MASCOT",
  },
  {
    title: "Glitch Telemetry HUD",
    video: "/media/glitch-eyes.mp4",
    gif: "/media/glitch-eyes.gif",
    tag: "RETRO_OS",
  },
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visualIndex, setVisualIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const nextVisual = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playMinecraftPop();
    setVisualIndex((prev) => (prev + 1) % HERO_VISUALS.length);
  };

  const currentVisual = HERO_VISUALS[visualIndex];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-start md:justify-center px-6 md:px-12 lg:px-20 pt-32 sm:pt-36 pb-16"
    >
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[550px] w-[550px] rounded-full bg-[#d4a843]/[0.02] blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#22c55e]/[0.015] blur-[160px]" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-14">
        {/* Left Column: Name, Role, Bio, Actions */}
        <div className="max-w-xl">
          {/* Location & availability line */}
          <div className="mb-6 flex items-center gap-2.5 text-sm text-[#8a8a7a]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
            </span>
            <span>Dehradun, India · Currently taking on interesting problems</span>
          </div>

          {/* Name — large, left-aligned, confident */}
          <h1 className="font-display text-[clamp(3.2rem,7.5vw,5.5rem)] font-bold leading-[0.92] tracking-tight text-[#f0ece4]">
            Parth
            <br />
            Khansali
          </h1>

          {/* Rotating role — inline, subtle */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-sm text-[#6a6a5e]">/</span>
            <div className="relative h-[1.5em] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-lg font-medium text-[#b5b0a1]"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bio — direct, honest */}
          <p className="mt-8 text-[15px] leading-[1.7] text-[#8a8a7a]">
            CS undergrad in Dehradun who codes past midnight more often than
            I'd like to admit. I take half-formed ideas, figure out what
            actually matters, and ship software people end up relying on.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={() => sounds.playMinecraftPop()}
              className="group inline-flex items-center gap-2.5 rounded-lg bg-[#f0ece4] px-7 py-3.5 text-sm font-semibold text-[#121210] transition-all duration-200 hover:bg-white active:scale-[0.97]"
            >
              <span>See my work</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <a
              href="#about"
              onClick={() => sounds.playMinecraftPop()}
              className="inline-flex items-center gap-2 rounded-lg border border-[#333328] px-6 py-3.5 text-sm font-medium text-[#b5b0a1] transition-all duration-200 hover:border-[#555548] hover:text-[#f0ece4]"
            >
              <BookOpen className="h-4 w-4" />
              <span>About me</span>
            </a>
          </div>

          {/* Social links */}
          <div className="mt-10 flex items-center gap-1">
            <SocialLink href="https://github.com/ParthKhansali" label="GitHub" icon={GithubIcon} />
            <SocialLink href="https://linkedin.com/in/parth-khansali" label="LinkedIn" icon={LinkedinIcon} />
            <SocialLink href="mailto:parthkhansali@gmail.com" label="Email" icon={Mail} />
            <SocialLink href="https://instagram.com/parth_khansali" label="Instagram" icon={InstagramIcon} />
          </div>
        </div>

        {/* Right Column: Cosmic Visual Showcase & Telemetry Deck */}
        <div
          className="w-full lg:max-w-[420px] flex flex-col rounded-2xl border border-[#2b2b24] bg-[#141412]/90 backdrop-blur-md shadow-2xl overflow-hidden select-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#171714] border-b border-[#2b2b24] text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#22c55e]" />
              <span className="font-mono text-[11px] font-semibold text-[#f0ece4]">
                parth.craft · sys_deck
              </span>
            </div>

            <button
              type="button"
              onClick={nextVisual}
              title="Cycle video visual loop"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#2b2b24] bg-[#121210] hover:border-[#d4a843]/50 text-[10px] font-mono text-[#8a8a7a] hover:text-[#f0ece4] transition-colors cursor-pointer"
            >
              <RotateCw className="h-3 w-3" />
              <span>Cycle Loop</span>
            </button>
          </div>

          {/* Looping Visual Showcase */}
          <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#0c0c0a]">
            <video
              ref={videoRef}
              key={currentVisual.video}
              src={asset(currentVisual.video)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
            />

            {/* Scanline & Vignette Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141412] via-transparent to-transparent opacity-90" />

            {/* Overlay Chip */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono text-[#f0ece4]">
              <Sparkles className="h-3 w-3 text-[#d4a843]" />
              <span>{currentVisual.tag}</span>
            </div>

            {/* Bottom Caption inside Video */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="font-medium text-[#f0ece4] drop-shadow-md">
                {currentVisual.title}
              </span>
              <span className="text-[10px] font-mono text-[#8a8a7a]">
                0{visualIndex + 1} / 0{HERO_VISUALS.length}
              </span>
            </div>
          </div>

          {/* Engineering Telemetry Section */}
          <div className="p-4 space-y-3 bg-[#141412]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl border border-[#2b2b24] bg-[#171714]">
                <span className="text-[10px] font-mono uppercase text-[#7a7a6b] block">Flagship</span>
                <span className="font-semibold text-[#f0ece4] block mt-0.5 truncate">GEHU Connect</span>
                <span className="text-[10px] text-[#22c55e] font-mono">1,800+ Users</span>
              </div>

              <div className="p-2.5 rounded-xl border border-[#2b2b24] bg-[#171714]">
                <span className="text-[10px] font-mono uppercase text-[#7a7a6b] block">Throughput</span>
                <span className="font-semibold text-[#f0ece4] block mt-0.5 truncate">Kafka Stream</span>
                <span className="text-[10px] text-[#d4a843] font-mono">10k msgs/sec</span>
              </div>
            </div>

            {/* Current Focus Strip */}
            <div className="p-2.5 rounded-xl border border-[#2b2b24] bg-[#121210] flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-mono uppercase text-[#7a7a6b] block">Core Focus</span>
                <span className="text-xs text-[#c5c2b8] truncate block">
                  Distributed Systems &amp; Full-Stack Apps
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#22c55e] flex-shrink-0" />
            </div>

            {/* Quick Interactive Portals */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playMinecraftPop();
                  window.dispatchEvent(new CustomEvent("open-arcade"));
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#2b2b24] bg-[#171714] hover:border-[#d4a843]/50 text-xs font-medium text-[#f0ece4] transition-colors cursor-pointer"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-[#d4a843]" />
                <span>Open Lounge</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playMinecraftPop();
                  window.dispatchEvent(new CustomEvent("open-resume-modal"));
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#2b2b24] bg-[#171714] hover:border-white/30 text-xs font-medium text-[#f0ece4] transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-[#8a8a7a]" />
                <span>View CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll prompt — bottom left */}
      <div className="absolute bottom-4 left-6 md:left-12 lg:left-20">
        <a
          href="#portal-marquee"
          aria-label="Scroll down"
          className="text-[11px] tracking-wider text-[#555548] transition-colors hover:text-[#b5b0a1]"
        >
          keep going &darr;
        </a>
      </div>
    </section>
  );
}

function SocialLink({
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
      onMouseEnter={() => sounds.playClick(800, 0.02)}
      className="flex h-10 w-10 items-center justify-center text-[#6a6a5e] transition-colors duration-200 hover:text-[#f0ece4]"
    >
      <Icon className="h-[18px] w-[18px]" />
    </a>
  );
}

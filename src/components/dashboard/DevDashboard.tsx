"use client";

import { motion } from "framer-motion";
import GitTerminal from "./GitTerminal";
import DevMetrics from "./DevMetrics";
import MusicWidget from "./MusicWidget";

const buildPrinciples = [
  {
    step: "01",
    title: "Start with the problem",
    body: "Before reaching for a framework, I want to know what the thing is actually supposed to fix.",
    color: "#4361ee",
  },
  {
    step: "02",
    title: "Make it work",
    body: "Get the first version running. It will probably be ugly. That's fine.",
    color: "#06d6a0",
  },
  {
    step: "03",
    title: "Then make it good",
    body: "Clean up the edges, fix the awkward parts, simplify what can be simplified and make the interface feel intentional.",
    color: "#7209b7",
  },
  {
    step: "04",
    title: "Understand what's underneath",
    body: "I like knowing why something works — not just which package made it work.",
    color: "#c77dff",
  },
];

export default function DevDashboard() {
  return (
    <section
      id="dev-dashboard"
      className="section-padding relative overflow-hidden bg-[#050505] border-t border-white/[0.04]"
      aria-label="Build Log and Developer Systems Deck"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header: Build Log */}
        <div className="mb-12 flex flex-col items-center text-center px-4">
          <span className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#4361ee]">
            BUILD LOG
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-tight text-white">
            How I like to build
          </h2>
          <p className="mt-2.5 max-w-xl text-xs sm:text-sm text-[#888] leading-relaxed">
            Less &ldquo;I know everything.&rdquo; More &ldquo;give me the problem and let me figure it out.&rdquo;
          </p>
        </div>

        {/* 4 Build Principles Cards */}
        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {buildPrinciples.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
            >
              <span className="font-mono text-xs font-bold text-[#666] transition-colors group-hover:text-white">
                {item.step}
              </span>
              <h3 className="mt-3 text-base font-bold text-white transition-colors group-hover:text-[#4361ee]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#888]">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Small Humorous Line */}
        <div className="mb-16 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 text-xs text-[#777] italic">
            &ldquo;My favourite debugging strategy is still staring at the code until it becomes embarrassed.&rdquo;
          </p>
        </div>

        {/* Interactive Telemetry & Activity Tools */}
        <div className="flex flex-col gap-8">
          {/* 1. Interactive Git Terminal */}
          <GitTerminal />

          {/* 2. Coding Velocity (WakaTime) & GitHub Heatmap */}
          <DevMetrics />

          {/* 3. Spotify / Focus Audio Widget */}
          <MusicWidget />
        </div>
      </div>
    </section>
  );
}

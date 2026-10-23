"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const CURRENT_CARDS = [
  {
    key: "building",
    label: "Currently Building",
    body: "GEHU Connect (alpha with active university students) and ForgeFlow workflow automation. Plus whatever sparked curiosity this week.",
    accent: "#d4a843",
  },
  {
    key: "learning",
    label: "Currently Learning",
    body: "Backend depth, database internals, and systems fundamentals: the concepts that explain why things choke at scale.",
    accent: "#8fb573",
  },
  {
    key: "open",
    label: "Open To",
    body: "Software engineering internships, research collaborations, and engineering problems that are deeper than they look.",
    accent: "#c87941",
  },
];

const RABBIT_HOLES = [
  "AI That Anticipates",
  "Full-Stack Product Builds",
  "Frontend That Feels Right",
  "Distributed Systems",
  "Automating the Boring Parts",
  "Database Internals",
  "Maps & Geospatial",
  "Real-World Records",
  "DX That Doesn't Suck",
  "Whatever broke last week",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-[#0f0f0d] border-t border-[#f0ece4]/[0.06]"
      ref={ref}
      aria-label="About Parth Khansali"
    >
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.5rem)] font-bold tracking-tight text-[#f0ece4]">
            A bit about me
          </h2>
        </div>

        {/* 2-Column Grid: Portrait on Left, Bio on Right */}
        <div className="grid gap-10 md:grid-cols-12 items-start">
          {/* Left Column: Portrait Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5 lg:col-span-4"
          >
            <div className="rounded-xl border border-[#333328] bg-[#171714] p-3 sm:p-4">
              {/* Header bar */}
              <div className="mb-3 flex items-center justify-between text-xs text-[#8a8a7a]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#8fb573]" />
                  <span>Dehradun, India</span>
                </div>
                <span className="font-mono text-[10px] text-[#8a8a7a] tracking-wider uppercase">
                  Profile
                </span>
              </div>

              {/* Photo Frame */}
              <div
                className="relative aspect-square w-full overflow-hidden rounded-lg border border-[#333328] bg-[#1e1e1a]"
              >
                <Image
                  src="/profile.jpg"
                  alt="Parth Khansali"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Caption */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#6a6a5e] pt-2 border-t border-[#333328]">
                <span>Parth Khansali</span>
                <span>30.31° N, 78.03° E</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 lg:col-span-8 flex flex-col justify-between"
          >
            <div className="space-y-4 text-sm leading-relaxed text-[#8a8a7a]">
              <p>
                I'm a CS undergrad at Graphic Era Hill University, Dehradun. I like the whole arc of building something: the messy first sketch, the ugly prototype, the &ldquo;why is this breaking at 2am&rdquo; debugging session, and eventually the moment it clicks and real people start depending on the thing.
              </p>
              <p>
                Started with curiosity about how software actually works and followed it across mobile apps, web systems, AI, and database internals. I don't pretend to have it all figured out. Getting deeper into systems and understanding what happens under the hood is what keeps me going.
              </p>
              <p>
                Outside of code, I run the university MUN club as Director General. Organizing a conference and shipping software have more in common than you'd think: tight deadlines, moving parts, and something always breaks five minutes before the important thing.
              </p>
            </div>

            {/* 3 Status Cards underneath bio */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {CURRENT_CARDS.map((card, idx) => (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className="about-anime-card rounded-xl border border-[#333328] bg-[#171714] p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-[#f0ece4]">
                      {card.label}
                    </span>
                    <p className="mt-2 text-xs text-[#8a8a7a] leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rabbit Holes Section Below */}
        <div className="mt-14 border-t border-[#333328] pt-8">
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-[#f0ece4]">
              Rabbit holes I'm in right now
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {RABBIT_HOLES.map((tag) => (
              <span
                key={tag}
                className="rounded border border-[#333328] bg-[#171714] px-3 py-1.5 text-xs text-[#b5b0a1] transition-colors hover:border-[#555548] hover:text-[#f0ece4]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

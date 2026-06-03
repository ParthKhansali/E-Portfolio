"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText from "../RevealText";
import GlowCard from "../GlowCard";

const cards = [
  {
    title: "Machine Learning",
    icon: "🧠",
    color: "114, 9, 183",
  },
  {
    title: "Software Development",
    icon: "⚡",
    color: "67, 97, 238",
  },
  {
    title: "Leadership",
    icon: "🎯",
    color: "6, 214, 160",
  },
  {
    title: "Public Speaking",
    icon: "🎤",
    color: "255, 107, 107",
  },
  {
    title: "Strategy",
    icon: "♟️",
    color: "255, 190, 11",
  },
  {
    title: "Design Thinking",
    icon: "✨",
    color: "131, 56, 236",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          About
        </motion.span>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left — Text */}
          <div className="flex flex-col gap-8">
            <RevealText
              mode="word"
              className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white"
            >
              Building at the intersection of technology and human experience.
            </RevealText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-5"
            >
              <p className="text-base leading-relaxed text-[#888]">
                I don&apos;t just write code — I think in systems. Whether
                it&apos;s architecting a machine learning pipeline, leading a
                team through a complex product launch, or crafting a narrative
                that moves an audience, I approach every challenge as a design
                problem waiting to be solved.
              </p>
              <p className="text-base leading-relaxed text-[#888]">
                My work sits at the convergence of engineering precision and
                creative vision. I believe the most impactful technology is
                built by people who understand both the technical constraints
                and the human stories behind every product.
              </p>
              <p className="text-base leading-relaxed text-[#666]">
                Currently exploring the frontiers of AI/ML, building tools that
                amplify human capability, and speaking about technology&apos;s
                role in shaping the future.
              </p>
            </motion.div>
          </div>

          {/* Right — Floating Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.1,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                <GlowCard
                  className="flex flex-col items-center gap-3 p-6 text-center"
                  glowColor={card.color}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <span className="text-sm font-medium text-[#ccc]">
                    {card.title}
                  </span>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { experience } from "@/data/experience";
import RevealText from "../RevealText";

const typeColors: Record<string, string> = {
  leadership: "#4361ee",
  technical: "#06d6a0",
  speaking: "#7209b7",
};

const typeLabels: Record<string, string> = {
  leadership: "Leadership",
  technical: "Technical",
  speaking: "Speaking",
};

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="mx-auto max-w-4xl">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          Experience
        </motion.span>

        <RevealText
          mode="word"
          className="mb-16 font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          The journey so far.
        </RevealText>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-[19px] top-0 w-[1px] bg-gradient-to-b from-[#4361ee]/40 via-[#4361ee]/20 to-transparent md:left-1/2 md:-translate-x-1/2"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />

          {experience.map((entry, i) => {
            const isRight = i % 2 === 0;
            const color = typeColors[entry.type];

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: isRight ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.15,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className={`relative mb-12 pl-14 md:w-1/2 md:pl-0 ${
                  isRight
                    ? "md:pr-16 md:text-right"
                    : "md:ml-auto md:pl-16 md:text-left"
                }`}
              >


                {/* For mobile: the node is on the left */}
                <div
                  className="absolute left-[12px] top-2 z-10 h-[15px] w-[15px] rounded-full border-2 md:hidden"
                  style={{
                    borderColor: color,
                    background: `${color}33`,
                    boxShadow: `0 0 12px ${color}40`,
                  }}
                >
                  <div
                    className="absolute inset-[3px] rounded-full"
                    style={{ background: color }}
                  />
                </div>

                {/* Desktop node positioned on timeline center line */}
                <div
                  className="absolute top-2 z-10 hidden h-[15px] w-[15px] rounded-full border-2 md:block"
                  style={{
                    borderColor: color,
                    background: `${color}33`,
                    boxShadow: `0 0 12px ${color}40`,
                    ...(isRight
                      ? { right: "-7.5px" }
                      : { left: "-7.5px" }),
                  }}
                >
                  <div
                    className="absolute inset-[3px] rounded-full"
                    style={{ background: color }}
                  />
                </div>

                {/* Content card */}
                <div className="group">
                  <span
                    className="mb-2 inline-block rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      borderColor: `${color}40`,
                      color: color,
                    }}
                  >
                    {typeLabels[entry.type]}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {entry.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#888]">
                    {entry.organization}
                  </p>
                  <p className="mt-0.5 text-xs text-[#555]">{entry.period}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#777]">
                    {entry.description}
                  </p>
                  <ul
                    className={`mt-3 flex flex-col gap-1 ${
                      isRight ? "md:items-end" : ""
                    }`}
                  >
                    {entry.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-[#555]">
                        → {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

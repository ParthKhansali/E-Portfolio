"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Gavel, Trophy, GraduationCap } from "lucide-react";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [gavelTapped, setGavelTapped] = useState(false);

  const handleGavelClick = () => {
    setGavelTapped(true);
    // Subtle Web Audio click
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}

    setTimeout(() => setGavelTapped(false), 3000);
  };

  const timelineEntries = [
    {
      id: "mun-club",
      role: "Director General",
      org: "Graphic Era MUN Club",
      period: "2024 — Present",
      tag: "Leadership",
      color: "#4361ee",
      description:
        "I help run the university's MUN club — planning events, coordinating people, handling the unexpected and making sure things keep moving when the schedule inevitably doesn't.",
      highlights: [
        "Hosted 2 college-scale events",
        "Helped promote the club across 15–20 schools",
        "Participated in 4 MUNs and won 2",
        "Participated in an IIT Roorkee MUN",
      ],
      humanLine:
        "Turns out running an event and debugging an application have more in common than you'd think: something always breaks five minutes before the important part.",
      hasGavel: true,
    },
    {
      id: "hackathons",
      role: "HACKATHONS",
      org: "Hackaholic → iQOO Pune Hackathon",
      period: "3 Hackathons",
      tag: "3 hackathons. A lot of caffeine.",
      color: "#06d6a0",
      description:
        "I like the part where an idea has to become a working demo before the clock runs out.",
      highlights: [
        "Hackathon journey: Hackaholic → other hackathon sprints → iQOO Pune Hackathon",
        "Runner-up across hackathon experiences where applicable",
        "Fast-paced prototyping, scoping features under constraints, and shipping functional code before the deadline",
      ],
      icon: Trophy,
    },
    {
      id: "gehu-btech",
      role: "Computer Science & Engineering",
      org: "Graphic Era Hill University, Dehradun",
      period: "2024 — 2028",
      tag: "Academics",
      color: "#7209b7",
      description:
        "Studying computer science fundamentals — algorithms, data structures, databases, and system design.",
      highlights: [
        "Building real-world software across Web, Mobile, and AI",
        "Balancing coursework with club leadership and active project builds",
      ],
      icon: GraduationCap,
    },
  ];

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden bg-[#050505] border-t border-white/[0.04]"
      ref={ref}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center px-4"
        >
          <span className="mb-2.5 block text-xs uppercase tracking-[0.25em] font-semibold text-[#4361ee]">
            BEYOND THE CODE
          </span>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-tight text-white">
            People, projects &amp; a few microphones
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#888] max-w-lg mx-auto leading-relaxed">
            Software isn&apos;t the only thing I&apos;ve spent time building.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative border-l border-white/[0.08] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {timelineEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative group"
            >
              {/* Timeline Node Dot */}
              <div
                className="absolute -left-[31px] sm:-left-[47px] top-1.5 h-4 w-4 rounded-full border-2 border-[#050505] transition-transform duration-300 group-hover:scale-125"
                style={{
                  backgroundColor: entry.color,
                  boxShadow: `0 0 16px ${entry.color}80`,
                }}
              />

              {/* Card Container */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className="rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      borderColor: `${entry.color}40`,
                      color: entry.color,
                    }}
                  >
                    {entry.tag}
                  </span>
                  <span className="text-xs font-mono text-[#666]">{entry.period}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#4361ee]">
                      {entry.role}
                    </h3>
                    <p className="text-sm font-medium text-[#aaa]">{entry.org}</p>
                  </div>

                  {/* Interactive Gavel Easter Egg */}
                  {entry.hasGavel && (
                    <button
                      onClick={handleGavelClick}
                      title="Tap Gavel (Easter Egg)"
                      className="group/gavel relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#aaa] transition-all hover:scale-110 hover:border-[#4361ee] hover:text-[#4361ee] cursor-pointer"
                    >
                      <Gavel className="h-4 w-4 transition-transform group-hover/gavel:-rotate-12" />
                    </button>
                  )}
                </div>

                {/* Gavel Toast Notification */}
                <AnimatePresence>
                  {entry.hasGavel && gavelTapped && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#4361ee]/20 border border-[#4361ee]/40 px-3 py-1.5 text-xs text-white"
                    >
                      <span>*Gavel Taps*</span>
                      <span className="font-semibold text-[#06d6a0]">
                        &quot;The house comes to order. Point of inquiry recognized!&quot;
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#888]">
                  {entry.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-white/[0.04] pt-4">
                  {entry.highlights.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#777]">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#4361ee]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {entry.humanLine && (
                  <p className="mt-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3 text-xs italic text-[#aaa] leading-relaxed">
                    &ldquo;{entry.humanLine}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Gavel, Trophy, GraduationCap } from "lucide-react";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [gavelTapped, setGavelTapped] = useState(false);

  const handleGavelClick = () => {
    setGavelTapped(true);
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
      period: "2024 - Present",
      tag: "Leadership",
      color: "#d4a843",
      description:
        "I direct the university MUN club: organizing campus conferences, mentoring delegates, handling logistics, and keeping things running when schedules inevitably shift.",
      highlights: [
        "Hosted 2 university-scale conferences",
        "Coordinated outreach across 15+ partner schools and colleges",
        "Participated in 4 regional MUNs with 2 delegate delegations awards",
        "Delegated at IIT Roorkee MUN",
      ],
      humanLine:
        "Organizing an event and debugging software have a lot in common: something will inevitably break right before the important moment, and you just work the problem.",
      hasGavel: true,
    },
    {
      id: "hackathons",
      role: "Hackathon Sprints",
      org: "Hackaholic → iQOO Pune Hackathon",
      period: "3 Hackathons",
      tag: "Sprints",
      color: "#8fb573",
      description:
        "I love the intense sprint where an unvetted idea has to become a functional, deployed demo within 36 hours.",
      highlights: [
        "Hackaholic sprint to iQOO Pune Hackathon finals",
        "Rapid prototyping, aggressive feature scoping, and shipping functional backends under strict time limits",
        "Collaborated across multidisciplinary student teams under pressure",
      ],
      icon: Trophy,
    },
    {
      id: "gehu-btech",
      role: "B.Tech Computer Science & Engineering",
      org: "Graphic Era Hill University, Dehradun",
      period: "2024 - 2028",
      tag: "Academics",
      color: "#c87941",
      description:
        "Studying computer science foundations: data structures, algorithms, databases, operating systems, and distributed architecture.",
      highlights: [
        "Building production software across web, mobile, and AI workflows",
        "Balancing university coursework with active product development",
      ],
      icon: GraduationCap,
    },
  ];

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden bg-[#0f0f0d] border-t border-[#f0ece4]/[0.06]"
      ref={ref}
      aria-label="Experience and Leadership"
    >
      <div className="mx-auto max-w-4xl relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold tracking-wider text-[#d4a843] uppercase mb-2">
            Experience &amp; Leadership
          </p>
          <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#f0ece4]">
            Beyond the code
          </h2>
          <p className="mt-2 text-sm text-[#8a8a7a] max-w-lg leading-relaxed">
            Software isn't the only thing I spend time building.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#2b2b24] ml-3 sm:ml-6 pl-6 sm:pl-8 space-y-10">
          {timelineEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="experience-entry-card relative group"
            >
              {/* Timeline Node Dot */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-2 h-3.5 w-3.5 rounded-full border-2 border-[#0f0f0d]"
                style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}33` }}
              />

              {/* Card Container */}
              <div className="rounded-xl border border-[#333328] bg-[#171714] p-5 sm:p-6 transition-all duration-300 hover:border-[#555548]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className="border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded"
                    style={{
                      borderColor: `${entry.color}40`,
                      color: entry.color,
                      backgroundColor: `${entry.color}15`,
                    }}
                  >
                    {entry.tag}
                  </span>
                  <span className="text-xs text-[#6a6a5e] font-mono">{entry.period}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#f0ece4]">
                      {entry.role}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#b5b0a1]">{entry.org}</p>
                  </div>

                  {/* Interactive Gavel Easter Egg */}
                  {entry.hasGavel && (
                    <button
                      onClick={handleGavelClick}
                      title="Tap Gavel (Easter Egg)"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] transition-all hover:scale-105 hover:border-[#d4a843] hover:text-[#d4a843] cursor-pointer"
                    >
                      <Gavel className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Gavel Toast Notification */}
                <AnimatePresence>
                  {entry.hasGavel && gavelTapped && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-3 inline-flex items-center gap-2 rounded border border-[#d4a843]/40 bg-[#d4a843]/15 px-3 py-1.5 text-xs text-[#f0ece4]"
                    >
                      <span>*Gavel Taps*</span>
                      <span className="text-[#8fb573]">
                        &quot;The house comes to order. Point of inquiry recognized.&quot;
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#8a8a7a]">
                  {entry.description}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-[#333328] pt-3">
                  {entry.highlights.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8a8a7a]">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#d4a843]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {entry.humanLine && (
                  <p className="mt-3.5 border-l-2 border-[#333328] pl-3 text-xs text-[#6a6a5e] leading-relaxed italic">
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

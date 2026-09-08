"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Cpu, Network, MapPin, Wrench } from "lucide-react";
import GlowCard from "../GlowCard";

const technicalInterests = [
  {
    title: "AI Systems",
    desc: "How AI becomes part of a product instead of just a chat box.",
    icon: Sparkles,
    glow: "114, 9, 183",
  },
  {
    title: "Systems",
    desc: "Operating systems, concurrency, processes, memory and the machinery underneath the UI.",
    icon: Cpu,
    glow: "67, 97, 238",
  },
  {
    title: "Distributed Software",
    desc: "What happens when one machine isn't enough — and when the network inevitably has other plans.",
    icon: Network,
    glow: "6, 214, 160",
  },
  {
    title: "Data + Maps",
    desc: "Turning messy real-world information into something people can actually understand.",
    icon: MapPin,
    glow: "255, 190, 11",
  },
  {
    title: "Developer Experience",
    desc: "Tools and interfaces that make complicated things feel simpler.",
    icon: Wrench,
    glow: "131, 56, 236",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-[#050505] border-t border-white/[0.04]"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          {/* Left Column — About Me (Section 8) */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-3 block text-xs uppercase tracking-[0.25em] font-semibold text-[#4361ee]"
              >
                A LITTLE CONTEXT
              </motion.span>

              <h2 className="font-display text-[clamp(2.2rem,4vw,3.25rem)] font-bold tracking-tight text-white mb-6">
                So, who is Parth?
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#999]"
              >
                <p>
                  I&apos;m a Computer Science student who enjoys the whole process of building — the ridiculous first idea, the ugly prototype, the &ldquo;why is this not working?&rdquo; phase, and eventually the moment when it all clicks.
                </p>
                <p>
                  I started with the usual curiosity about code and kept following it into web apps, mobile products, AI, databases and systems. I still don&apos;t have everything figured out. That&apos;s part of what makes it fun.
                </p>
                <p>
                  Outside code, I&apos;ve spent a fair amount of time around debating, MUNs, event organisation and people who enjoy arguing about whether a comma can change a resolution.
                </p>
              </motion.div>
            </div>

            {/* Closing Line Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md"
            >
              <p className="text-xs sm:text-sm italic font-medium text-[#ccc] leading-relaxed">
                &ldquo;I like software that works, interfaces that feel good, and projects that leave me with a better question than the one I started with.&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Right Column — Technical Interests (Section 6) */}
          <div className="flex flex-col lg:col-span-6">
            <div className="mb-6">
              <span className="mb-2 block text-xs uppercase tracking-[0.25em] font-semibold text-[#c77dff]">
                CURRENTLY OBSESSED WITH
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                Things I&apos;m digging into
              </h3>
              <p className="mt-1 text-xs text-[#777]">
                The rabbit holes currently winning.
              </p>
            </div>

            {/* Interests Cards */}
            <div className="space-y-3">
              {technicalInterests.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 * idx }}
                  >
                    <GlowCard
                      glowColor={item.glow}
                      className="group p-4 transition-colors hover:border-white/15"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white transition-colors group-hover:border-[#4361ee]/40 group-hover:bg-[#4361ee]/10">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white transition-colors group-hover:text-[#4361ee]">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#888]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

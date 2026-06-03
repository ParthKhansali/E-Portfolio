"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Code2,
  Blocks,
  Database,
  Lightbulb,
  Users,
  MessageSquare,
  Target,
  Palette,
  Film,
  Layers,
  Sparkles,
} from "lucide-react";
import { skillCategories } from "@/data/skills";
import GlowCard from "../GlowCard";
import RevealText from "../RevealText";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Code2,
  Blocks,
  Database,
  Lightbulb,
  Users,
  MessageSquare,
  Target,
  Palette,
  Film,
  Layers,
  Sparkles,
};

const categoryColors: Record<string, string> = {
  Development: "67, 97, 238",
  "AI & Core Systems": "6, 214, 160",
  Leadership: "114, 9, 183",
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          Capabilities
        </motion.span>

        <RevealText
          mode="word"
          className="mb-16 max-w-2xl font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          A multidisciplinary toolkit for building what matters.
        </RevealText>

        <div className="grid gap-10 md:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: catIndex * 0.15,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#666]">
                {category.title}
              </h3>
              <div className="flex flex-col gap-3">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = iconMap[skill.icon];
                  return (
                    <GlowCard
                      key={skill.name}
                      className="group p-5 transition-all duration-300"
                      glowColor={categoryColors[category.title]}
                    >
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="mt-0.5 flex-shrink-0">
                            <Icon className="h-5 w-5 text-[#555] transition-colors duration-300 group-hover:text-white" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-[#ccc] transition-colors duration-300 group-hover:text-white">
                            {skill.name}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#555] transition-all duration-300 group-hover:text-[#888]">
                            {skill.description}
                          </p>
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

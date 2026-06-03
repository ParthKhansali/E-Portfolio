"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import GlowCard from "@/components/GlowCard";
import RevealText from "@/components/RevealText";

const categories = [
  { label: "All", value: "all" },
  { label: "Mobile", value: "mobile" },
  { label: "ML", value: "ml" },
  { label: "Tools", value: "tools" },
];

const categoryColors: Record<string, string> = {
  ml: "#7209b7",
  web: "#4361ee",
  tools: "#06d6a0",
  mobile: "#ff6b6b",
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <main className="section-padding min-h-screen" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          Projects
        </motion.span>

        <RevealText
          mode="word"
          className="mb-6 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          Everything I&apos;ve built and shipped.
        </RevealText>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 max-w-lg text-base text-[#888]"
        >
          A collection of projects across machine learning, web development,
          tooling, and design systems.
        </motion.p>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`rounded-full border px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                filter === cat.value
                  ? "border-[#4361ee]/40 bg-[#4361ee]/10 text-white"
                  : "border-white/[0.06] bg-transparent text-[#666] hover:border-white/10 hover:text-[#999]"
              }`}
              data-cursor="pointer"
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                <GlowCard
                  className="flex h-full flex-col p-6"
                  glowColor={
                    categoryColors[project.category]
                      ?.replace("#", "")
                      .match(/.{2}/g)
                      ?.map((hex) => parseInt(hex, 16))
                      .join(", ") || "67, 97, 238"
                  }
                >
                  {/* Preview */}
                  <div className="mb-5 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e]">
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold opacity-20"
                        style={{
                          color: categoryColors[project.category],
                        }}
                      >
                        {project.title
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                    </div>
                  </div>

                  {/* Category badge */}
                  <span
                    className="mb-3 inline-block w-fit rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      borderColor: `${categoryColors[project.category]}40`,
                      color: categoryColors[project.category],
                    }}
                  >
                    {project.category}
                  </span>

                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[#777]">
                    {project.description}
                  </p>

                  {/* Tech */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-block rounded-full border border-white/[0.04] bg-white/[0.02] px-3.5 py-1 text-[10px] font-medium text-[#888] transition-colors hover:border-white/10 hover:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4 border-t border-white/[0.04] pt-4">
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#888] transition-colors hover:text-white"
                        data-cursor="pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {project.category === "mobile" ? "Website" : "Demo"}
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#888] transition-colors hover:text-white"
                        data-cursor="pointer"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Code2 className="h-3 w-3" />
                        Source
                      </a>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>
    </main>
  );
}

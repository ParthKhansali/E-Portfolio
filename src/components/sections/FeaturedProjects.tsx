"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { projects } from "@/data/projects";
import GlowCard from "../GlowCard";
import RevealText from "../RevealText";
import MagneticButton from "../MagneticButton";

const categoryColors: Record<string, string> = {
  ml: "#7209b7",
  web: "#4361ee",
  tools: "#06d6a0",
  mobile: "#ff6b6b",
};

export default function FeaturedProjects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const featured = projects.filter((p) => p.featured);

  return (
    <section
      id="projects"
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
          Projects
        </motion.span>

        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <RevealText
            mode="word"
            className="max-w-xl font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-white"
          >
            Selected work that pushes boundaries.
          </RevealText>
          <MagneticButton
            href="/projects"
            className="text-sm font-medium text-[#4361ee] transition-colors hover:text-white"
          >
            View All Projects →
          </MagneticButton>
        </div>

        <div className="flex flex-col gap-8">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.12,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <GlowCard className="group p-8 md:p-10">
                <div
                  className={`flex flex-col gap-8 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* Visual preview area */}
                  <div className="relative flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#0e0e0e] md:w-[45%]">
                    <div className="flex aspect-[16/10] items-center justify-center p-8">
                      <div className="text-center">
                        <div
                          className="mb-3 text-4xl font-bold opacity-20"
                          style={{
                            color: categoryColors[project.category],
                          }}
                        >
                          {project.title
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-[#555]">
                          {project.category}
                        </div>
                      </div>
                    </div>
                    {/* Gradient overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at center, ${categoryColors[project.category]}15, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-center gap-4">
                    <h3 className="font-display text-2xl font-bold text-white transition-colors group-hover:text-[#4361ee] md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#888] md:text-base">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-block rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-xs font-medium text-[#888] transition-colors hover:border-white/10 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-2 flex gap-4">
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#888] transition-colors hover:text-white"
                          data-cursor="pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {project.category === "mobile" ? "Website" : "Live Demo"}
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#888] transition-colors hover:text-white"
                          data-cursor="pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

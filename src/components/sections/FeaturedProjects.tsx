"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { projects, Project } from "@/data/projects";
import GlowCard from "../GlowCard";
import EnchantingParticles, { SgaRune } from "@/components/effects/EnchantingParticles";
import { asset } from "@/lib/basepath";

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Parallax scroll for floating ambient accents
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cloud1Y = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const cloud2Y = useTransform(scrollYProgress, [0, 1], [60, -40]);

  const displayedProjects = expanded ? projects : projects.slice(0, 2);

  // Listen for search palette project navigation
  useEffect(() => {
    const handleNavigate = (e: CustomEvent<{ id: string }>) => {
      const targetId = e.detail?.id;
      setExpanded(true);
      if (targetId) {
        setHighlightedId(targetId);
        setTimeout(() => {
          const el = document.getElementById(`project-${targetId}`) || document.getElementById("projects");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);

        setTimeout(() => {
          setHighlightedId(null);
        }, 3500);
      }
    };

    window.addEventListener("navigate-to-project", handleNavigate as EventListener);
    return () => {
      window.removeEventListener("navigate-to-project", handleNavigate as EventListener);
    };
  }, []);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setExpanded(true);
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#050505] scroll-mt-24"
      aria-label="Things I've Built"
    >
      {/* Floating Parallax Accents */}
      <motion.div
        style={{ y: cloud1Y }}
        className="pointer-events-none absolute right-4 top-24 z-0 h-44 w-44 rounded-full bg-[#4361ee]/[0.03] blur-3xl"
      />
      <motion.div
        style={{ y: cloud2Y }}
        className="pointer-events-none absolute left-4 bottom-20 z-0 h-52 w-52 rounded-full bg-[#7209b7]/[0.03] blur-3xl"
      />

      {/* Minecraft Standard Galactic Alphabet (SGA) Ambient Pixel Particles */}
      <EnchantingParticles />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header with Enlarged Enchanting Table Accent & Orbiting Glyphs */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#7209b7]/40 bg-[#7209b7]/15 px-5 py-2 backdrop-blur-md shadow-[0_0_35px_rgba(114,9,183,0.35)] transition-all hover:border-[#c77dff]/60 hover:shadow-[0_0_45px_rgba(199,125,255,0.5)]">
            
            {/* Left Floating SGA Glyph */}
            <span className="hidden sm:inline-block opacity-80 animate-pulse">
              <SgaRune runeIndex={4} className="w-3.5 h-3.5 text-[#00f5d4]" />
            </span>

            {/* Enchanting Table Sprite */}
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 overflow-hidden rounded-xl bg-black/40 p-1 border border-[#c77dff]/40 shadow-[0_0_20px_rgba(199,125,255,0.45)]">
              <Image
                src={asset("/enchanting-table.jpg")}
                alt="Enchanting Table"
                width={88}
                height={88}
                className="h-full w-full object-contain mix-blend-screen scale-125 animate-pulse"
                priority
              />
            </div>

            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#c77dff]">
              THINGS I&apos;VE BUILT
            </span>

            {/* Right Floating SGA Glyph */}
            <span className="hidden sm:inline-block opacity-80 animate-pulse">
              <SgaRune runeIndex={18} className="w-3.5 h-3.5 text-[#c77dff]" />
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-bold tracking-tight text-white">
            A few ideas that escaped the notes app
          </h2>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#888] md:text-base">
            Some started as college projects. Some started as &ldquo;wait, why doesn&apos;t this exist?&rdquo; Either way, I like building them far enough to find the interesting problems.
          </p>
        </div>

        {/* 2-Column Responsive Grid with Breathing Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {displayedProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              id={`project-${project.id}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`animate-breathing-${idx % 3} scroll-mt-28 rounded-3xl transition-all duration-700 ${
                highlightedId === project.id
                  ? "ring-2 ring-[#4361ee] shadow-[0_0_40px_rgba(67,97,238,0.6)] scale-[1.02]"
                  : ""
              }`}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* Expand / Collapse Pill Button */}
        {projects.length > 2 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleToggle}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#ccc] backdrop-blur-md transition-all duration-300 hover:border-[#4361ee]/50 hover:bg-[#4361ee]/10 hover:text-white"
            >
              {expanded ? (
                <>
                  <span>Show fewer projects</span>
                  <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  <span>Show all projects ({projects.length})</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const categoryGlow: Record<string, string> = {
    ml: "114, 9, 183",
    mobile: "6, 214, 160",
    tools: "67, 97, 238",
    web: "255, 107, 107",
  };

  const mainActionHref = project.links.demo || project.links.github || "#";

  return (
    <GlowCard
      className="group flex h-full flex-col justify-between p-7 sm:p-8"
      glowColor={categoryGlow[project.category] || "67, 97, 238"}
    >
      <div>
        {/* Top Meta: Category & Status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
            {project.category}
          </span>
          {project.status && (
            <span className="rounded-full border border-[#06d6a0]/30 bg-[#06d6a0]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#06d6a0]">
              {project.status}
            </span>
          )}
        </div>

        {/* Project Title */}
        <h3 className="font-display text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#4361ee]">
          {project.title}
        </h3>

        {/* Subtitle */}
        {project.subtitle && (
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#c77dff]">
            {project.subtitle}
          </p>
        )}

        {/* Project Description */}
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#888] whitespace-pre-line">
          {project.description}
        </p>

        {/* Tech Stack Chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] font-medium text-[#aaa] transition-colors group-hover:border-white/10 group-hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Links Row */}
      <div className="mt-7 flex items-center justify-between border-t border-white/[0.04] pt-5">
        <a
          href={mainActionHref}
          target={mainActionHref.startsWith("http") ? "_blank" : undefined}
          rel={mainActionHref.startsWith("http") ? "noopener noreferrer" : undefined}
          title="Open project ↗"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-[#4361ee]"
        >
          <span>{project.buttonText || "View project →"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>

        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777] transition-colors hover:text-white"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>Code</span>
          </a>
        )}
      </div>
    </GlowCard>
  );
}

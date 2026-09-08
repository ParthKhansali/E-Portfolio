"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Download,
  Code2,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  FileText,
} from "lucide-react";
import RevealText from "@/components/RevealText";
import { asset } from "@/lib/basepath";

const education = [
  {
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Graphic Era Hill University",
    location: "Dehradun, Uttarakhand",
    period: "2024 – 2028",
    details: "CGPA of 7.6",
  },
  {
    degree: "Senior Secondary Education (CBSE)",
    institution: "Doon International School",
    location: "Dehradun, Uttarakhand",
    period: "2024",
    details: "Class XII",
  },
  {
    degree: "Secondary Education (ICSE)",
    institution: "Summer Valley School",
    location: "Dehradun, Uttarakhand",
    period: "2022",
    details: "Class X",
  },
];

const projectsItems = [
  {
    title: "GEHU Connect – Student Community & Networking Platform",
    tech: "Java, Spring Boot, React Native, Expo, Cloudflare R2, AWS SDK",
    period: "2026",
    bullets: [
      "Engineered a full-stack university networking platform enabling student communication, community interaction, and centralized campus engagement.",
      "Designed and developed scalable REST APIs using Spring Boot and built a cross-platform mobile application using React Native and Expo.",
      "Implemented cloud-based media storage and optimized file handling workflows using Cloudflare R2 and AWS SDK integrations.",
      "Focused on modular backend architecture, scalable data flow, and production-oriented mobile application development practices.",
    ],
  },
  {
    title: "OmniMentor – Anticipatory AI Classroom OS",
    tech: "Next.js, React.js, Node.js, Python, AI APIs",
    period: "2026",
    bullets: [
      "Developed an AI-powered adaptive learning platform capable of predicting learner doubts and dynamically personalizing educational workflows.",
      "Built intelligent context-aware systems integrating AI APIs for automated explanation generation, learning assistance, and real-time interaction.",
      "Architected modular AI components including OmniProfile, OmniPredict, OmniLoop, and OmniFlow for scalable adaptive classroom experiences.",
      "Integrated frontend, backend, and AI orchestration pipelines to simulate production-grade intelligent educational systems.",
    ],
  },
  {
    title: "AutoHire – AI-Powered Hiring Platform",
    tech: "Node.js, Kafka, Zookeeper, MongoDB",
    period: "2025",
    bullets: [
      "Built an event-driven recruitment platform to automate candidate workflow management and reduce manual hiring coordination overhead.",
      "Implemented distributed asynchronous communication pipelines using Apache Kafka and Zookeeper for scalable backend event processing.",
      "Designed backend services for candidate tracking, workflow orchestration, and real-time recruitment pipeline management.",
      "Worked with distributed system concepts, scalable messaging infrastructure, and production-style backend architecture patterns.",
    ],
  },
];

const experienceItems = [
  {
    role: "Director General",
    org: "Graphic Era MUN Club",
    period: "2025",
    bullets: [
      "Leading and managing university-level MUN operations including committee planning, delegate management, event execution, and inter-team coordination.",
    ],
  },
  {
    role: "Host & Organizer",
    org: "University Model United Nations Conferences",
    period: "2025 – 2026",
    bullets: [
      "Successfully organized and hosted multiple Model United Nations conferences, overseeing event logistics, committee operations, and participant engagement.",
    ],
  },
  {
    role: "MUN Outreach & Public Speaking Initiatives",
    org: "School Outreach Program",
    period: "2025",
    bullets: [
      "Conducted MUN seminars, mock sessions, and promotional workshops across 15+ schools in Dehradun, helping increase student participation and awareness about competitive debating and diplomacy.",
    ],
  },
  {
    role: "Delegate Experience – International Relations & Debate",
    org: "UNGA DISEC, IOC & Global Committees",
    period: "2024 – Present",
    bullets: [
      "Represented countries including Pakistan, Switzerland, and Mexico across committees such as UNGA DISEC and IOC, strengthening skills in public speaking, negotiation, research, and leadership.",
    ],
  },
];

const certifications = [
  "Python Crash Course",
  "Introduction to Machine Learning",
  "Databases and SQL",
];

const skillsData = {
  languages: ["Java", "Python", "JavaScript", "SQL", "HTML/CSS"],
  frameworks: [
    "MERN Stack (MongoDB, Express.js, React.js, Node.js)",
    "Spring Boot",
    "React Native",
    "Next.js",
    "Expo",
  ],
  databases: ["MySQL", "MongoDB"],
  tools: [
    "Git",
    "GitHub",
    "Kafka",
    "Zookeeper",
    "Cloudflare R2",
    "AWS SDK",
    "Postman",
    "VS Code",
    "Figma",
    "Jupyter",
  ],
  coreConcepts: [
    "Data Structures & Algorithms",
    "OOP",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "REST APIs",
    "System Design",
  ],
};

export default function ResumePage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [viewMode, setViewMode] = useState<"interactive" | "pdf">("interactive");

  return (
    <main className="section-padding min-h-screen pt-28" ref={ref}>
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b border-white/[0.06] pb-10">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#4361ee] font-semibold"
            >
              Curriculum Vitae
            </motion.span>
            <RevealText
              mode="word"
              className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white"
            >
              Parth Khansali
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-2 text-base font-medium text-[#4361ee]"
            >
              Computer Science & Engineering Student · Builder
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#777]"
            >
              <span>Dehradun, Uttarakhand</span>
              <span className="opacity-30">•</span>
              <span>+91 7302908889</span>
              <span className="opacity-30">•</span>
              <a
                href="mailto:parthkhansali@gmail.com"
                className="transition-colors hover:text-white"
              >
                parthkhansali@gmail.com
              </a>
              <span className="opacity-30">•</span>
              <a
                href="https://linkedin.com/in/parth-khansali"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#4361ee]"
              >
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 flex-shrink-0"
          >
            {/* View Switcher Tabs */}
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
                  viewMode === "interactive"
                    ? "bg-[#4361ee] text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Web View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("pdf")}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
                  viewMode === "pdf"
                    ? "bg-[#4361ee] text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                PDF Preview
              </button>
            </div>

            {/* Direct Download Button */}
            <a
              href={asset("/parth_resume.pdf")}
              download="Parth_Khansali_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-[#4361ee] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(67,97,238,0.4)] transition-all duration-300 hover:bg-[#3451d1] hover:scale-105 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </motion.div>
        </div>

        {/* PDF Mode */}
        {viewMode === "pdf" && (
          <div className="mb-16 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#4361ee]" />
                Viewing official 2-page PDF
              </span>
              <a
                href={asset("/parth_resume.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#4361ee] hover:underline"
              >
                <span>Open in separate tab</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111114] p-2 shadow-2xl overflow-hidden">
              <iframe
                src={asset("/parth_resume.pdf#toolbar=0&navpanes=0")}
                className="w-full h-[85vh] rounded-xl border-0 bg-white"
                title="Parth Khansali Resume PDF"
              />
            </div>
          </div>
        )}

        {/* Interactive Mode */}
        {viewMode === "interactive" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Education */}
            <ResumeSection
              title="Education"
              icon={GraduationCap}
              delay={0}
              isInView={isInView}
            >
              <div className="flex flex-col gap-6">
                {education.map((edu, i) => (
                  <div key={i} className="group">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-base font-semibold text-white">
                        {edu.institution}
                      </h4>
                      <span className="text-xs font-mono text-[#555]">{edu.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#4361ee]">{edu.degree}</p>
                    <p className="mt-1 text-xs text-[#777]">
                      {edu.details} · {edu.location}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>

            {/* Projects */}
            <ResumeSection
              title="Projects"
              icon={FolderGit2}
              delay={0.1}
              isInView={isInView}
            >
              <div className="flex flex-col gap-8">
                {projectsItems.map((project, i) => (
                  <div key={i}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-base font-semibold text-white">
                        {project.title}
                      </h4>
                      <span className="text-xs font-mono text-[#555]">{project.period}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#4361ee] font-medium">{project.tech}</p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {project.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#888] leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4361ee]/60" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ResumeSection>

            {/* Skills */}
            <ResumeSection
              title="Technical Skills"
              icon={Code2}
              delay={0.15}
              isInView={isInView}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <SkillGroup label="Languages" items={skillsData.languages} />
                <SkillGroup label="Frameworks & Technologies" items={skillsData.frameworks} />
                <SkillGroup label="Databases" items={skillsData.databases} />
                <SkillGroup label="Cloud & Dev Tools" items={skillsData.tools} />
                <div className="sm:col-span-2">
                  <SkillGroup label="Core CS Concepts" items={skillsData.coreConcepts} />
                </div>
              </div>
            </ResumeSection>

            {/* Certifications */}
            <ResumeSection
              title="Certifications & Professional Development"
              icon={CheckCircle2}
              delay={0.2}
              isInView={isInView}
            >
              <ul className="flex flex-col gap-2.5">
                {certifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-[#aaa]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#06d6a0]" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </ResumeSection>

            {/* Experience & Leadership */}
            <ResumeSection
              title="Achievements & Extra Curriculars"
              icon={Briefcase}
              delay={0.25}
              isInView={isInView}
            >
              <div className="flex flex-col gap-7">
                {experienceItems.map((exp, i) => (
                  <div key={i}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-base font-semibold text-white">
                        {exp.role}
                      </h4>
                      <span className="text-xs font-mono text-[#555]">{exp.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#4361ee] font-medium">{exp.org}</p>
                    <ul className="mt-2.5 flex flex-col gap-1.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-[#888] leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4361ee]/60" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </div>
        )}
      </div>
    </main>
  );
}

function ResumeSection({
  title,
  icon: Icon,
  delay,
  isInView,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
  isInView: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.2 + delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="mb-10"
    >
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-4 w-4 text-[#4361ee]" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777]">
          {title}
        </h3>
      </div>
      <div className="ml-7 border-l border-white/[0.05] pl-6">{children}</div>
    </motion.div>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h5 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[#666]">
        {label}
      </h5>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-block rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1 text-xs text-[#aaa] transition-colors hover:border-[#4361ee]/40 hover:text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

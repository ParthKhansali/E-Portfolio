"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Award,
  Download,
  Code2,
  FolderGit2,
} from "lucide-react";
import RevealText from "@/components/RevealText";
import GlowCard from "@/components/GlowCard";
import MagneticButton from "@/components/MagneticButton";

const education = [
  {
    degree: "Bachelor of Technology in Computer Science Engineering",
    institution: "Graphic Era Hill University",
    period: "Graduation: 2028",
    details: "CGPA: 7.6 / 10",
  },
];

const projectsItems = [
  {
    title: "OmniMentor — Anticipatory AI Classroom OS",
    tech: "Next.js, React.js, Node.js, Python, Generative AI APIs",
    period: "2025",
    bullets: [
      "Designed and developed an AI-powered adaptive classroom system that personalizes learning environments in real time based on learner behavior and performance.",
      "Built predictive assistance workflows capable of anticipating user doubts and proactively generating contextual explanations in real time.",
      "Implemented adaptive learning pipelines using behavioral analysis, user profiling, and dynamic pacing systems.",
    ],
  },
  {
    title: "GEHU Connect — Student Community Mobile App",
    tech: "React Native, Expo, Java Spring Boot, REST APIs, Cloudflare R2, AWS SDK",
    period: "2024",
    bullets: [
      "Developed a full-stack mobile application designed to connect university students through community-driven interaction and campus networking features.",
      "Built scalable backend services using Java Spring Boot with RESTful APIs for authentication, user management, and application workflows.",
      "Integrated Cloudflare R2 object storage and AWS SDK services for efficient, high-throughput cloud media management and asset handling.",
    ],
  },
  {
    title: "AutoHire — Asynchronous Candidate Processing Platform",
    tech: "Node.js, Kafka, Zookeeper, MongoDB",
    period: "2024",
    bullets: [
      "Developed an automated hiring platform using event-driven architecture for scalable candidate processing workflows.",
      "Implemented asynchronous communication pipelines using Kafka and Zookeeper to improve system throughput and reliability.",
    ],
  },
];

const experienceItems = [
  {
    role: "Director General",
    org: "Graphic Era MUN Club",
    period: "2024 — Present",
    description:
      "Served as Director General, the second-highest leadership position in the university’s Model United Nations club. Led planning, coordination, and execution of 2 large-scale college-level debate and simulation events. Managed committee operations, delegate engagement, and cross-team coordination in high-pressure environments. Developed strong communication, leadership, negotiation, and organizational skills through public speaking and diplomatic simulations.",
  },
  {
    role: "College Ambassador",
    org: "National Social Summit 2025, IIT Roorkee",
    period: "2024 — 2025",
    description:
      "Led outreach and student engagement initiatives for IIT Roorkee’s National Social Summit 2025. Coordinated registrations, promotions, and student participation across university communities.",
  },
];

const achievements = [
  "Won awards in 2 Model United Nations conferences including participation at IIT Roorkee.",
  "Participated in 4+ MUN conferences focused on diplomacy, international relations, and public policy discussions.",
  "Built AI-powered adaptive systems and scalable cloud-integrated applications focused on intelligent interaction and real-world usability.",
];

const skillsData = {
  languages: ["C++", "Python", "Java", "JavaScript", "SQL"],
  frameworks: [
    "Spring Boot",
    "React Native",
    "Expo",
    "Node.js",
    "React.js",
    "Next.js",
  ],
  tools: ["Cloudflare R2", "AWS SDK", "REST APIs", "Git", "GitHub"],
  areas: [
    "Data Structures & Algorithms",
    "OOP",
    "System Design",
    "Event-Driven Architecture",
    "Adaptive Learning Systems",
    "AI Workflow Design",
    "Predictive Assistance Systems",
  ],
};

export default function ResumePage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <main className="section-padding min-h-screen" ref={ref}>
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-4 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
            >
              Resume
            </motion.span>
            <RevealText
              mode="word"
              className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white"
            >
              Parth Khansali
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-2 text-base font-medium text-[#4361ee]"
            >
              Developer · Strategist · Builder
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#666]"
            >
              <span>Dehradun, India</span>
              <span className="opacity-30">•</span>
              <a href="tel:7302908889" className="transition-colors hover:text-white">7302908889</a>
              <span className="opacity-30">•</span>
              <a href="mailto:parthkhansali@gmail.com" className="transition-colors hover:text-white">parthkhansali@gmail.com</a>
              <span className="opacity-30">•</span>
              <a href="https://github.com/ParthKhansali" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">github.com/ParthKhansali</a>
              <span className="opacity-30">•</span>
              <a href="https://linkedin.com/in/parth-khansali" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">linkedin.com/in/parth-khansali</a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-shrink-0"
          >
            <MagneticButton
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[#4361ee] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(67,97,238,0.3)]"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </MagneticButton>
          </motion.div>
        </div>

        {/* Education */}
        <ResumeSection
          title="Education"
          icon={GraduationCap}
          delay={0}
          isInView={isInView}
        >
          {education.map((edu, i) => (
            <div key={i} className="group">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="text-base font-semibold text-white">
                  {edu.degree}
                </h4>
                <span className="text-xs text-[#555]">{edu.period}</span>
              </div>
              <p className="mt-1 text-sm text-[#4361ee]">{edu.institution}</p>
              <p className="mt-2 text-sm text-[#777]">{edu.details}</p>
            </div>
          ))}
        </ResumeSection>

        {/* Experience */}
        <ResumeSection
          title="Experience & Leadership"
          icon={Briefcase}
          delay={0.1}
          isInView={isInView}
        >
          <div className="flex flex-col gap-8">
            {experienceItems.map((exp, i) => (
              <div key={i}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-base font-semibold text-white">
                    {exp.role}
                  </h4>
                  <span className="text-xs text-[#555]">{exp.period}</span>
                </div>
                <p className="mt-1 text-sm text-[#4361ee]">{exp.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#777]">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Skills */}
        <ResumeSection
          title="Technical Skills"
          icon={Code2}
          delay={0.2}
          isInView={isInView}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <SkillGroup label="Programming Languages" items={skillsData.languages} />
            <SkillGroup label="Frameworks & Technologies" items={skillsData.frameworks} />
            <SkillGroup label="Cloud & Infrastructure" items={skillsData.tools} />
            <SkillGroup label="Core Concepts & AI Systems" items={skillsData.areas} />
          </div>
        </ResumeSection>

        {/* Projects */}
        <ResumeSection
          title="Projects"
          icon={FolderGit2}
          delay={0.25}
          isInView={isInView}
        >
          <div className="flex flex-col gap-8">
            {projectsItems.map((project, i) => (
              <div key={i}>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-base font-semibold text-white">
                    {project.title}
                  </h4>
                  <span className="text-xs text-[#555]">{project.period}</span>
                </div>
                <p className="mt-1 text-xs text-[#4361ee] font-medium">{project.tech}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {project.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#777] leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4361ee]/60" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ResumeSection>

        {/* Achievements */}
        <ResumeSection
          title="Achievements"
          icon={Award}
          delay={0.3}
          isInView={isInView}
        >
          <ul className="flex flex-col gap-3">
            {achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#888]">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4361ee]" />
                {a}
              </li>
            ))}
          </ul>
        </ResumeSection>
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
        delay: 0.3 + delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="mb-12"
    >
      <div className="mb-6 flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#4361ee]" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#666]">
          {title}
        </h3>
      </div>
      <div className="ml-8 border-l border-white/[0.04] pl-6">{children}</div>
    </motion.div>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h5 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#555]">
        {label}
      </h5>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-block rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-xs text-[#888] transition-colors hover:border-[#4361ee]/20 hover:text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

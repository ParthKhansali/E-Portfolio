"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Globe, Link2, ArrowUpRight } from "lucide-react";
import RevealText from "../RevealText";
import MagneticButton from "../MagneticButton";

const socials = [
  {
    label: "Email",
    href: "mailto:parthkhansali@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/ParthKhansali",
    icon: Globe,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/parth-khansali",
    icon: Link2,
  },
];

export default function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="mx-auto max-w-4xl text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4361ee]/[0.02] blur-[120px]" />

        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 block text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          Get in Touch
        </motion.span>

        <RevealText
          mode="word"
          className="mb-6 font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          Let&apos;s build something meaningful.
        </RevealText>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mb-12 max-w-lg text-base text-[#888]"
        >
          Whether you have an idea, a project, or just want to connect — I&apos;m
          always open to meaningful conversations.
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16 flex items-center justify-center gap-6"
        >
          {socials.map((social) => (
            <MagneticButton
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-3 text-sm font-medium text-[#888] transition-all duration-300 hover:border-[#4361ee]/30 hover:text-white"
            >
              <social.icon className="h-4 w-4" />
              {social.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
            </MagneticButton>
          ))}
        </motion.div>

        {/* Resume download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <MagneticButton
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full bg-[#4361ee] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(67,97,238,0.3)]"
          >
            View Resume
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-24 border-t border-white/[0.04] pt-8"
        >
          <p className="text-xs text-[#444]">
            © {new Date().getFullYear()} Parth Khansali. Built with intention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

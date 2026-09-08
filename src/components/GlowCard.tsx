"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlowCard({
  children,
  className = "",
  glowColor = "67, 97, 238",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`group/glow relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0e0e0e] ${className}`}
      onMouseMove={handleMouseMove}
      data-cursor="card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      style={
        {
          "--glow-color": glowColor,
          "--mouse-x": "-999px",
          "--mouse-y": "-999px",
        } as React.CSSProperties
      }
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/glow:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(var(--glow-color), 0.05), transparent 60%)",
        }}
      />

      {/* Border glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/glow:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(var(--glow-color), 0.25), transparent 50%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          borderRadius: "1rem",
        }}
      />
      {children}
    </motion.div>
  );
}

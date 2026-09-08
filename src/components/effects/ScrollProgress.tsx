"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] h-[3px] w-full pointer-events-none bg-transparent"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[#4361ee] via-[#06d6a0] to-[#7209b7] shadow-[0_0_8px_rgba(6,214,160,0.6)]"
        style={{ scaleX }}
      />
    </div>
  );
}

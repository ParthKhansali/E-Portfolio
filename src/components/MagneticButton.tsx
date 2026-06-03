"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.3,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const isInternal = href && href.startsWith("/") && !href.startsWith("//");

  if (href) {
    if (isInternal) {
      return (
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
          onMouseMove={handleMouse}
          onMouseLeave={reset}
          className="inline-block"
        >
          <Link
            ref={ref as React.RefObject<HTMLAnchorElement>}
            href={href}
            onClick={onClick}
            className={className}
            data-cursor="pointer"
          >
            {children}
          </Link>
        </motion.div>
      );
    }
    return (
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className="inline-block"
      >
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          onClick={onClick}
          className={className}
          data-cursor="pointer"
          target={target}
          rel={rel}
        >
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-block"
    >
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        className={className}
        data-cursor="pointer"
      >
        {children}
      </button>
    </motion.div>
  );
}

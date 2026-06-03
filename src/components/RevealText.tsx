"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  mode?: "word" | "line" | "char";
  once?: boolean;
}

export default function RevealText({
  children,
  className = "",
  delay = 0,
  mode = "word",
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10%" });

  if (mode === "word") {
    const words = children.split(" ");
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <span className="inline">
          {words.map((word, i) => (
            <span key={i} className="inline-block">
              <span className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "100%" }}
                  animate={isInView ? { y: 0 } : { y: "100%" }}
                  transition={{
                    duration: 0.5,
                    delay: delay + i * 0.03,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </span>
      </div>
    );
  }

  if (mode === "char") {
    const words = children.split(" ");
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <span className="inline">
          {words.map((word, wordIdx) => {
            const prevWordsLength = words
              .slice(0, wordIdx)
              .reduce((acc, w) => acc + w.length, 0);

            return (
              <span key={wordIdx} className="inline-block">
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, charIdx) => {
                    const absoluteIdx = prevWordsLength + charIdx;
                    return (
                      <span key={charIdx} className="inline-block overflow-hidden">
                        <motion.span
                          className="inline-block"
                          initial={{ y: "100%" }}
                          animate={isInView ? { y: 0 } : { y: "100%" }}
                          transition={{
                            duration: 0.4,
                            delay: delay + absoluteIdx * 0.02,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
                {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            );
          })}
        </span>
      </div>
    );
  }

  // Line mode
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.6,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

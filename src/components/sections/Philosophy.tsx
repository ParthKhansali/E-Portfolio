"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText from "../RevealText";

const quotes = [
  {
    text: "The best technology disappears. It becomes the medium, not the message.",
    highlight: "disappears",
  },
  {
    text: "I build systems that amplify human capability — not replace it.",
    highlight: "amplify",
  },
  {
    text: "Every great product is a story well told through engineering.",
    highlight: "story",
  },
];

export default function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="section-padding relative overflow-hidden" ref={ref}>
      <div className="mx-auto max-w-5xl">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 block text-center text-xs uppercase tracking-[0.3em] text-[#4361ee]"
        >
          Philosophy
        </motion.span>

        <div className="flex flex-col gap-20">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.2,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="text-center"
            >
              <blockquote className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-light leading-[1.3] tracking-tight text-[#ccc]">
                {quote.text.split(quote.highlight).map((part, j, arr) => (
                  <span key={j}>
                    {part}
                    {j < arr.length - 1 && (
                      <span className="text-gradient font-medium">
                        {quote.highlight}
                      </span>
                    )}
                  </span>
                ))}
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="mx-auto mt-20 h-[1px] w-32 bg-gradient-to-r from-transparent via-[#4361ee]/30 to-transparent"
        />
      </div>
    </section>
  );
}

"use client";

import { Mail, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/icons/SocialIcons";

export default function ClosingCTA() {
  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0d] px-6 py-28 border-t border-[#f0ece4]/[0.06]"
      aria-label="Contact and Collaboration"
    >
      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[500px] rounded-full bg-[#d4a843]/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <div className="rounded-2xl border border-[#333328] border-t-2 border-t-[#d4a843]/60 bg-[#171714] p-8 sm:p-12 shadow-xl">
          <p className="text-xs font-semibold tracking-wider text-[#d4a843] uppercase mb-3">
            Get in touch
          </p>

          <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight text-[#f0ece4] leading-tight">
            Got something worth building?
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#8a8a7a] max-w-lg mx-auto">
            I'm always up for interesting conversations, hard engineering problems, or teams that move fast and care about the work. Worst case, we both learn something.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="mailto:parthkhansali@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-6 py-3 text-xs sm:text-sm font-semibold text-[#0f0f0d] transition-all hover:bg-[#e0b850] active:scale-95 shadow-[0_4px_20px_rgba(212,168,67,0.2)]"
            >
              <Mail className="h-4 w-4" />
              <span>parthkhansali@gmail.com</span>
            </a>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-resume-modal"))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#333328] px-5 py-3 text-xs sm:text-sm font-medium text-[#b5b0a1] transition-colors hover:border-[#555548] hover:text-[#f0ece4] cursor-pointer"
            >
              <span>View Resume</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Contact Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#333328] pt-6 text-xs text-[#8a8a7a]">
            <a
              href="https://github.com/ParthKhansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[#f0ece4]"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span className="text-[#333328]">·</span>
            <a
              href="https://linkedin.com/in/parth-khansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[#f0ece4]"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <span className="text-[#333328]">·</span>
            <a
              href="https://instagram.com/parth_khansali"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[#f0ece4]"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

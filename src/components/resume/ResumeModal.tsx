"use client";

import { useState, useEffect } from "react";
import { Download, ExternalLink, X, FileText } from "lucide-react";
import { asset } from "@/lib/basepath";

export default function ResumeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      window.dispatchEvent(new CustomEvent("resume-modal-state", { detail: { open: true } }));
      document.body.classList.add("resume-modal-active");
    };

    const handleClose = () => {
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent("resume-modal-state", { detail: { open: false } }));
      document.body.classList.remove("resume-modal-active");
    };

    window.addEventListener("open-resume-modal", handleOpen);
    window.addEventListener("close-resume-modal", handleClose);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-resume-modal", handleOpen);
      window.removeEventListener("close-resume-modal", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("resume-modal-active");
    };
  }, []);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("resume-modal-state", { detail: { open: false } }));
    document.body.classList.remove("resume-modal-active");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview Modal"
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 sm:p-5 md:p-6 animate-in fade-in duration-200"
      style={{ zIndex: 100000 }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-full max-w-5xl h-[90vh] rounded-2xl border border-[#333328] bg-[#141412] shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#333328] px-5 sm:px-7 py-3.5 sm:py-4 bg-[#1a1a16] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/30 flex-shrink-0 shadow-[0_0_15px_rgba(212,168,67,0.15)]">
              <FileText className="h-4 w-4" />
            </div>
            <div className="truncate">
              <h3 className="font-display text-sm sm:text-base font-bold text-[#f0ece4] truncate">
                Parth Khansali: Curriculum Vitae
              </h3>
              <p className="text-[11px] text-[#8a8a7a] font-mono truncate">
                Computer Science &amp; Engineering · Dehradun, Uttarakhand
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Open in New Tab */}
            <a
              href={asset("/parth_resume.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#333328] bg-[#1e1e1a] hover:bg-[#252520] hover:text-[#f0ece4] px-3.5 py-1.5 text-xs font-medium text-[#c5c2b8] transition-colors"
              title="Open full PDF in a new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Tab</span>
            </a>

            {/* Primary Download Button */}
            <a
              href={asset("/parth_resume.pdf")}
              download="Parth_Khansali_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] px-4 sm:px-5 py-2 text-xs font-semibold text-[#0f0f0d] shadow-[0_0_20px_rgba(212,168,67,0.25)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] hover:text-[#f0ece4] hover:bg-[#252520] transition-colors ml-1 cursor-pointer"
              aria-label="Close resume preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer with Canvas Backdrop */}
        <div className="relative flex-1 w-full bg-[#0f0f0d] p-2 sm:p-4 overflow-hidden flex items-center justify-center">
          <iframe
            src={asset("/parth_resume.pdf#view=FitH")}
            className="w-full h-full max-w-4xl rounded-xl border border-[#333328] shadow-2xl bg-white"
            title="Parth Khansali Resume Preview"
          />
        </div>

        {/* Mobile quick-download banner */}
        <div className="flex sm:hidden items-center justify-between px-4 py-2.5 bg-[#1a1a16] border-t border-[#333328] text-xs text-[#8a8a7a]">
          <span>Viewing Parth&apos;s Resume</span>
          <a
            href={asset("/parth_resume.pdf")}
            download="Parth_Khansali_Resume.pdf"
            className="text-[#d4a843] font-semibold underline"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FolderGit2, Code2, Briefcase, Download, Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/SocialIcons";
import { asset } from "@/lib/basepath";

interface SearchItem {
  id: string;
  title: string;
  category: "Projects" | "Skills" | "Leadership" | "Actions";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  target: string;
  type: "hash" | "url" | "action";
}

const items: SearchItem[] = [
  {
    id: "omnimentor",
    title: "OmniMentor",
    category: "Projects",
    description: "An AI classroom that tries to stay one step ahead.",
    icon: FolderGit2,
    target: "projects",
    type: "hash",
  },
  {
    id: "gehu-connect",
    title: "GEHU Connect",
    category: "Projects",
    description: "A campus that fits in your pocket.",
    icon: FolderGit2,
    target: "projects",
    type: "hash",
  },
  {
    id: "taskflow",
    title: "TaskFlow",
    category: "Projects",
    description: "Because \"I'll remember it\" is not a task-management system.",
    icon: FolderGit2,
    target: "projects",
    type: "hash",
  },
  {
    id: "forgeflow",
    title: "ForgeFlow",
    category: "Projects",
    description: "Turn the boring steps into a workflow.",
    icon: FolderGit2,
    target: "projects",
    type: "hash",
  },
  {
    id: "aranya",
    title: "ARANYA",
    category: "Projects",
    description: "From claim to impact. Forest Rights Act Intelligence Platform.",
    icon: FolderGit2,
    target: "projects",
    type: "hash",
  },
  {
    id: "kafka",
    title: "Apache Kafka & Distributed Queues",
    category: "Skills",
    description: "Asynchronous message streaming and pipeline design",
    icon: Code2,
    target: "portal-marquee",
    type: "hash",
  },
  {
    id: "springboot",
    title: "Java Spring Boot & REST APIs",
    category: "Skills",
    description: "Scalable backend services, cloud integrations, and secure endpoints",
    icon: Code2,
    target: "portal-marquee",
    type: "hash",
  },
  {
    id: "nextjs",
    title: "Next.js 16 & React 19",
    category: "Skills",
    description: "Full-stack web engineering, SSR, and dynamic user interfaces",
    icon: Code2,
    target: "portal-marquee",
    type: "hash",
  },
  {
    id: "mun",
    title: "Graphic Era MUN Club — Director General",
    category: "Leadership",
    description: "Second-highest executive officer leading strategic operations and debate",
    icon: Briefcase,
    target: "experience",
    type: "hash",
  },
  {
    id: "resume-action",
    title: "Download Resume PDF",
    category: "Actions",
    description: "Download Parth Khansali's latest curriculum vitae",
    icon: Download,
    target: asset("/parth_resume.pdf"),
    type: "action",
  },
  {
    id: "email-action",
    title: "Send Email (parthkhansali@gmail.com)",
    category: "Actions",
    description: "Open your mail client to start a conversation",
    icon: Mail,
    target: "mailto:parthkhansali@gmail.com",
    type: "url",
  },
  {
    id: "instagram-action",
    title: "Instagram",
    category: "Actions",
    description: "Follow and connect with Parth on Instagram",
    icon: InstagramIcon,
    target: "https://instagram.com/parth_khansali",
    type: "url",
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenTrigger = () => {
      setIsOpen(true);
      setSelectedIndex(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenTrigger);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenTrigger);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);

    if (item.category === "Projects") {
      window.dispatchEvent(
        new CustomEvent("navigate-to-project", { detail: { id: item.id } })
      );
      return;
    }

    if (item.type === "hash") {
      setTimeout(() => {
        const targetEl = document.getElementById(item.target);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    } else if (item.type === "url") {
      if (item.target.startsWith("http")) {
        window.open(item.target, "_blank");
      } else {
        window.location.href = item.target;
      }
    } else if (item.type === "action") {
      const a = document.createElement("a");
      a.href = item.target;
      a.download = "Parth_Khansali_Resume.pdf";
      a.click();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-2xl z-10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
              <Search className="h-5 w-5 text-[#666]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search the site..."
                className="w-full bg-transparent text-sm text-white placeholder-[#555] outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[#666] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#666]">
                Esc
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[340px] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors ${
                        isSelected ? "bg-[#4361ee]/15 text-white" : "text-[#aaa] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                            isSelected
                              ? "border-[#4361ee]/40 bg-[#4361ee]/20 text-white"
                              : "border-white/[0.06] bg-white/[0.02] text-[#888]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#666] line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#555] uppercase">
                        {item.category}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#666]">
                  Nothing here. Yet.
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[11px] text-[#666]">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono">↑</kbd>{" "}
                  <kbd className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono">↓</kbd> Navigate
                </span>
                <span>
                  <kbd className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono">↵</kbd> Select
                </span>
              </div>
              <span>Parth Khansali Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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
    title: "Graphic Era MUN Club: Director General",
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
  const listRef = useRef<HTMLDivElement>(null);

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

  // Lock background page scroll without disabling Lenis wheel events globally
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Keep selected item visible while navigating via Arrow keys
  useEffect(() => {
    if (!listRef.current) return;
    const activeItem = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

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
        <div
          data-lenis-prevent="true"
          onWheel={(e) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".command-results-scroll")) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 sm:pt-28 px-4"
        >
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
            data-lenis-prevent="true"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#333328] bg-[#171714] shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-[#333328] px-4 py-3.5 bg-[#1a1a16]">
              <Search className="h-5 w-5 text-[#8a8a7a]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search projects, skills, notes, or actions..."
                className="w-full bg-transparent text-sm text-[#f0ece4] placeholder-[#7a7a6b] outline-none cursor-text select-text"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[#8a8a7a] hover:text-[#f0ece4] transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="rounded-lg border border-[#333328] bg-[#1e1e1a] px-2 py-0.5 text-[10px] font-mono text-[#8a8a7a]">
                Esc
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="command-results-scroll max-h-[340px] overflow-y-auto overscroll-contain p-2 space-y-1"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      data-cursor="pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                        isSelected
                          ? "bg-[#d4a843]/15 text-[#f0ece4] border border-[#d4a843]/30 shadow-sm"
                          : "text-[#c5c2b8] border border-transparent hover:bg-[#1e1e1a] hover:border-[#333328]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                            isSelected
                              ? "border-[#d4a843]/40 bg-[#d4a843]/20 text-[#d4a843]"
                              : "border-[#333328] bg-[#1e1e1a] text-[#8a8a7a]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#f0ece4]">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#8a8a7a] line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md ${
                        isSelected ? "text-[#d4a843] bg-[#d4a843]/10" : "text-[#7a7a6b] bg-[#1e1e1a]"
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-[#8a8a7a]">
                  No matching items found. Try searching for &ldquo;Projects&rdquo; or &ldquo;Skills&rdquo;.
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-[#333328] bg-[#12120f] px-4 py-2.5 text-[11px] text-[#8a8a7a]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 font-mono text-[10px] text-[#c5c2b8]">↑</kbd>
                  <kbd className="rounded border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 font-mono text-[10px] text-[#c5c2b8]">↓</kbd>
                  <span className="ml-1">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 font-mono text-[10px] text-[#c5c2b8]">↵</kbd>
                  <span className="ml-1">Select</span>
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#6b6b5c]">Parth Khansali Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

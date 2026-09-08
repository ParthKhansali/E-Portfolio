"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Tab = "status" | "log" | "config" | "whoami";

export default function GitTerminal() {
  const [activeTab, setActiveTab] = useState<Tab>("status");
  const [copied, setCopied] = useState(false);

  const terminalData: Record<Tab, string> = {
    status: `# On branch main
# Your branch is up to date with 'origin/main'.
#
# Changes to be committed:
#   (use "git restore --staged <file>..." to unstage)
#	modified:   src/systems/OmniMentor/predictive_engine.py
#	modified:   src/pipelines/AutoHire/kafka_consumer.ts
#	new file:   src/cloud/GEHUConnect/cloudflare_r2.java
#
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#	notes/distributed_consensus.md
#
nothing added to commit but untracked files present (use "git add" to track)`,

    log: `commit 8f9b2d1c (HEAD -> main, origin/main)
Author: Parth Khansali <parthkhansali@gmail.com>
Date:   Mon Sep 7 14:00:00 2026 +0530

    feat(omnimentor): optimize predictive doubt intervention pipeline

commit 4e7a1b0f
Author: Parth Khansali <parthkhansali@gmail.com>
Date:   Sun Sep 6 18:22:14 2026 +0530

    perf(autohire): scale Kafka message consumption to 50k events/sec

commit 2c3d5e8a
Author: Parth Khansali <parthkhansali@gmail.com>
Date:   Fri Sep 4 11:45:30 2026 +0530

    refactor(gehu-connect): migrate media uploads to Cloudflare R2 bucket`,

    config: `[user]
	name = Parth Khansali
	email = parthkhansali@gmail.com
	username = ParthKhansali
[core]
	editor = code --wait
	autocrlf = input
[init]
	defaultBranch = main
[leadership]
	mun = Director General @ Graphic Era MUN Club
	outreach = College Ambassador @ NSS IIT Roorkee
[systems]
	focus = Adaptive AI, Event-Driven Architectures, Cloud Infrastructure`,

    whoami: `  _____           _   _       _  ___                     _ _ 
 |  __ \\         | | | |     | |/ / |                   | (_)
 | |__) |_ _ _ __| |_| |__   | ' /| |__   __ _ _ __  ___| |_ 
 |  ___/ _\` | '__| __| '_ \\  |  < | '_ \\ / _\` | '_ \\/ __| | |
 | |  | (_| | |  | |_| | | | | . \\| | | | (_| | | | \\__ \\ | |
 |_|   \\__,_|_|   \\__|_| |_| |_|\\_\\_| |_|\\__,_|_| |_|___/_|_|

 Name:      Parth Khansali
 Education: B.Tech CSE @ Graphic Era Hill University (2024-2028)
 Role:      Developer • Strategist • Builder
 Focus:     Distributed Systems, AI Anticipatory Workflows, Public Policy & Debate
 Contact:   parthkhansali@gmail.com | github.com/ParthKhansali`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalData[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c0d] font-mono shadow-2xl">
      {/* macOS Terminal Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        {/* Window Dots */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 hidden sm:inline-block text-[11px] font-medium text-[#666]">
            parth@systems: ~/workspace
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1">
          {(["status", "log", "config", "whoami"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                activeTab === tab
                  ? "bg-white/[0.08] text-white shadow"
                  : "text-[#777] hover:text-[#bbb]"
              }`}
            >
              {tab === "whoami" ? "whoami" : `git ${tab}`}
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          aria-label="Copy terminal content"
          className="flex items-center gap-1.5 rounded border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-[#888] transition-colors hover:border-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[#06d6a0]" />
              <span className="text-[#06d6a0]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Content Body */}
      <div className="max-h-[300px] overflow-x-auto p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-[#bbb]">
        <pre className="whitespace-pre">{terminalData[activeTab]}</pre>
      </div>
    </div>
  );
}

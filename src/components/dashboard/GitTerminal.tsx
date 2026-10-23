"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Terminal, CornerDownLeft, Sparkles, Check, Copy, Gamepad2 } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { asset } from "@/lib/basepath";

interface TerminalHistory {
  id: string;
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

const QUICK_COMMANDS = [
  "help",
  "whoami",
  "projects",
  "stack",
  "status",
  "game",
  "chai",
  "cat",
  "clear",
];

export default function GitTerminal() {
  const [history, setHistory] = useState<TerminalHistory[]>([
    {
      id: "intro-1",
      command: "",
      output: (
        <span className="text-[#666]">
          // the honest terminal: no fake commit logs, no invented metrics.
        </span>
      ),
    },
    {
      id: "intro-2",
      command: "whoami",
      output: (
        <div className="space-y-1">
          <p className="text-white font-medium">
            Parth Khansali: CS student, builder, professional tab collector.
          </p>
          <p className="text-[#888]">
            Dehradun, India · B.Tech CSE @ GEHU (2024-2028) · open to SWE internships and interesting problems.
          </p>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [copied, setCopied] = useState(false);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    let result: React.ReactNode = "";
    let isError = false;

    sounds.playCommandPop();

    if (lower === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (lower === "help") {
      result = (
        <div className="space-y-1 text-xs">
          <p className="text-[#06d6a0] font-semibold">Available commands:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1 font-mono text-[#aaa]">
            <span><strong className="text-white">whoami</strong>: bio & role</span>
            <span><strong className="text-white">projects</strong>: active builds</span>
            <span><strong className="text-white">stack</strong>: active technologies</span>
            <span><strong className="text-white">status</strong>: deployment states</span>
            <span><strong className="text-white">game</strong>: launch retro arcade</span>
            <span><strong className="text-white">chai</strong>: brew fresh focus</span>
            <span><strong className="text-white">weather</strong>: Dehradun skies</span>
            <span><strong className="text-white">cat &lt;file&gt;</strong>: read build notes</span>
            <span><strong className="text-white">open &lt;site&gt;</strong>: github / mail</span>
            <span><strong className="text-white">clear</strong>: clear screen</span>
          </div>
        </div>
      );
    } else if (lower === "game" || lower === "play" || lower === "arcade") {
      window.dispatchEvent(new CustomEvent("open-arcade"));
      sounds.playAchievement();
      result = (
        <div className="space-y-1 font-mono text-xs">
          <p className="text-[#06d6a0] font-bold flex items-center gap-1.5">
            <span>⚔️</span>
            <span>Booting Nether Rogue: Cyber Slasher...</span>
          </p>
          <p className="text-zinc-400">
            Double jump with Space / W. Slash bugs with X / J / Shift / Click. Grab Focus Boost for bullet time!
          </p>
        </div>
      );
    } else if (lower === "chai" || lower === "coffee") {
      result = (
        <div className="font-mono text-xs text-[#f5c451] space-y-1">
          <pre className="text-xs text-[#f5c451] leading-none">
{`   )  (
  (   ) )
 [=======]
  | chai |]
  |______|`}
          </pre>
          <p className="text-zinc-300 mt-1">
            Fresh cutting chai brewed. +100 focus, -20 compilation anxiety.
          </p>
        </div>
      );
    } else if (lower === "weather") {
      result = (
        <div className="font-mono text-xs space-y-1">
          <p className="text-white font-semibold">📍 Dehradun, Uttarakhand (Doon Valley)</p>
          <p className="text-zinc-400">21°C · Clear night sky over the foothills. Ideal weather for late-night building.</p>
        </div>
      );
    } else if (lower === "minecraft" || lower === "nether") {
      sounds.playAchievement();
      result = (
        <div className="font-mono text-xs text-[#c77dff] space-y-1">
          <p className="font-bold">🌌 Nether portal resonance detected.</p>
          <p className="text-zinc-400">Standard Galactic Alphabet decoded. Check the floating book in GEHU Connect.</p>
        </div>
      );
    } else if (lower === "music" || lower === "spotify") {
      result = (
        <div className="font-mono text-xs space-y-1">
          <p className="text-[#1DB954] font-semibold">🎵 Live Track Feed:</p>
          <p className="text-zinc-400">Scroll down to the Ambient Track Desk to see real-time playback from YouTube Music & Spotify.</p>
        </div>
      );
    } else if (lower === "whoami") {
      result = (
        <div className="space-y-1">
          <p className="text-white font-medium">
            Parth Khansali: CS student, builder, professional tab collector.
          </p>
          <p className="text-[#888]">
            Dehradun, India · B.Tech CSE @ Graphic Era Hill University (2024-2028)
          </p>
          <p className="text-[#06d6a0]">
            Focus: Distributed systems, adaptive AI workflows, mobile products, cloud infrastructure.
          </p>
        </div>
      );
    } else if (lower === "projects" || lower === "ls") {
      result = (
        <div className="space-y-1">
          <p className="text-[#c77dff] font-semibold">Workspace projects:</p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#06d6a0]">gehu-connect/ (alpha)</span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#4361ee]">omnimentor/</span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#4361ee]">forgeflow/ (building)</span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#ff6b6b]">aranya/ (gis)</span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#c77dff]">orvess-pat/ (sih)</span>
            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[#f5c451]">autohire/ (kafka)</span>
          </div>
        </div>
      );
    } else if (lower === "stack") {
      result = (
        <div className="space-y-1.5 text-xs">
          <p><span className="text-[#4361ee] font-semibold">Languages:</span> Java, Python, JavaScript, C++, SQL, HTML/CSS</p>
          <p><span className="text-[#06d6a0] font-semibold">Frontend:</span> React, Next.js, React Native, Expo, Tailwind</p>
          <p><span className="text-[#c77dff] font-semibold">Backend & Data:</span> Node.js, Express, Spring Boot, MongoDB, PostgreSQL, Kafka, Cloudflare R2</p>
        </div>
      );
    } else if (lower === "status") {
      result = (
        <div className="space-y-1 text-xs">
          <p><span className="text-[#06d6a0]">● live:</span> GEHU Connect: deployed, alpha, real users on campus, still evolving.</p>
          <p><span className="text-[#4361ee]">● building:</span> ForgeFlow: automation for repetitive terminal/file workflows.</p>
          <p><span className="text-[#c77dff]">● exploring:</span> OmniMentor, ARANYA records intelligence.</p>
        </div>
      );
    } else if (lower === "cat" || lower === "neko" || lower === "companion" || lower === "daemon") {
      sounds.playChirp();
      result = (
        <div className="space-y-2 font-mono text-xs">
          <div className="h-28 w-52 rounded-xl overflow-hidden border border-white/10 bg-black relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover filter contrast-[1.05]"
            >
              <source src={asset("/media/dither-cat.mp4")} type="video/mp4" />
            </video>
          </div>
          <p className="text-zinc-300">
            🐱 builder&apos;s daemon: running late-night sprints through the Doon Valley.
          </p>
        </div>
      );
    } else if (lower.startsWith("cat ")) {
      const target = lower.replace("cat ", "").trim();
      if (target.includes("gehu")) {
        result = (
          <p className="text-[#ccc]">
            GEHU Connect: A student networking platform for Graphic Era Hill University. Built with React Native, Spring Boot and Cloudflare R2. Real campus users, real bugs, active alpha.
          </p>
        );
      } else if (target.includes("forge")) {
        result = (
          <p className="text-[#ccc]">
            ForgeFlow: We got tired of creating the same files by copy-pasting, running commands and checking outputs. Pipeline: input → AI/process → file generation → execution → output.
          </p>
        );
      } else if (target.includes("philosophy")) {
        result = (
          <p className="text-[#ccc]">
            Something is annoying → could this be better? → build it → why did that break? → wait, this could be useful → make it nicer → repeat.
          </p>
        );
      } else {
        result = `cat: ${target}: No such file. Try 'ls' or 'projects'.`;
        isError = true;
      }
    } else if (lower.startsWith("open ")) {
      const site = lower.replace("open ", "").trim();
      if (site.includes("git")) {
        window.open("https://github.com/ParthKhansali", "_blank");
        result = "Opening GitHub in a new tab...";
      } else if (site.includes("linkedin")) {
        window.open("https://www.linkedin.com/in/parth-khansali/", "_blank");
        result = "Opening LinkedIn in a new tab...";
      } else if (site.includes("mail") || site.includes("email")) {
        window.location.href = "mailto:parthkhansali@gmail.com";
        result = "Opening default email client...";
      } else {
        result = `Unknown target: ${site}. Options: 'open github', 'open linkedin', 'open mail'.`;
        isError = true;
      }
    } else if (lower === "sudo") {
      result = "parth is not in the sudoers file. This incident will be reported to Parth Khansali.";
      isError = true;
    } else {
      result = `command not found: '${cmd}'. Type 'help' for available commands.`;
      isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: cmd,
        output: result,
        isError,
      },
    ]);
    setInputVal("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    }
  };

  const handleCopyHistory = () => {
    const text = history
      .map((h) => (h.command ? `$ ${h.command}\n` : "") + (typeof h.output === "string" ? h.output : ""))
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#09090b] font-mono shadow-2xl">
      {/* macOS Terminal Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] font-medium text-[#777]">
            parth@systems: ~/workspace
          </span>
          <button
            type="button"
            onClick={() => executeCommand("cat")}
            title="Summon builder daemon"
            className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[9.5px] text-zinc-400 hover:text-white hover:border-[#06d6a0]/40 transition-colors cursor-pointer"
          >
            <span>🐱</span>
            <span>daemon: active</span>
          </button>
        </div>

        {/* Copy Output Button */}
        <button
          onClick={handleCopyHistory}
          aria-label="Copy terminal buffer"
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10.5px] font-medium text-[#888] transition-colors hover:border-white/10 hover:text-white"
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

      {/* Terminal Output Body */}
      <div
        ref={terminalBodyRef}
        onClick={() => inputRef.current?.focus()}
        className="h-[250px] overflow-y-auto p-4 sm:p-5 text-xs sm:text-[13px] leading-relaxed text-[#bbb] scrollbar-thin scrollbar-thumb-white/10"
      >
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#06d6a0] font-semibold">parth@systems</span>
                  <span className="text-[#666]">:</span>
                  <span className="text-[#c77dff]">~</span>
                  <span className="text-[#666]">$</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              )}
              <div className={item.isError ? "text-[#f5c451]" : "text-[#bbb]"}>
                {item.output}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Command Input Line */}
      <div className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-2.5">
        <span className="text-[#06d6a0] font-semibold text-xs">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help' or click a command below..."
          autoComplete="off"
          spellCheck="false"
          aria-label="Interactive terminal input"
          className="flex-1 bg-transparent text-xs text-white placeholder-[#555] outline-none"
        />
        <button
          onClick={() => executeCommand(inputVal)}
          aria-label="Send terminal command"
          className="flex items-center gap-1 rounded bg-white/[0.04] px-2 py-1 text-[10px] text-[#888] hover:bg-[#4361ee]/20 hover:text-white transition-colors"
        >
          <span>Run</span>
          <CornerDownLeft className="h-2.5 w-2.5" />
        </button>
      </div>

      {/* Quick Suggested Command Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.04] bg-[#060608] px-4 py-2 text-[10px] text-[#666]">
        <span className="font-sans text-[10px] text-[#555] mr-1">Quick:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[#aaa] transition-colors hover:border-[#4361ee]/40 hover:bg-[#4361ee]/10 hover:text-white"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

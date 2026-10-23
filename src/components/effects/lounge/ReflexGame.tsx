"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, RotateCcw, AlertTriangle } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface ReflexGameProps {
  profile: VisitorProfile;
  onFinishGame: (score: number) => void;
  isActive: boolean;
}

type ReflexState = "idle" | "waiting" | "ready" | "result" | "early";

export default function ReflexGame({ profile, onFinishGame, isActive }: ReflexGameProps) {
  const [state, setState] = useState<ReflexState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pk_reflex_best");
      if (saved) setBestTime(parseInt(saved, 10));
    } catch {}
  }, []);

  const handleStart = () => {
    setState("waiting");
    setReactionTime(null);
    sounds.playFocus();

    // Random delay between 1.5s and 4.2s
    const delay = 1500 + Math.random() * 2700;
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setState("ready");
      sounds.playCoin();
    }, delay);
  };

  const handleTrigger = () => {
    if (state === "idle" || state === "result" || state === "early") {
      handleStart();
      return;
    }

    if (state === "waiting") {
      // False start!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState("early");
      sounds.playHit();
      return;
    }

    if (state === "ready") {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setState("result");
      sounds.playAchievement();

      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
        try {
          localStorage.setItem("pk_reflex_best", elapsed.toString());
        } catch {}
      }

      onFinishGame(elapsed);
    }
  };

  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleTrigger();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, state]);

  const getRating = (ms: number) => {
    if (ms < 200) return { label: "⚡ Sub-200ms Quantum Reflex", color: "#8fb573" };
    if (ms < 250) return { label: "🚀 Low-Latency Fiber", color: "#d4a843" };
    if (ms < 320) return { label: "☕ Solid Human Average", color: "#7d9eb5" };
    return { label: "🐢 High Ping / Packet Delay", color: "#c87941" };
  };

  return (
    <div className="flex flex-col select-none">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs font-mono text-[#8a8a7a]">
        <div className="flex items-center gap-4">
          <span>
            BEST PING:{" "}
            <strong className="text-[#8fb573]">{bestTime ? `${bestTime} ms` : "---"}</strong>
          </span>
          {reactionTime && (
            <span>
              LAST: <strong className="text-[#f0ece4]">{reactionTime} ms</strong>
            </span>
          )}
        </div>
        <span className="text-[#d4a843]">Compiler Latency Tester</span>
      </div>

      {/* Interactive Reflex Zone */}
      <div
        onClick={handleTrigger}
        className={`relative w-full h-[220px] sm:h-[240px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
          state === "idle"
            ? "bg-[#141412] hover:bg-[#191915]"
            : state === "waiting"
            ? "bg-[#291414]"
            : state === "ready"
            ? "bg-[#183922]"
            : state === "early"
            ? "bg-[#331c12]"
            : "bg-[#141412]"
        }`}
      >
        {state === "idle" && (
          <div className="space-y-2">
            <span className="text-3xl">⚡</span>
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Latency Reflex Sprint
            </h3>
            <p className="text-xs text-[#8a8a7a] max-w-sm leading-relaxed">
              When the dark red screen flashes EMERALD GREEN, tap or press SPACE instantly.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-[#f0ece4] text-[#0f0f0d] px-5 py-2 text-xs font-semibold rounded-lg hover:bg-white transition-colors">
                Click or Press Space to Test
              </span>
            </div>
          </div>
        )}

        {state === "waiting" && (
          <div className="space-y-2">
            <div className="h-4 w-4 rounded-full bg-[#c87941] animate-ping mx-auto" />
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Wait for green...
            </h3>
            <p className="text-xs text-[#c5c2b8]">
              Compiler pipeline compiling. Do NOT tap yet.
            </p>
          </div>
        )}

        {state === "ready" && (
          <div className="space-y-1">
            <Zap className="h-8 w-8 text-[#8fb573] mx-auto animate-bounce" />
            <h2 className="font-display text-3xl font-extrabold text-[#8fb573] tracking-wide">
              CLICK NOW!
            </h2>
            <p className="text-xs text-[#f0ece4]">
              Press Space or Tap Screen!
            </p>
          </div>
        )}

        {state === "early" && (
          <div className="space-y-2">
            <AlertTriangle className="h-7 w-7 text-[#c87941] mx-auto" />
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Too Early!
            </h3>
            <p className="text-xs text-[#c5c2b8]">
              You clicked before the compiler turned green.
            </p>
            <div className="pt-1">
              <span className="inline-block border border-[#333328] bg-[#1e1e1a] px-4 py-1.5 text-xs text-[#f0ece4] rounded-lg">
                Click to Try Again
              </span>
            </div>
          </div>
        )}

        {state === "result" && reactionTime && (
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[#8a8a7a]">
              Measured Reflex Speed
            </p>
            <h2 className="font-display text-4xl font-extrabold text-[#f0ece4]">
              {reactionTime} <span className="text-lg font-normal text-[#8a8a7a]">ms</span>
            </h2>
            <p
              className="text-xs font-semibold"
              style={{ color: getRating(reactionTime).color }}
            >
              {getRating(reactionTime).label}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#f0ece4] text-[#0f0f0d] px-4 py-1.5 text-xs font-semibold rounded-lg">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Test Again</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#333328] bg-[#171714] text-xs text-[#8a8a7a]">
        <span>
          Click anywhere or press <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">Space</kbd>
        </span>
        <span className="text-[11px] text-[#6b6b5c]">Lower ms is faster reaction</span>
      </div>
    </div>
  );
}

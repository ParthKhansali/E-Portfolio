"use client";

import { useEffect, useState } from "react";
import { Trophy, RotateCw } from "lucide-react";
import { LeaderboardEntry } from "./types";

export default function LeaderboardView() {
  const [activeGame, setActiveGame] = useState<"skribbl" | "runner" | "snake" | "pong" | "reflex">("skribbl");
  const [leaderboards, setLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lounge");
      if (res.ok) {
        const data = await res.json();
        if (data.leaderboards) setLeaderboards(data.leaderboards);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const gameTabs = [
    { id: "skribbl", label: "Skribbl.io", icon: "🎨" },
    { id: "runner", label: "Foothills Dash", icon: "🏃" },
    { id: "snake", label: "Code Snake", icon: "🐍" },
    { id: "pong", label: "Pixel Pong", icon: "🏓" },
    { id: "reflex", label: "Reflex Latency", icon: "⚡" },
  ] as const;

  const currentList = leaderboards[activeGame] || [];

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* Game Selection Pills */}
      <div className="flex items-center justify-between gap-2 border-b border-[#333328] pb-3">
        <div className="flex flex-wrap gap-1.5">
          {gameTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGame(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeGame === tab.id
                  ? "bg-[#d4a843] text-[#0f0f0d] font-semibold shadow-sm"
                  : "border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4]"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={fetchLeaderboards}
          title="Refresh rankings"
          disabled={isLoading}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#333328] bg-[#141412] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-[#333328] bg-[#121210] overflow-hidden">
        <div className="grid grid-cols-12 px-3.5 py-2 bg-[#171714] border-b border-[#333328] text-[10px] uppercase font-mono text-[#7a7a6b]">
          <span className="col-span-2">Rank</span>
          <span className="col-span-6">Visitor</span>
          <span className="col-span-4 text-right">
            {activeGame === "reflex" ? "Latency" : "Score"}
          </span>
        </div>

        <div className="divide-y divide-[#333328]/50 max-h-[220px] overflow-y-auto">
          {currentList.length > 0 ? (
            currentList.map((entry, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

              return (
                <div
                  key={entry.id || idx}
                  className="grid grid-cols-12 items-center px-3.5 py-2.5 text-xs hover:bg-white/[0.02] transition-colors"
                >
                  <div className="col-span-2 flex items-center gap-1 font-mono">
                    <span className="text-sm">{medal}</span>
                  </div>
                  <div className="col-span-6 flex items-center gap-2 truncate">
                    <span className="text-sm">{entry.avatar}</span>
                    <span className="font-semibold text-[#f0ece4] truncate">
                      {entry.player}
                    </span>
                  </div>
                  <div className="col-span-4 text-right font-mono font-bold">
                    <span className={isTop3 ? "text-[#d4a843]" : "text-[#c5c2b8]"}>
                      {activeGame === "reflex" ? `${entry.score} ms` : `${entry.score.toLocaleString()} pts`}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#8a8a7a]">
              No scores recorded for this game yet. Be the first to play!
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#6b6b5c] text-center">
        Play games in the arcade shelf to submit your score directly to this room board.
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Activity } from "lucide-react";

interface RepoItem {
  id: number;
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  description: string | null;
}

interface UserProfile {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

interface LanguageDistribution {
  name: string;
  percent: number;
  color: string;
}

const PALETTE = ["#d4a843", "#8fb573", "#c87941", "#7d9eb5", "#b07db5"];

export default function DevMetrics() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [languages, setLanguages] = useState<LanguageDistribution[]>([]);
  const [daysSincePush, setDaysSincePush] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMetrics() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("https://api.github.com/users/ParthKhansali"),
          fetch("https://api.github.com/users/ParthKhansali/repos?per_page=100&sort=pushed"),
        ]);

        if (uRes.ok) {
          const uData: UserProfile = await uRes.json();
          const rData: RepoItem[] = rRes.ok ? await rRes.json() : [];

          if (isMounted) {
            setProfile(uData);
            setRepos(rData.slice(0, 4));
            setIsLive(true);

            const counts: Record<string, number> = {};
            rData.forEach((r) => {
              if (r.language) {
                counts[r.language] = (counts[r.language] || 0) + 1;
              }
            });

            const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
            const sorted = Object.keys(counts)
              .sort((a, b) => counts[b] - counts[a])
              .slice(0, 5)
              .map((lang, idx) => ({
                name: lang,
                percent: Math.round((counts[lang] / total) * 100),
                color: PALETTE[idx % PALETTE.length],
              }));

            setLanguages(sorted);

            if (rData[0]?.pushed_at) {
              const diffMs = Date.now() - new Date(rData[0].pushed_at).getTime();
              setDaysSincePush(Math.max(0, Math.round(diffMs / 86400000)));
            }
          }
        }
      } catch (err) {
        console.warn("GitHub fetch fallback:", err);
        if (isMounted) {
          setProfile({
            login: "ParthKhansali",
            avatar_url: "",
            public_repos: 12,
            followers: 6,
          });
          setLanguages([
            { name: "TypeScript", percent: 40, color: PALETTE[0] },
            { name: "Python", percent: 25, color: PALETTE[1] },
            { name: "Java", percent: 20, color: PALETTE[2] },
            { name: "C++", percent: 15, color: PALETTE[3] },
          ]);
          setDaysSincePush(1);
          setIsLive(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLiveMetrics();
    const interval = setInterval(fetchLiveMetrics, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-xl border border-[#f0ece4]/[0.06] bg-[#171714] p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#d4a843]" />
          <span className="text-sm font-semibold text-[#f0ece4]">GitHub</span>
          <span className="text-[11px] text-[#6a6a5e]">
            {isLive ? "live" : "cached"}
          </span>
        </div>

        <a
          href="https://github.com/ParthKhansali"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-xs text-[#8a8a7a] transition-colors hover:text-[#f0ece4]"
        >
          <span>@{profile?.login || "ParthKhansali"}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Repos</span>
          <span className="mt-1 block text-lg font-bold text-[#f0ece4] tabular-nums">
            {isLoading ? "..." : profile?.public_repos ?? "12"}
          </span>
        </div>

        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Followers</span>
          <span className="mt-1 block text-lg font-bold text-[#d4a843] tabular-nums">
            {isLoading ? "..." : profile?.followers ?? "6"}
          </span>
        </div>

        <div className="rounded-lg border border-[#f0ece4]/[0.04] bg-[#0f0f0d] p-3 text-center">
          <span className="text-[10px] text-[#6a6a5e] block">Last push</span>
          <span className="mt-1 block text-lg font-bold text-[#8fb573] tabular-nums">
            {isLoading ? "..." : daysSincePush !== null ? `${daysSincePush}d` : "..."}
          </span>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-5">
        <span className="text-[11px] text-[#6a6a5e] block mb-2.5">Languages</span>
        {/* Stacked bar */}
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#0f0f0d] mb-2">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"
              style={{
                width: `${lang.percent}%`,
                backgroundColor: lang.color,
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {languages.map((lang) => (
            <span key={lang.name} className="flex items-center gap-1.5 text-[11px] text-[#8a8a7a]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              {lang.name} {lang.percent}%
            </span>
          ))}
        </div>
      </div>

      {/* Recent repos */}
      <div>
        <span className="text-[11px] text-[#6a6a5e] block mb-2">Recent</span>
        <div className="space-y-1">
          {(repos.length > 0 ? repos : [
            { id: 1, name: "E-Portfolio", html_url: "https://github.com/ParthKhansali/E-Portfolio", language: "TypeScript" },
            { id: 2, name: "OmniMentor", html_url: "https://github.com/ParthKhansali/OmniMentor", language: "Python" },
            { id: 3, name: "FINTRACK", html_url: "https://github.com/ParthKhansali/FINTRACK", language: "Fullstack" },
            { id: 4, name: "orchidfrontend_omniMentor", html_url: "https://github.com/ParthKhansali/orchidfrontend_omniMentor", language: "Next.js" },
          ]).map((repo) => (
            <a
              key={repo.id || repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-[#b5b0a1] transition-all hover:bg-[#1e1e1a] hover:text-[#f0ece4]"
            >
              <span className="truncate font-medium">{repo.name}</span>
              <span className="text-[10px] text-[#6a6a5e] flex-shrink-0">
                {repo.language || "Code"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

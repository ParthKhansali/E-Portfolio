"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Play, Radio } from "lucide-react";

interface TrackData {
  success: boolean;
  configured: boolean;
  service: "spotify" | "ytmusic" | "demo";
  isPlaying: boolean;
  label: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumImage: string;
  url: string;
  playedAt?: string;
  durationMs?: number;
}

export default function MusicWidget() {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/spotify/now-playing", {
          cache: "no-store",
        });
        if (res.ok) {
          const data: TrackData = await res.json();
          if (isMounted) {
            setTrack(data);
          }
        }
      } catch (err) {
        console.debug("Failed to fetch current music track:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return "";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const isYt = track?.service === "ytmusic";

  // Don't render if nothing to show
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#f0ece4]/[0.06] bg-[#171714] p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-[#1e1e1a] animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-1/3 rounded bg-[#1e1e1a] animate-pulse" />
            <div className="h-2 w-1/2 rounded bg-[#1e1e1a] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#f0ece4]/[0.06] bg-[#171714] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Album + Track Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Album Art */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden border border-[#f0ece4]/[0.08] bg-[#1e1e1a] flex-shrink-0">
            {track?.albumImage ? (
              <Image
                src={track.albumImage}
                alt={track.albumName || "Album Art"}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[#555548]">
                <Radio className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            {/* Status line */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-medium text-[#6a6a5e]">
                {track?.isPlaying ? (
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-[#8fb573] rounded-full animate-[eqA_0.8s_infinite]" />
                      <span className="w-0.5 bg-[#8fb573] rounded-full animate-[eqB_0.7s_infinite]" />
                      <span className="w-0.5 bg-[#8fb573] rounded-full animate-[eqC_0.9s_infinite]" />
                    </span>
                    <span className="text-[#8fb573]">listening now</span>
                  </span>
                ) : (
                  <span>
                    last played {track?.playedAt ? formatRelativeTime(track.playedAt) : ""}
                  </span>
                )}
              </span>
            </div>

            {/* Track Name */}
            <a
              href={track?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-[#f0ece4] hover:text-[#d4a843] transition-colors truncate max-w-full"
            >
              <span className="truncate">{track?.trackName || "Nothing playing"}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>

            {/* Artist */}
            <p className="text-xs text-[#6a6a5e] truncate">
              {track?.artistName || ""}
              {track?.albumName ? ` on ${track.albumName}` : ""}
            </p>
          </div>
        </div>

        {/* Right: Listen button */}
        {track?.url && (
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-[#333328] px-4 py-2 text-xs font-medium text-[#b5b0a1] transition-all hover:border-[#555548] hover:text-[#f0ece4] self-end sm:self-center"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isYt ? "YouTube Music" : "Spotify"}</span>
          </a>
        )}
      </div>
    </div>
  );
}

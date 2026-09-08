"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX, ExternalLink } from "lucide-react";
import GlowCard from "../GlowCard";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  searchQuery: string;
  accentColor: string;
}

const PLAYLIST: Track[] = [
  {
    id: 1,
    title: "Deep Systems Focus — Ambient Synth",
    artist: "Parth Khansali Flow",
    album: "Late Night Engineering Flow",
    duration: 215, // 3:35
    searchQuery: "ambient synth focus deep work",
    accentColor: "#ff0033",
  },
  {
    id: 2,
    title: "Midnight Kafka Queues — Lofi Chillhop",
    artist: "Distributed Systems Beat Lab",
    album: "Event-Driven Night Chords",
    duration: 184, // 3:04
    searchQuery: "lofi hip hop chill beats for coding",
    accentColor: "#4361ee",
  },
  {
    id: 3,
    title: "Neural Synthesis — Dark Cyberpunk Drone",
    artist: "Adaptive AI Acoustics",
    album: "Zero-Latency Architecture",
    duration: 248, // 4:08
    searchQuery: "cyberpunk dark synthwave focus",
    accentColor: "#7209b7",
  },
];

export default function MusicWidget() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(48); // Initial progress seconds
  const [isMuted, setIsMuted] = useState(false);

  // Web Audio synth refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscNodesRef = useRef<OscillatorNode[]>([]);

  const track = PLAYLIST[currentTrackIndex];

  // Initialize and run ambient synth audio on play
  useEffect(() => {
    if (!isPlaying) {
      // Fade out and stop oscillators
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Lowpass filter for warm analog lofi texture
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.connect(masterGain);

      // Warm chord notes (F minor 9 / C minor 9 depending on track)
      const frequencies =
        currentTrackIndex === 0
          ? [174.61, 220.0, 261.63, 329.63] // F3, A3, C4, E4
          : currentTrackIndex === 1
          ? [130.81, 164.81, 196.0, 246.94] // C3, E3, G3, B3
          : [146.83, 174.61, 220.0, 293.66]; // D3, F3, A3, D4

      const oscs = frequencies.map((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Subtle vibrato/detune
        osc.detune.setValueAtTime((i - 1.5) * 4, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });

      oscNodesRef.current = oscs;

      return () => {
        oscs.forEach((o) => {
          try {
            o.stop();
            o.disconnect();
          } catch {}
        });
      };
    } catch {
      // AudioContext blocked or not supported
    }
  }, [isPlaying, currentTrackIndex, isMuted]);

  // Track progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            // Loop or next track
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        nextMute ? 0 : 0.08,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setProgress(Math.floor(pct * track.duration));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (progress / track.duration) * 100));
  const ytMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(
    track.searchQuery
  )}`;

  return (
    <GlowCard className="p-5 sm:p-6 relative overflow-hidden" glowColor="255, 0, 51">
      {/* Ambient Crimson Glow Backdrop */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#ff0033]/10 blur-[60px]" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        {/* Left Section: Vinyl Record + Track Info */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          {/* 3D Spinning Vinyl Record with Grooves */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
            {/* Outer Vinyl Disc */}
            <div
              className={`h-full w-full rounded-full border border-white/10 bg-[#111113] p-1 shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out ${
                isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
              }`}
              style={{
                backgroundImage:
                  "radial-gradient(circle, #1a1a1c 0%, #0d0d0f 35%, #18181a 55%, #08080a 75%, #141416 100%)",
              }}
            >
              {/* Concentric Vinyl Grooves Sheen */}
              <div className="h-full w-full rounded-full border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 [background:conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_45deg,transparent_90deg,rgba(255,255,255,0.1)_135deg,transparent_180deg)]" />

                {/* Center YouTube Music Label */}
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#ff0033] flex items-center justify-center border-2 border-[#111] shadow-[0_0_12px_rgba(255,0,51,0.6)] relative z-10">
                  {/* Center Spindle Hole */}
                  <div className="h-2 w-2 rounded-full bg-[#050505]" />
                </div>
              </div>
            </div>

            {/* Glowing playback halo */}
            {isPlaying && (
              <span className="absolute -inset-1 rounded-full border border-[#ff0033]/40 animate-pulse pointer-events-none" />
            )}
          </div>

          {/* Track Metadata */}
          <div className="min-w-0 flex-1">
            {/* YouTube Music Branded Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 rounded-full border border-[#ff0033]/30 bg-[#ff0033]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ff3355]">
                {/* Official YouTube Music Glyph */}
                <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#FF0033" />
                  <circle cx="12" cy="12" r="6" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                  <polygon points="10,8.5 16,12 10,15.5" fill="#FFFFFF" />
                </svg>
                <span>YouTube Music</span>
              </span>

              {/* Animated Equalizer Bars */}
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-3.5 px-1">
                  <span className="w-0.5 bg-[#ff0033] rounded-full eq-bar-1" />
                  <span className="w-0.5 bg-[#ff3355] rounded-full eq-bar-2" />
                  <span className="w-0.5 bg-[#ff0033] rounded-full eq-bar-3" />
                  <span className="w-0.5 bg-[#ff5577] rounded-full eq-bar-2" />
                </div>
              ) : (
                <span className="text-[10px] font-mono text-[#666]">Paused</span>
              )}
            </div>

            {/* Title */}
            <h4 className="font-display text-sm sm:text-base font-bold text-white truncate transition-colors">
              {track.title}
            </h4>

            {/* Artist & Context */}
            <p className="text-xs text-[#888] truncate flex items-center gap-1.5">
              <span>{track.artist}</span>
              <span className="text-[#444]">•</span>
              <span className="text-[#666]">{track.album}</span>
            </p>
          </div>
        </div>

        {/* Right Section: Controls & Platform Link */}
        <div className="flex items-center gap-3 self-end md:self-center">
          {/* Mute/Sound Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#aaa] transition-colors hover:border-white/[0.2] hover:text-white"
            title={isMuted ? "Unmute generative audio" : "Mute generative audio"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Next Track Button */}
          <button
            onClick={handleNextTrack}
            aria-label="Next focus track"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#aaa] transition-colors hover:border-white/[0.2] hover:text-white"
            title="Next vibe"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#ff0033] to-[#cc0029] text-white shadow-[0_0_20px_rgba(255,0,51,0.5)] transition-all duration-200 hover:scale-108 hover:shadow-[0_0_30px_rgba(255,0,51,0.8)] active:scale-95"
            title={isPlaying ? "Pause audio" : "Play focus audio"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Open in YouTube Music Link */}
          <a
            href={ytMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-[#ddd] transition-all hover:border-[#ff0033]/50 hover:bg-[#ff0033]/10 hover:text-white"
            title="Open track on YouTube Music in a new tab"
          >
            <span>Listen on YT Music</span>
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Scrubbable Progress Bar */}
      <div className="mt-4 flex items-center gap-3 text-[11px] font-mono text-[#777] select-none">
        <span className="w-8 text-right">{formatTime(progress)}</span>
        <div
          onClick={handleScrub}
          className="group relative h-2 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/[0.06] transition-all hover:h-2.5"
          title="Click to seek"
        >
          {/* Progress fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#ff0033] to-[#ff3366] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Handle dot on hover */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,0,51,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>
        <span className="w-8">{formatTime(track.duration)}</span>
      </div>
    </GlowCard>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Volume2,
  VolumeX,
  Trophy,
  Palette,
  Gamepad2,
  Users,
  Send,
  Edit2,
  Check,
  Eraser,
  Trash2,
  RefreshCw,
  Radio,
  Sparkles,
} from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./lounge/types";
import RunnerGame from "./lounge/RunnerGame";
import SnakeGame from "./lounge/SnakeGame";
import PongGame from "./lounge/PongGame";
import ReflexGame from "./lounge/ReflexGame";
import LeaderboardView from "./lounge/LeaderboardView";

const AVATARS = ["🐱", "🦊", "🚀", "🎮", "⚡", "🌙", "🦉", "👾", "🎨", "💻"];

const SKRIBBL_PALETTE = [
  { name: "Obsidian", color: "#0f0f0d" },
  { name: "Redstone", color: "#ef4444" },
  { name: "Emerald", color: "#22c55e" },
  { name: "Diamond", color: "#06b6d4" },
  { name: "Gold", color: "#eab308" },
  { name: "Lapis", color: "#3b82f6" },
  { name: "Amethyst", color: "#a855f7" },
  { name: "Snow", color: "#f0ece4" },
];

const QUICK_SHOUTS = [
  { label: "👋 Wave", text: "waved to everyone in the lounge." },
  { label: "🔥 Hype", text: "is hyped about Parth's engineering work!" },
  { label: "🏆 GG", text: "Good game, great run everyone!" },
  { label: "💡 Nice", text: "loves this project and interactive space." },
];

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  type: "chat" | "reaction" | "score" | "skribbl";
  timestamp: number;
}

interface Stroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
}

export default function RetroArcadeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mainView, setMainView] = useState<"skribbl" | "arcade" | "rankings">("skribbl");
  const [arcadeGame, setArcadeGame] = useState<"runner" | "snake" | "pong" | "reflex">("runner");
  const [sidebarTab, setSidebarTab] = useState<"chat" | "strangers">("chat");
  const [mobilePane, setMobilePane] = useState<"stage" | "chat">("stage");
  const [isMuted, setIsMuted] = useState(false);

  // Visitor profile
  const [profile, setProfile] = useState<VisitorProfile>({
    id: "visitor-init",
    name: "Doon Explorer",
    avatar: "🐱",
    color: "#d4a843",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState("");

  // Room data
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visitors, setVisitors] = useState<Array<{ id: string; name: string; avatar: string; activity?: string }>>([]);
  const [chatInput, setChatInput] = useState("");

  // Skribbl state
  const [skribblColor, setSkribblColor] = useState("#f0ece4");
  const [skribblBrush, setSkribblBrush] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [skribblWord, setSkribblWord] = useState<string | null>(null);
  const [skribblHint, setSkribblHint] = useState("_ _ _ _ _ _");
  const [celebration, setCelebration] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const strokeBuffer = useRef<Stroke[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);

  // Initialize profile from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pk_lounge_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setTempName(parsed.name);
      } else {
        const num = Math.floor(Math.random() * 89) + 10;
        const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        const initProfile: VisitorProfile = {
          id: `visitor-${Date.now()}-${num}`,
          name: `Explorer #${num}`,
          avatar,
          color: "#d4a843",
        };
        setProfile(initProfile);
        setTempName(initProfile.name);
        localStorage.setItem("pk_lounge_profile", JSON.stringify(initProfile));
      }
    } catch {}
  }, []);

  // Listen for open events
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      isOpenRef.current = true;
      sounds.playMinecraftXp();
    };

    window.addEventListener("open-arcade", handleOpen);
    return () => {
      window.removeEventListener("open-arcade", handleOpen);
    };
  }, []);

  // Lock document scroll when Lounge is open
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        isOpenRef.current = false;
      }
      // Prevent arrow keys and space from scrolling the background while playing games
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeydown, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

  // Poll room data
  const fetchRoomData = async () => {
    try {
      const res = await fetch("/api/lounge");
      if (res.ok) {
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
        if (data.visitors) setVisitors(data.visitors);
        if (data.skribbl) {
          setSkribblHint(data.skribbl.hint);
          if (data.skribbl.strokes && canvasRef.current && mainView === "skribbl") {
            renderExternalStrokes(data.skribbl.strokes);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 2500);
    return () => clearInterval(interval);
  }, [isOpen, mainView]);

  // Heartbeat to keep visitor presence live
  useEffect(() => {
    if (!isOpen) return;
    const sendHeartbeat = async () => {
      try {
        await fetch("/api/lounge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "heartbeat",
            sender: {
              id: profile.id,
              name: profile.name,
              avatar: profile.avatar,
              activity: mainView === "skribbl" ? "Sketching in Scribble" : `Playing ${arcadeGame}`,
            },
          }),
        });
      } catch {}
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [isOpen, profile, mainView, arcadeGame]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Render strokes on canvas
  const renderExternalStrokes = (strokes: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#121210";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((st) => {
      ctx.strokeStyle = st.color;
      ctx.lineWidth = st.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(st.x0, st.y0);
      ctx.lineTo(st.x1, st.y1);
      ctx.stroke();
    });
  };

  // Canvas interaction
  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    lastPos.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return;
    const current = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const strokeColor = isEraser ? "#121210" : skribblColor;
    const strokeSize = isEraser ? skribblBrush * 3 : skribblBrush;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();

    strokeBuffer.current.push({
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: current.x,
      y1: current.y,
      color: strokeColor,
      size: strokeSize,
    });
    lastPos.current = current;
  };

  const stopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPos.current = null;

    if (strokeBuffer.current.length > 0) {
      const batch = [...strokeBuffer.current];
      strokeBuffer.current = [];
      fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skribbl_stroke", strokes: batch }),
      }).catch(() => {});
    }
  };

  const clearCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#121210";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    strokeBuffer.current = [];
    sounds.playMinecraftPop();

    fetch("/api/lounge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "skribbl_clear" }),
    }).catch(() => {});
  };

  const rollNewWord = async () => {
    sounds.playMinecraftPop();
    try {
      const res = await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skribbl_new_round",
          sender: { id: profile.id, name: profile.name, avatar: profile.avatar },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.word) {
          setSkribblWord(data.word);
          setSkribblHint(data.hint);
          clearCanvas();
        }
      }
    } catch {}
  };

  // Submit chat message or word guess
  const handleSendMessage = async (text: string, type: "chat" | "reaction" = "chat") => {
    if (!text.trim()) return;
    const clean = text.trim();
    setChatInput("");

    // Test guess against current word
    try {
      const guessRes = await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skribbl_guess",
          guess: clean,
          sender: { id: profile.id, name: profile.name, avatar: profile.avatar },
        }),
      });
      if (guessRes.ok) {
        const guessData = await guessRes.json();
        if (guessData.correct) {
          sounds.playMinecraftLevelUp();
          setCelebration(`🎉 Solved: ${guessData.word.toUpperCase()}! (+150 pts)`);
          setTimeout(() => setCelebration(null), 3000);
          clearCanvas();
          fetchRoomData();
          return;
        }
      }
    } catch {}

    // Normal message / reaction shout
    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: { id: profile.id, name: profile.name, avatar: profile.avatar },
      text: clean,
      type,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, optimistic]);
    sounds.playMinecraftPop();

    fetch("/api/lounge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "message",
        sender: { id: profile.id, name: profile.name, avatar: profile.avatar },
        text: clean,
        type,
      }),
    })
      .then(fetchRoomData)
      .catch(() => {});
  };

  // Post arcade score
  const handleFinishScore = (game: "runner" | "snake" | "pong" | "reflex", score: number) => {
    fetch("/api/lounge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "score",
        game,
        score,
        sender: { id: profile.id, name: profile.name, avatar: profile.avatar },
      }),
    })
      .then(fetchRoomData)
      .catch(() => {});
  };

  // Profile save
  const handleSaveProfile = () => {
    const updated = { ...profile, name: tempName.trim() || profile.name };
    setProfile(updated);
    try {
      localStorage.setItem("pk_lounge_profile", JSON.stringify(updated));
    } catch {}
    setIsEditingProfile(false);
    sounds.playMinecraftLevelUp();
  };

  const handleSelectAvatar = (av: string) => {
    const updated = { ...profile, avatar: av };
    setProfile(updated);
    try {
      localStorage.setItem("pk_lounge_profile", JSON.stringify(updated));
    } catch {}
    sounds.playMinecraftPop();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => {
          setIsOpen(false);
          isOpenRef.current = false;
        }}
      >
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.2 }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] max-h-[740px] overflow-hidden rounded-2xl border border-[#2b2b24] bg-[#121210] shadow-[0_30px_90px_rgba(0,0,0,0.96)] text-[#f0ece4] outline-none flex flex-col select-none"
        >
          {/* ROOM TOP HEADER */}
          <header className="flex items-center justify-between border-b border-[#2b2b24] bg-[#171714] px-4 py-2.5 flex-shrink-0">
            {/* Live Beacon & Room Title */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
              </span>
              <h3 className="font-display text-xs sm:text-sm font-bold text-[#f0ece4] tracking-tight">
                Late Night Lounge
              </h3>
              <span className="hidden sm:inline-flex items-center rounded-full border border-[#2b2b24] bg-[#121210] px-2 py-0.5 text-[10px] text-[#8a8a7a]">
                {Math.max(1, visitors.length)} online
              </span>
            </div>

            {/* Stage Selector Pills */}
            <div className="flex items-center gap-0.5 sm:gap-1 rounded-xl border border-[#2b2b24] bg-[#121210] p-0.5 sm:p-1">
              <button
                type="button"
                onClick={() => { setMainView("skribbl"); setMobilePane("stage"); sounds.playMinecraftPop(); }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  mainView === "skribbl"
                    ? "bg-[#d4a843] text-[#0f0f0d] font-semibold shadow-sm"
                    : "text-[#8a8a7a] hover:text-[#f0ece4]"
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Scribble</span>
              </button>

              <button
                type="button"
                onClick={() => { setMainView("arcade"); setMobilePane("stage"); sounds.playMinecraftPop(); }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  mainView === "arcade"
                    ? "bg-[#d4a843] text-[#0f0f0d] font-semibold shadow-sm"
                    : "text-[#8a8a7a] hover:text-[#f0ece4]"
                }`}
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                <span>Arcade</span>
              </button>

              <button
                type="button"
                onClick={() => { setMainView("rankings"); sounds.playMinecraftPop(); }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  mainView === "rankings"
                    ? "bg-[#d4a843] text-[#0f0f0d] font-semibold shadow-sm"
                    : "text-[#8a8a7a] hover:text-[#f0ece4]"
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Ranks</span>
              </button>
            </div>

            {/* Utility Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { const next = sounds.toggleMute(); setIsMuted(next); }}
                title={isMuted ? "Unmute sound" : "Mute sound"}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b2b24] bg-[#121210] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5 text-[#ef4444]" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => { setIsOpen(false); isOpenRef.current = false; }}
                title="Close lounge (Esc)"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b2b24] bg-[#121210] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          {/* EDIT PROFILE DRAWER (EXPANDABLE) */}
          {isEditingProfile && (
            <div className="border-b border-[#2b2b24] bg-[#171714] p-3 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8a8a7a]">Pick Emoji:</span>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => handleSelectAvatar(av)}
                      className={`h-7 w-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                        profile.avatar === av
                          ? "bg-[#22c55e]/20 border border-[#22c55e] scale-105"
                          : "border border-[#2b2b24] hover:bg-white/[0.05]"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Visitor handle..."
                  maxLength={18}
                  className="bg-[#121210] border border-[#2b2b24] rounded-lg px-2.5 py-1 text-xs text-[#f0ece4] outline-none focus:border-[#22c55e]"
                />
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#22c55e] px-3 py-1 text-xs font-semibold text-[#0f0f0d] hover:bg-[#34d399] transition-colors cursor-pointer"
                >
                  <Check className="h-3 w-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Stage vs Chat Toggle */}
          <div className="flex md:hidden items-center justify-around border-b border-[#2b2b24] bg-[#141412] px-2 py-1.5 text-xs">
            <button
              type="button"
              onClick={() => setMobilePane("stage")}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                mobilePane === "stage"
                  ? "bg-[#d4a843]/20 text-[#d4a843] border border-[#d4a843]/40 font-semibold"
                  : "text-[#8a8a7a]"
              }`}
            >
              🎮 Stage View
            </button>
            <button
              type="button"
              onClick={() => setMobilePane("chat")}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                mobilePane === "chat"
                  ? "bg-[#d4a843]/20 text-[#d4a843] border border-[#d4a843]/40 font-semibold"
                  : "text-[#8a8a7a]"
              }`}
            >
              💬 Live Chat ({messages.length})
            </button>
          </div>

          {/* TWO-COLUMN ROOM BODY (Stage on Left, Live Sidebar on Right) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
            {/* LEFT COLUMN: THE ACTIVE STAGE (~65%) */}
            <div className={`md:col-span-7 lg:col-span-8 flex flex-col border-b md:border-b-0 md:border-r border-[#2b2b24] min-h-0 bg-[#0f0f0d] ${mobilePane === "stage" ? "flex" : "hidden md:flex"}`}>
              {/* STAGE A: SCRIBBLE ROOM */}
              {mainView === "skribbl" && (
                <div className="flex flex-col h-full">
                  {/* Scribble Prompt Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#141412] border-b border-[#2b2b24] text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[#d4a843] font-semibold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Clue:</span>
                      </span>
                      <span className="rounded-lg border border-[#2b2b24] bg-[#1a1a16] px-3 py-0.5 text-xs font-mono text-[#f0ece4] tracking-widest">
                        {skribblWord ? skribblWord : skribblHint}
                      </span>
                      {skribblWord && (
                        <span className="text-[10px] text-[#22c55e] font-mono font-semibold">
                          (Your word to draw)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={rollNewWord}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#2b2b24] bg-[#171714] text-[11px] text-[#8a8a7a] hover:text-[#f0ece4] transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Roll Word</span>
                      </button>

                      <button
                        type="button"
                        onClick={clearCanvas}
                        title="Clear whiteboard"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#2b2b24] bg-[#171714] text-[11px] text-[#8a8a7a] hover:text-[#ef4444] transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  {/* Canvas Viewport */}
                  <div className="relative flex-1 w-full bg-[#121210] flex items-center justify-center overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={640}
                      height={340}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={stopDraw}
                      className="w-full h-full block cursor-crosshair touch-none"
                    />

                    {celebration && (
                      <div className="absolute inset-x-0 top-4 flex justify-center pointer-events-none z-20">
                        <div className="rounded-xl border border-[#22c55e] bg-[#0c2415] px-4 py-2 text-xs font-bold text-[#22c55e] shadow-2xl animate-bounce">
                          {celebration}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scribble Palette Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#171714] border-t border-[#2b2b24] text-xs flex-shrink-0">
                    {/* Palette */}
                    <div className="flex items-center gap-1.5">
                      {SKRIBBL_PALETTE.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setSkribblColor(p.color);
                            setIsEraser(false);
                            sounds.playMinecraftPop();
                          }}
                          title={p.name}
                          className={`h-6 w-6 rounded-md border transition-all ${
                            !isEraser && skribblColor === p.color
                              ? "border-white scale-110 shadow-sm"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: p.color }}
                        />
                      ))}
                    </div>

                    {/* Tools */}
                    <div className="flex items-center gap-2">
                      {/* Brush Size */}
                      <div className="flex items-center gap-1 border border-[#2b2b24] rounded-lg p-0.5 bg-[#121210]">
                        {[2, 5, 10].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => { setSkribblBrush(sz); setIsEraser(false); }}
                            className={`h-5 px-1.5 rounded text-[10px] font-mono transition-colors ${
                              skribblBrush === sz && !isEraser
                                ? "bg-[#d4a843] text-[#0f0f0d] font-bold"
                                : "text-[#8a8a7a]"
                            }`}
                          >
                            {sz}px
                          </button>
                        ))}
                      </div>

                      {/* Eraser */}
                      <button
                        type="button"
                        onClick={() => { setIsEraser((prev) => !prev); sounds.playMinecraftPop(); }}
                        title="Eraser tool"
                        className={`h-7 w-7 flex items-center justify-center rounded-lg border transition-colors ${
                          isEraser
                            ? "bg-[#d4a843] text-[#0f0f0d] border-[#d4a843]"
                            : "border-[#2b2b24] bg-[#121210] text-[#8a8a7a] hover:text-[#f0ece4]"
                        }`}
                      >
                        <Eraser className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE B: ARCADE SHELF */}
              {mainView === "arcade" && (
                <div className="flex flex-col h-full">
                  {/* Game Sub-selector */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#141412] border-b border-[#2b2b24] text-xs">
                    <span className="font-mono text-[#d4a843] font-semibold">Select Challenge:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: "runner", label: "Runner", icon: "🏃" },
                        { id: "snake", label: "Snake", icon: "🐍" },
                        { id: "pong", label: "Pong", icon: "🏓" },
                        { id: "reflex", label: "Reflex", icon: "⚡" },
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => { setArcadeGame(g.id as any); sounds.playMinecraftPop(); }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                            arcadeGame === g.id
                              ? "bg-[#d4a843] text-[#0f0f0d] font-semibold"
                              : "border border-[#2b2b24] bg-[#171714] text-[#8a8a7a] hover:text-[#f0ece4]"
                          }`}
                        >
                          <span>{g.icon}</span>
                          <span>{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Game Stage */}
                  <div className="flex-1 flex flex-col justify-center bg-[#0f0f0d]">
                    {arcadeGame === "runner" && (
                      <RunnerGame
                        profile={profile}
                        isActive={mainView === "arcade" && arcadeGame === "runner"}
                        onFinishGame={(score) => handleFinishScore("runner", score)}
                      />
                    )}
                    {arcadeGame === "snake" && (
                      <SnakeGame
                        profile={profile}
                        isActive={mainView === "arcade" && arcadeGame === "snake"}
                        onFinishGame={(score) => handleFinishScore("snake", score)}
                      />
                    )}
                    {arcadeGame === "pong" && (
                      <PongGame
                        profile={profile}
                        isActive={mainView === "arcade" && arcadeGame === "pong"}
                        onFinishGame={(score) => handleFinishScore("pong", score)}
                      />
                    )}
                    {arcadeGame === "reflex" && (
                      <ReflexGame
                        profile={profile}
                        isActive={mainView === "arcade" && arcadeGame === "reflex"}
                        onFinishGame={(score) => handleFinishScore("reflex", score)}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STAGE C: LEADERBOARDS */}
              {mainView === "rankings" && (
                <div className="flex-1 overflow-y-auto bg-[#0f0f0d]">
                  <LeaderboardView />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: LIVE SIDEBAR (~35%) */}
            <div className={`md:col-span-5 lg:col-span-4 flex flex-col min-h-0 bg-[#141412] ${mobilePane === "chat" ? "flex" : "hidden md:flex"}`}>
              {/* Sidebar Header: Visitor Profile + Sidebar Tab Switcher */}
              <div className="p-3 border-b border-[#2b2b24] bg-[#171714] flex items-center justify-between gap-2 flex-shrink-0">
                {/* Profile Pill */}
                <button
                  type="button"
                  onClick={() => setIsEditingProfile((prev) => !prev)}
                  title="Click to change your avatar and handle"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2b2b24] bg-[#121210] hover:border-[#22c55e]/60 text-xs transition-colors cursor-pointer"
                >
                  <span className="text-sm">{profile.avatar}</span>
                  <span className="font-semibold text-[#f0ece4] truncate max-w-[95px]">
                    {profile.name}
                  </span>
                  <Edit2 className="h-3 w-3 text-[#8a8a7a]" />
                </button>

                {/* Tab Switcher */}
                <div className="flex rounded-lg border border-[#2b2b24] bg-[#121210] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setSidebarTab("chat"); sounds.playMinecraftPop(); }}
                    className={`px-2.5 py-0.5 rounded-md transition-colors ${
                      sidebarTab === "chat"
                        ? "bg-[#d4a843] text-[#0f0f0d] font-semibold"
                        : "text-[#8a8a7a] hover:text-[#f0ece4]"
                    }`}
                  >
                    Chat &amp; Guesses
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSidebarTab("strangers"); sounds.playMinecraftPop(); }}
                    className={`px-2.5 py-0.5 rounded-md transition-colors ${
                      sidebarTab === "strangers"
                        ? "bg-[#d4a843] text-[#0f0f0d] font-semibold"
                        : "text-[#8a8a7a] hover:text-[#f0ece4]"
                    }`}
                  >
                    Live Pool
                  </button>
                </div>
              </div>

              {/* TAB 1: ROOM CHAT & GUESSES */}
              {sidebarTab === "chat" && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Messages Feed */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
                    {messages.map((m) => {
                      const isSelf = m.sender.id === profile.id;
                      const isSkribblWin = m.type === "skribbl";
                      const isScore = m.type === "score";

                      if (isSkribblWin || isScore) {
                        return (
                          <div key={m.id} className="text-center py-0.5">
                            <span className="inline-block px-3 py-1 rounded-full border border-[#2b2b24] bg-[#1a1a16] text-[11px] text-[#c5c2b8]">
                              <span className="mr-1">{m.sender.avatar}</span>
                              <strong className="text-[#f0ece4] mr-1">{m.sender.name}</strong>
                              <span className={isSkribblWin ? "text-[#22c55e] font-bold" : "text-[#d4a843]"}>
                                {m.text}
                              </span>
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          className={`flex items-start gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2b2b24] bg-[#1e1e1a] text-xs flex-shrink-0">
                            {m.sender.avatar}
                          </div>
                          <div
                            className={`max-w-[80%] rounded-xl px-2.5 py-1.5 text-xs ${
                              isSelf
                                ? "bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#f0ece4]"
                                : "bg-[#1c1c18] border border-[#2b2b24] text-[#f0ece4]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className={`text-[10px] font-semibold ${isSelf ? "text-[#d4a843]" : "text-[#8a8a7a]"}`}>
                                {m.sender.name}
                              </span>
                              <span className="text-[9px] text-[#6b6b5c]">
                                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="break-words leading-relaxed">{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Shouts Ribbon */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#121210] border-t border-[#2b2b24] overflow-x-auto flex-shrink-0">
                    {QUICK_SHOUTS.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => handleSendMessage(s.text, "reaction")}
                        className="px-2 py-0.5 rounded-lg border border-[#2b2b24] bg-[#171714] hover:border-[#d4a843]/40 text-[10px] text-[#c5c2b8] whitespace-nowrap cursor-pointer transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Guess & Chat Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(chatInput);
                    }}
                    className="flex items-center gap-1.5 p-2.5 bg-[#171714] border-t border-[#2b2b24] flex-shrink-0"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={mainView === "skribbl" ? "Type guess or chat..." : "Type message in lounge..."}
                      className="flex-1 bg-[#121210] border border-[#2b2b24] rounded-lg px-2.5 py-1.5 text-xs text-[#f0ece4] placeholder-[#6b6b5c] outline-none focus:border-[#d4a843]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="flex items-center justify-center h-8 px-3 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] disabled:opacity-40 text-[#0f0f0d] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: LIVE POOL (OME.GG INSPIRATION DONE RIGHT) */}
              {sidebarTab === "strangers" && (
                <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-3">
                  <div className="p-3 rounded-xl border border-[#2b2b24] bg-[#121210] space-y-1">
                    <h4 className="text-xs font-bold text-[#f0ece4] flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 text-[#22c55e]" />
                      <span>Live Site Travelers</span>
                    </h4>
                    <p className="text-[11px] text-[#8a8a7a] leading-relaxed">
                      Real concurrent visitors currently browsing Parth&apos;s portfolio.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {visitors.map((v) => {
                      const isSelf = v.id === profile.id;
                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[#2b2b24] bg-[#171714] text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base">{v.avatar}</span>
                            <div className="min-w-0">
                              <span className="font-semibold text-[#f0ece4] truncate block">
                                {v.name} {isSelf && "(You)"}
                              </span>
                              <span className="text-[10px] text-[#8a8a7a] truncate block">
                                {v.activity || "Browsing site"}
                              </span>
                            </div>
                          </div>

                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => handleSendMessage(`waved hello to ${v.name}! 👋`, "reaction")}
                              className="px-2 py-1 rounded-lg border border-[#2b2b24] bg-[#121210] hover:border-[#d4a843]/50 text-[11px] text-[#d4a843] transition-colors"
                            >
                              Say Hi
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {visitors.length <= 1 && (
                      <div className="p-4 text-center rounded-xl border border-[#2b2b24] bg-[#121210] text-xs text-[#8a8a7a] space-y-1">
                        <span className="text-lg block">🌌</span>
                        <span className="block font-medium text-[#f0ece4]">You are the lone voyager</span>
                        <p className="text-[11px] text-[#6b6b5c]">
                          When other visitors open the website, they will automatically appear in this live directory.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

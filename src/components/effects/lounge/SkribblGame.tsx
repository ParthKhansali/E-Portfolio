"use client";

import { useEffect, useRef, useState } from "react";
import { Brush, Eraser, Trash2, Send, Sparkles, RefreshCw, Volume2 } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface SkribblGameProps {
  profile: VisitorProfile;
  isActive: boolean;
}

interface Stroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
}

const PALETTE = [
  { name: "Obsidian", color: "#0f0f0d" },
  { name: "Redstone", color: "#ef4444" },
  { name: "Emerald", color: "#22c55e" },
  { name: "Diamond", color: "#06b6d4" },
  { name: "Gold", color: "#eab308" },
  { name: "Lapis", color: "#3b82f6" },
  { name: "Snow", color: "#f0ece4" },
];

const BOT_GUESSES = [
  "is it a diamond sword?",
  "looks like nextjs or react!",
  "maybe a terminal window?",
  "could it be a coffee cup?",
  "is that a creeper face?",
  "definitely kafka queue!",
];

export default function SkribblGame({ profile, isActive }: SkribblGameProps) {
  const [role, setRole] = useState<"drawer" | "guesser">("drawer");
  const [color, setColor] = useState("#f0ece4");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [currentWord, setCurrentWord] = useState("Diamond Sword");
  const [hint, setHint] = useState("_ _ _ _ _ _ _ _ _ _ _ _ _");
  const [guessInput, setGuessInput] = useState("");
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const localStrokes = useRef<Stroke[]>([]);
  const lastSyncRound = useRef(1);

  // Sync with lounge room Skribbl state
  const syncSkribbl = async () => {
    try {
      const res = await fetch("/api/lounge");
      if (res.ok) {
        const data = await res.json();
        if (data.skribbl) {
          setHint(data.skribbl.hint);
          if (role === "guesser" && data.skribbl.strokes) {
            renderStrokes(data.skribbl.strokes);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    syncSkribbl();
    const interval = setInterval(syncSkribbl, 2000);
    return () => clearInterval(interval);
  }, [role]);

  const renderStrokes = (strokes: Stroke[]) => {
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
    if (role !== "drawer") return;
    isDrawing.current = true;
    lastPos.current = getCanvasPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current || role !== "drawer") return;
    const current = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const strokeColor = isEraser ? "#121210" : color;
    const strokeSize = isEraser ? brushSize * 3 : brushSize;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();

    const st: Stroke = {
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: current.x,
      y1: current.y,
      color: strokeColor,
      size: strokeSize,
    };
    localStrokes.current.push(st);
    lastPos.current = current;
  };

  const stopDraw = () => {
    if (!isDrawing.current || role !== "drawer") return;
    isDrawing.current = false;
    lastPos.current = null;

    // Send stroke batch to API
    if (localStrokes.current.length > 0) {
      const batch = [...localStrokes.current];
      localStrokes.current = [];
      fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skribbl_stroke",
          strokes: batch,
        }),
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
    localStrokes.current = [];
    sounds.playMinecraftPop();

    if (role === "drawer") {
      await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skribbl_clear" }),
      }).catch(() => {});
    }
  };

  const newWordPrompt = async () => {
    sounds.playChirp();
    try {
      const res = await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skribbl_new_round",
          sender: {
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.word) {
          setCurrentWord(data.word);
          setHint(data.hint);
          clearCanvas();
        }
      }
    } catch {}
  };

  const submitGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim()) return;

    const guess = guessInput.trim();
    setGuessInput("");

    try {
      const res = await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "skribbl_guess",
          guess,
          sender: {
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.correct) {
          sounds.playMinecraftLevelUp();
          setScore((prev) => prev + 150);
          setCelebration(`🎉 You got it right: ${data.word.toUpperCase()}! (+150 pts)`);
          setTimeout(() => setCelebration(null), 3000);
          clearCanvas();
        } else {
          sounds.playClick(400, 0.04);
        }
      }
    } catch {}
  };

  return (
    <div className="flex flex-col select-none">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#d4a843] font-semibold flex items-center gap-1.5">
            <span>🎨</span>
            <span>Skribbl.io Multiplayer</span>
          </span>

          {role === "drawer" ? (
            <span className="rounded-lg border border-[#8fb573]/40 bg-[#8fb573]/15 px-2.5 py-0.5 text-xs text-[#8fb573] font-bold">
              Secret Word: {currentWord}
            </span>
          ) : (
            <span className="rounded-lg border border-[#333328] bg-[#1e1e1a] px-2.5 py-0.5 text-xs font-mono text-[#f0ece4] tracking-widest">
              {hint}
            </span>
          )}
        </div>

        {/* Role Toggle & New Word Button */}
        <div className="flex items-center gap-2">
          {role === "drawer" && (
            <button
              type="button"
              onClick={newWordPrompt}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#333328] bg-[#171714] text-xs text-[#8a8a7a] hover:text-[#f0ece4] hover:border-[#555548] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Change Word</span>
            </button>
          )}

          <div className="flex rounded-lg border border-[#333328] bg-[#171714] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => { setRole("drawer"); sounds.playMinecraftPop(); }}
              className={`px-2 py-0.5 rounded ${
                role === "drawer" ? "bg-[#d4a843] text-[#0f0f0d] font-semibold" : "text-[#8a8a7a]"
              }`}
            >
              Drawer
            </button>
            <button
              type="button"
              onClick={() => { setRole("guesser"); sounds.playMinecraftPop(); }}
              className={`px-2 py-0.5 rounded ${
                role === "guesser" ? "bg-[#d4a843] text-[#0f0f0d] font-semibold" : "text-[#8a8a7a]"
              }`}
            >
              Guesser
            </button>
          </div>
        </div>
      </div>

      {/* Drawing Viewport */}
      <div className="relative w-full bg-[#121210]">
        <canvas
          ref={canvasRef}
          width={660}
          height={240}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-[210px] sm:h-[240px] block cursor-crosshair touch-none"
        />

        {/* Celebration Toast */}
        {celebration && (
          <div className="absolute inset-x-0 top-3 flex justify-center pointer-events-none z-20">
            <div className="rounded-xl border border-[#55FF55]/60 bg-[#142918] px-4 py-2 text-xs font-bold text-[#55FF55] shadow-2xl animate-bounce">
              {celebration}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Tool Ribbon (If in Drawer Mode) */}
      {role === "drawer" && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#171714] border-t border-[#333328] text-xs">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {PALETTE.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setColor(p.color);
                  setIsEraser(false);
                  sounds.playMinecraftPop();
                }}
                title={p.name}
                className={`h-6 w-6 rounded-md border transition-all ${
                  !isEraser && color === p.color
                    ? "border-white scale-110 shadow-sm"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>

          {/* Sizes & Tools */}
          <div className="flex items-center gap-2">
            {/* Eraser */}
            <button
              type="button"
              onClick={() => {
                setIsEraser((prev) => !prev);
                sounds.playMinecraftPop();
              }}
              title="Eraser"
              className={`flex items-center justify-center h-7 w-7 rounded-lg border transition-colors ${
                isEraser
                  ? "bg-[#d4a843] text-[#0f0f0d] border-[#d4a843]"
                  : "border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] hover:text-[#f0ece4]"
              }`}
            >
              <Eraser className="h-3.5 w-3.5" />
            </button>

            {/* Clear */}
            <button
              type="button"
              onClick={clearCanvas}
              title="Clear Canvas"
              className="flex items-center justify-center h-7 w-7 rounded-lg border border-[#333328] bg-[#1e1e1a] text-[#8a8a7a] hover:text-[#c87941] hover:border-[#c87941]/40 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Guesser Answer Box */}
      {role === "guesser" && (
        <form
          onSubmit={submitGuess}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#171714] border-t border-[#333328]"
        >
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Type your guess here (e.g. Diamond Sword, Creeper, Kafka)..."
            className="flex-1 bg-[#121210] border border-[#333328] rounded-lg px-3 py-1.5 text-xs text-[#f0ece4] placeholder-[#6b6b5c] outline-none focus:border-[#d4a843]"
          />
          <button
            type="submit"
            disabled={!guessInput.trim()}
            className="flex items-center justify-center h-8 px-4 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] disabled:opacity-40 text-[#0f0f0d] text-xs font-semibold transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            <span>Guess</span>
          </button>
        </form>
      )}
    </div>
  );
}

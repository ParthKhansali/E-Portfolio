"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface SnakeGameProps {
  profile: VisitorProfile;
  onFinishGame: (score: number) => void;
  isActive: boolean;
}

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const COLS = 26;
const ROWS = 16;
const FOOD_TYPES = [
  { label: "npm", color: "#c87941" },
  { label: "ts", color: "#7d9eb5" },
  { label: "kafka", color: "#d4a843" },
  { label: "db", color: "#8fb573" },
  { label: "api", color: "#f0ece4" },
];

export default function SnakeGame({ profile, onFinishGame, isActive }: SnakeGameProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<{ x: number; y: number; label: string; color: string }>({
    x: 16,
    y: 8,
    label: "ts",
    color: "#7d9eb5",
  });
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pk_snake_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const spawnFood = () => {
    const snake = snakeRef.current;
    let newX = 0;
    let newY = 0;
    let safe = false;

    while (!safe) {
      newX = Math.floor(Math.random() * COLS);
      newY = Math.floor(Math.random() * ROWS);
      safe = !snake.some((seg) => seg.x === newX && seg.y === newY);
    }

    const randomFood = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    foodRef.current = {
      x: newX,
      y: newY,
      label: randomFood.label,
      color: randomFood.color,
    };
  };

  const startNewGame = () => {
    snakeRef.current = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    setScore(0);
    spawnFood();
    setGameState("playing");
    sounds.playAchievement();
  };

  const endGame = () => {
    setGameState("gameover");
    if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    sounds.playGameOver();

    const finalScore = snakeRef.current.length - 3;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem("pk_snake_highscore", finalScore.toString());
      } catch {}
    }
    onFinishGame(finalScore);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }

      const code = e.code;
      const key = e.key.toLowerCase();
      const currentDir = dirRef.current;

      if ((code === "ArrowUp" || key === "w") && currentDir !== "DOWN") {
        e.preventDefault();
        nextDirRef.current = "UP";
      } else if ((code === "ArrowDown" || key === "s") && currentDir !== "UP") {
        e.preventDefault();
        nextDirRef.current = "DOWN";
      } else if ((code === "ArrowLeft" || key === "a") && currentDir !== "RIGHT") {
        e.preventDefault();
        nextDirRef.current = "LEFT";
      } else if ((code === "ArrowRight" || key === "d") && currentDir !== "LEFT") {
        e.preventDefault();
        nextDirRef.current = "RIGHT";
      } else if (code === "Space" && gameState !== "playing") {
        e.preventDefault();
        startNewGame();
      } else if (code === "KeyR") {
        e.preventDefault();
        startNewGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, gameState]);

  // Tick loop
  useEffect(() => {
    if (!isActive || gameState !== "playing") {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    const tickSpeed = Math.max(85, 140 - (snakeRef.current.length - 3) * 3);

    loopTimerRef.current = setInterval(() => {
      const snake = [...snakeRef.current];
      const dir = nextDirRef.current;
      dirRef.current = dir;

      const head = { ...snake[0] };
      if (dir === "UP") head.y -= 1;
      if (dir === "DOWN") head.y += 1;
      if (dir === "LEFT") head.x -= 1;
      if (dir === "RIGHT") head.x += 1;

      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        endGame();
        return;
      }

      // Self collision
      if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        endGame();
        return;
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        sounds.playCoin();
        setScore((prev) => prev + 1);
        spawnFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      renderCanvas();
    }, tickSpeed);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [isActive, gameState]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    // Background
    ctx.fillStyle = "#121210";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid dots
    ctx.fillStyle = "rgba(240, 236, 228, 0.05)";
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * cellW + cellW / 2 - 0.5, y * cellH + cellH / 2 - 0.5, 1, 1);
      }
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.roundRect(food.x * cellW + 2, food.y * cellH + 2, cellW - 4, cellH - 4, 3);
    ctx.fill();

    ctx.fillStyle = "#0f0f0d";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(food.label, food.x * cellW + cellW / 2, food.y * cellH + cellH / 2);

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#8fb573" : "#6a8c54";
      ctx.beginPath();
      ctx.roundRect(seg.x * cellW + 1.5, seg.y * cellH + 1.5, cellW - 3, cellH - 3, isHead ? 4 : 2);
      ctx.fill();

      if (isHead) {
        // Eyes
        ctx.fillStyle = "#0f0f0d";
        ctx.fillRect(seg.x * cellW + 4, seg.y * cellH + 4, 2, 2);
      }
    });
  };

  useEffect(() => {
    renderCanvas();
  }, [isActive]);

  return (
    <div className="flex flex-col select-none">
      {/* Telemetry Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs font-mono text-[#8a8a7a]">
        <div className="flex items-center gap-4">
          <span>
            BUGS EATEN: <strong className="text-[#8fb573]">{score}</strong>
          </span>
          <span>
            HI: <strong className="text-[#d4a843]">{highScore}</strong>
          </span>
        </div>
        <span className="text-[#8a8a7a] text-[11px]">
          Target: {foodRef.current.label.toUpperCase()}
        </span>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full bg-[#121210]">
        <canvas
          ref={canvasRef}
          width={650}
          height={240}
          className="w-full h-[210px] sm:h-[240px] block"
        />

        {gameState === "idle" && (
          <div
            className="absolute inset-0 bg-[#121210]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={startNewGame}
          >
            <span className="text-2xl mb-1">🐍</span>
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Code Snake: Bug Hunter
            </h3>
            <p className="mt-1 text-xs text-[#8a8a7a] max-w-sm leading-relaxed">
              Navigate the retro terminal. Consume npm packages, Kafka streams, and TypeScript types.
            </p>
            <button
              type="button"
              onClick={startNewGame}
              className="mt-4 bg-[#f0ece4] text-[#0f0f0d] px-5 py-2 text-xs font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Click or Press Space to Start
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div
            className="absolute inset-0 bg-[#121210]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
          >
            <p className="text-xs uppercase tracking-wider text-[#c87941] font-semibold">
              Segment Fault
            </p>
            <h3 className="font-display text-2xl font-bold text-[#f0ece4] mt-1">
              {score} Packages Ingested
            </h3>
            <p className="mt-1 text-xs text-[#8a8a7a]">
              Submitted score for {profile.name}!
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={startNewGame}
                className="inline-flex items-center gap-1.5 bg-[#f0ece4] hover:bg-white text-[#0f0f0d] px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Play Again (Space / R)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-[#333328] bg-[#171714] text-xs text-[#8a8a7a]">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">WASD</kbd> or <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">Arrow Keys</kbd> to steer
          </span>
        </div>

        {/* Mobile D-Pad */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            type="button"
            onClick={() => { if (dirRef.current !== "RIGHT") nextDirRef.current = "LEFT"; }}
            className="border border-[#333328] bg-[#1e1e1a] px-2 py-1 rounded text-xs text-[#f0ece4]"
          >
            ←
          </button>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => { if (dirRef.current !== "DOWN") nextDirRef.current = "UP"; }}
              className="border border-[#333328] bg-[#1e1e1a] px-2 py-0.5 rounded text-xs text-[#f0ece4]"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => { if (dirRef.current !== "UP") nextDirRef.current = "DOWN"; }}
              className="border border-[#333328] bg-[#1e1e1a] px-2 py-0.5 rounded text-xs text-[#f0ece4]"
            >
              ↓
            </button>
          </div>
          <button
            type="button"
            onClick={() => { if (dirRef.current !== "LEFT") nextDirRef.current = "RIGHT"; }}
            className="border border-[#333328] bg-[#1e1e1a] px-2 py-1 rounded text-xs text-[#f0ece4]"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

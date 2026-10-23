"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Users, User } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface PongGameProps {
  profile: VisitorProfile;
  onFinishGame: (score: number) => void;
  isActive: boolean;
}

export default function PongGame({ profile, onFinishGame, isActive }: PongGameProps) {
  const [mode, setMode] = useState<"1P" | "2P">("1P");
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const p1Y = useRef(90);
  const p2Y = useRef(90);
  const paddleHeight = 44;
  const paddleWidth = 8;

  const ball = useRef({
    x: 320,
    y: 120,
    vx: 4,
    vy: 2.5,
    radius: 4,
  });

  const keysDown = useRef<Record<string, boolean>>({});

  const startNewGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    p1Y.current = 90;
    p2Y.current = 90;
    resetBall(1);
    setGameState("playing");
    sounds.playAchievement();
  };

  const resetBall = (direction = 1) => {
    const angle = (Math.random() - 0.5) * 0.8;
    const speed = 4.5;
    ball.current = {
      x: 320,
      y: 120,
      vx: Math.cos(angle) * speed * direction,
      vy: Math.sin(angle) * speed,
      radius: 4,
    };
  };

  // Keyboard capture
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }
      keysDown.current[e.key.toLowerCase()] = true;
      keysDown.current[e.code] = true;

      if (e.code === "Space" && gameState !== "playing") {
        e.preventDefault();
        startNewGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false;
      keysDown.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive, gameState]);

  // Main game loop
  useEffect(() => {
    if (!isActive || gameState !== "playing") {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let p1Current = player1Score;
    let p2Current = player2Score;

    const loop = () => {
      const keys = keysDown.current;
      const paddleSpeed = 5.5;

      // P1 movement (W/S or Up/Down if 1P)
      if (keys["w"] || (mode === "1P" && (keys["arrowup"] || keys["ArrowUp"]))) {
        p1Y.current = Math.max(0, p1Y.current - paddleSpeed);
      }
      if (keys["s"] || (mode === "1P" && (keys["arrowdown"] || keys["ArrowDown"]))) {
        p1Y.current = Math.min(canvas.height - paddleHeight, p1Y.current + paddleSpeed);
      }

      // P2 movement
      if (mode === "2P") {
        if (keys["arrowup"] || keys["ArrowUp"]) {
          p2Y.current = Math.max(0, p2Y.current - paddleSpeed);
        }
        if (keys["arrowdown"] || keys["ArrowDown"]) {
          p2Y.current = Math.min(canvas.height - paddleHeight, p2Y.current + paddleSpeed);
        }
      } else {
        // AI movement with slight latency
        const targetY = ball.current.y - paddleHeight / 2;
        const diff = targetY - p2Y.current;
        p2Y.current += diff * 0.085;
        p2Y.current = Math.max(0, Math.min(canvas.height - paddleHeight, p2Y.current));
      }

      // Ball movement
      const b = ball.current;
      b.x += b.vx;
      b.y += b.vy;

      // Top / bottom bounce
      if (b.y - b.radius <= 0) {
        b.y = b.radius;
        b.vy = Math.abs(b.vy);
        sounds.playChirp();
      } else if (b.y + b.radius >= canvas.height) {
        b.y = canvas.height - b.radius;
        b.vy = -Math.abs(b.vy);
        sounds.playChirp();
      }

      // P1 collision (left paddle at x=20)
      const p1X = 20;
      if (
        b.x - b.radius <= p1X + paddleWidth &&
        b.x + b.radius >= p1X &&
        b.y >= p1Y.current &&
        b.y <= p1Y.current + paddleHeight
      ) {
        b.x = p1X + paddleWidth + b.radius;
        const offset = (b.y - (p1Y.current + paddleHeight / 2)) / (paddleHeight / 2);
        b.vx = Math.abs(b.vx) * 1.05; // slight speedup
        b.vy = offset * 4.5;
        sounds.playHit();
      }

      // P2 collision (right paddle at x=canvas.width - 28)
      const p2X = canvas.width - 28;
      if (
        b.x + b.radius >= p2X &&
        b.x - b.radius <= p2X + paddleWidth &&
        b.y >= p2Y.current &&
        b.y <= p2Y.current + paddleHeight
      ) {
        b.x = p2X - b.radius;
        const offset = (b.y - (p2Y.current + paddleHeight / 2)) / (paddleHeight / 2);
        b.vx = -Math.abs(b.vx) * 1.05;
        b.vy = offset * 4.5;
        sounds.playHit();
      }

      // Scoring
      if (b.x < 0) {
        p2Current += 1;
        setPlayer2Score(p2Current);
        sounds.playFocus();
        if (p2Current >= 5) {
          setWinner(mode === "1P" ? "Dehradun AI Bot" : "Player 2");
          setGameState("gameover");
          sounds.playGameOver();
          return;
        }
        resetBall(1);
      } else if (b.x > canvas.width) {
        p1Current += 1;
        setPlayer1Score(p1Current);
        sounds.playCoin();
        if (p1Current >= 5) {
          setWinner(profile.name);
          setGameState("gameover");
          sounds.playAchievement();
          onFinishGame(p1Current);
          return;
        }
        resetBall(-1);
      }

      // Draw
      ctx.fillStyle = "#121210";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center net
      ctx.strokeStyle = "rgba(240, 236, 228, 0.1)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // P1 Paddle
      ctx.fillStyle = "#d4a843";
      ctx.beginPath();
      ctx.roundRect(p1X, p1Y.current, paddleWidth, paddleHeight, 3);
      ctx.fill();

      // P2 Paddle
      ctx.fillStyle = mode === "1P" ? "#8fb573" : "#7d9eb5";
      ctx.beginPath();
      ctx.roundRect(p2X, p2Y.current, paddleWidth, paddleHeight, 3);
      ctx.fill();

      // Ball
      ctx.fillStyle = "#f0ece4";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, gameState, mode]);

  return (
    <div className="flex flex-col select-none">
      {/* Telemetry bar & Mode toggle */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs font-mono text-[#8a8a7a]">
        <div className="flex items-center gap-4">
          <span className="text-[#d4a843] font-semibold">
            {profile.name}: {player1Score}
          </span>
          <span className="text-[#4a4a3c]">VS</span>
          <span className={mode === "1P" ? "text-[#8fb573] font-semibold" : "text-[#7d9eb5] font-semibold"}>
            {mode === "1P" ? "AI Bot" : "Player 2"}: {player2Score}
          </span>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 rounded border border-[#333328] bg-[#171714] p-0.5">
          <button
            type="button"
            onClick={() => { setMode("1P"); startNewGame(); }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
              mode === "1P" ? "bg-[#d4a843] text-[#0f0f0d] font-semibold" : "text-[#8a8a7a] hover:text-[#f0ece4]"
            }`}
          >
            <User className="h-3 w-3" />
            <span>1P vs AI</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode("2P"); startNewGame(); }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
              mode === "2P" ? "bg-[#d4a843] text-[#0f0f0d] font-semibold" : "text-[#8a8a7a] hover:text-[#f0ece4]"
            }`}
          >
            <Users className="h-3 w-3" />
            <span>2P Local</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full bg-[#121210]">
        <canvas
          ref={canvasRef}
          width={640}
          height={240}
          className="w-full h-[210px] sm:h-[240px] block"
        />

        {gameState === "idle" && (
          <div
            className="absolute inset-0 bg-[#121210]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={startNewGame}
          >
            <span className="text-2xl mb-1">🏓</span>
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Pixel Pong Battle
            </h3>
            <p className="mt-1 text-xs text-[#8a8a7a] max-w-sm leading-relaxed">
              Play classic table tennis against the AI or split your keyboard with a friend. First to 5 wins.
            </p>
            <button
              type="button"
              onClick={startNewGame}
              className="mt-4 bg-[#f0ece4] text-[#0f0f0d] px-5 py-2 text-xs font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Click or Press Space to Serve
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-[#121210]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <p className="text-xs uppercase tracking-wider text-[#d4a843] font-semibold">
              Match Complete
            </p>
            <h3 className="font-display text-2xl font-bold text-[#f0ece4] mt-1">
              {winner} Wins!
            </h3>
            <p className="mt-1 text-xs text-[#8a8a7a]">
              Final score: {player1Score} - {player2Score}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={startNewGame}
                className="inline-flex items-center gap-1.5 bg-[#f0ece4] hover:bg-white text-[#0f0f0d] px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Play Again (Space)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls description */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-[#333328] bg-[#171714] text-xs text-[#8a8a7a]">
        <div>
          {mode === "1P" ? (
            <span>
              <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">W/S</kbd> or <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">↑/↓</kbd> Move Paddle
            </span>
          ) : (
            <span>
              P1 uses <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">W/S</kbd> · P2 uses <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">↑/↓</kbd>
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#6b6b5c]">Rallies accelerate ball velocity</span>
      </div>
    </div>
  );
}

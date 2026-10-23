"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface RunnerGameProps {
  profile: VisitorProfile;
  onFinishGame: (score: number) => void;
  isActive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "syntax" | "leak" | "conflict";
  label: string;
  color: string;
  hp: number;
  speed: number;
  baseY: number;
}

interface Pickup {
  id: number;
  x: number;
  y: number;
  type: "focus" | "star";
  label: string;
  color: string;
}

const MILESTONES = [
  { loc: 200, title: "Rajpur Road Foothills", sub: "Late night coding sprint" },
  { loc: 500, title: "GEHU Campus Feed", sub: "Students sharing notes" },
  { loc: 900, title: "Midnight Hackathon Sprint", sub: "The prototype starts working" },
  { loc: 1400, title: "Distributed Pipeline", sub: "Zero packet loss across the Doon valley" },
  { loc: 2000, title: "Himalayan Sunrise", sub: "Clear skies and stable builds" },
];

export default function RunnerGame({ profile, onFinishGame, isActive }: RunnerGameProps) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [focusBoost, setFocusBoost] = useState(0);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const gameStateRef = useRef<"idle" | "playing" | "gameover">("idle");
  const scoreRef = useRef(0);
  const nextObstacleId = useRef(1);
  const nextPickupId = useRef(1);
  const shakeRef = useRef(0);

  const groundY = 190;
  const playerRef = useRef({
    x: 65,
    y: groundY,
    w: 20,
    h: 28,
    vy: 0,
    isGrounded: true,
    jumpCount: 0,
    maxJumps: 2,
    isSlashing: false,
    slashProgress: 0,
    invincibleTimer: 0,
    focusTimer: 0,
    runFrame: 0,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const pickupsRef = useRef<Pickup[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pk_runner_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const executeJump = () => {
    if (gameStateRef.current === "idle" || gameStateRef.current === "gameover") {
      startNewGame();
      return;
    }

    const p = playerRef.current;
    if (p.isGrounded || p.jumpCount < p.maxJumps) {
      p.vy = -10.5;
      p.isGrounded = false;
      p.jumpCount += 1;
      sounds.playJump();

      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: p.x + p.w / 2,
          y: p.y + p.h,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -1.5,
          color: p.jumpCount === 2 ? "#d4a843" : "#f0ece4",
          size: Math.random() * 2 + 1,
          alpha: 0.7,
          decay: 0.04,
        });
      }
    }
  };

  const executeSlash = () => {
    if (gameStateRef.current !== "playing") return;

    const p = playerRef.current;
    if (!p.isSlashing) {
      p.isSlashing = true;
      p.slashProgress = 0;
      sounds.playSlash();

      const slashReach = 50;
      const slashX = p.x + p.w;
      const slashY = p.y - 8;
      const slashW = slashReach;
      const slashH = p.h + 16;

      obstaclesRef.current.forEach((obs) => {
        if (
          slashX < obs.x + obs.w &&
          slashX + slashW > obs.x &&
          slashY < obs.y + obs.h &&
          slashY + slashH > obs.y
        ) {
          obs.hp -= 1;
          shakeRef.current = 5;
          sounds.playHit();

          for (let i = 0; i < 10; i++) {
            particlesRef.current.push({
              x: obs.x + obs.w / 2,
              y: obs.y + obs.h / 2,
              vx: (Math.random() - 0.2) * 6,
              vy: (Math.random() - 0.5) * 5,
              color: "#d4a843",
              size: Math.random() * 2.5 + 1,
              alpha: 0.9,
              decay: 0.04,
            });
          }

          if (obs.hp <= 0) {
            scoreRef.current += 100;
            setScore(scoreRef.current);
          }
        }
      });

      obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.hp > 0);
    }
  };

  const startNewGame = () => {
    playerRef.current = {
      x: 65,
      y: groundY,
      w: 20,
      h: 28,
      vy: 0,
      isGrounded: true,
      jumpCount: 0,
      maxJumps: 2,
      isSlashing: false,
      slashProgress: 0,
      invincibleTimer: 0,
      focusTimer: 0,
      runFrame: 0,
    };
    obstaclesRef.current = [];
    pickupsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setFocusBoost(0);
    setActiveMilestone(null);
    setGameState("playing");
    gameStateRef.current = "playing";
    sounds.playAchievement();
  };

  const endGame = () => {
    setGameState("gameover");
    gameStateRef.current = "gameover";
    shakeRef.current = 10;
    sounds.playGameOver();

    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem("pk_runner_highscore", finalScore.toString());
      } catch {}
    }
    onFinishGame(finalScore);
  };

  // Keyboard controls
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in chat input
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }

      const code = e.code;
      const key = e.key.toLowerCase();

      if (code === "Space" || code === "ArrowUp" || key === "w") {
        e.preventDefault();
        executeJump();
      } else if (code === "KeyX" || code === "KeyJ" || code === "Enter") {
        e.preventDefault();
        executeSlash();
      } else if (code === "KeyR") {
        e.preventDefault();
        startNewGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isActive) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let spawnTimer = 0;
    let pickupTimer = 0;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const p = playerRef.current;
      const isSlowMo = p.focusTimer > 0;
      const speedMultiplier = isSlowMo ? 0.65 : 1.0;
      const baseSpeed = (220 + Math.min(scoreRef.current * 0.12, 180)) * speedMultiplier;

      if (shakeRef.current > 0) {
        shakeRef.current = Math.max(0, shakeRef.current - dt * 20);
      }

      if (gameStateRef.current === "playing") {
        const scoreInc = Math.floor(dt * 25 * (isSlowMo ? 1.5 : 1));
        scoreRef.current += scoreInc;
        setScore(scoreRef.current);

        const currentMilestone = MILESTONES.find(
          (m) => scoreRef.current >= m.loc && scoreRef.current < m.loc + 100
        );
        if (currentMilestone && activeMilestone !== currentMilestone.title) {
          setActiveMilestone(currentMilestone.title);
          sounds.playChirp();
        }

        if (p.focusTimer > 0) {
          p.focusTimer = Math.max(0, p.focusTimer - dt);
          setFocusBoost(Math.ceil(p.focusTimer));
        }

        p.vy += 30 * dt * (isSlowMo ? 0.8 : 1);
        p.y += p.vy;

        if (p.y >= groundY) {
          p.y = groundY;
          p.vy = 0;
          p.isGrounded = true;
          p.jumpCount = 0;
        }

        if (p.isSlashing) {
          p.slashProgress += dt * 6;
          if (p.slashProgress >= 1) {
            p.isSlashing = false;
            p.slashProgress = 0;
          }
        }

        p.runFrame += dt * 12 * speedMultiplier;

        // Spawn obstacles
        spawnTimer += dt;
        const nextInterval = Math.max(1.4, 2.6 - scoreRef.current * 0.0005);
        if (spawnTimer >= nextInterval) {
          spawnTimer = 0;
          const roll = Math.random();
          let obsType: "syntax" | "leak" | "conflict" = "syntax";
          let label = "SYNTAX ERR";
          let color = "#c87941";
          let w = 22;
          let h = 24;
          let y = groundY + 4;
          let hp = 1;

          if (roll > 0.65) {
            obsType = "leak";
            label = "MEM LEAK";
            color = "#d4a843";
            w = 24;
            h = 22;
            y = groundY - 40;
          } else if (roll > 0.4) {
            obsType = "conflict";
            label = "CONFLICT";
            color = "#7d9eb5";
            w = 28;
            h = 26;
            hp = 2;
          }

          obstaclesRef.current.push({
            id: nextObstacleId.current++,
            x: canvas.width + 20,
            y,
            w,
            h,
            type: obsType,
            label,
            color,
            hp,
            speed: baseSpeed,
            baseY: y,
          });
        }

        // Spawn pickups
        pickupTimer += dt;
        if (pickupTimer >= 4.5) {
          pickupTimer = 0;
          const isFocus = Math.random() > 0.4;
          pickupsRef.current.push({
            id: nextPickupId.current++,
            x: canvas.width + 20,
            y: groundY - 30 - Math.random() * 25,
            type: isFocus ? "focus" : "star",
            label: isFocus ? "FOCUS" : "STAR",
            color: isFocus ? "#d4a843" : "#8fb573",
          });
        }

        // Collision: Obstacles
        obstaclesRef.current.forEach((obs) => {
          obs.x -= obs.speed * dt;
          if (obs.type === "leak") {
            obs.y = obs.baseY + Math.sin(currentTime * 0.005 + obs.id) * 10;
          }

          const inset = 4;
          if (
            p.invincibleTimer <= 0 &&
            p.x + inset < obs.x + obs.w - inset &&
            p.x + p.w - inset > obs.x + inset &&
            p.y + inset < obs.y + obs.h - inset &&
            p.y + p.h - inset > obs.y + inset
          ) {
            endGame();
          }
        });

        obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.x > -50);

        // Collision: Pickups
        pickupsRef.current.forEach((pick) => {
          pick.x -= baseSpeed * dt;
          if (
            p.x < pick.x + 20 &&
            p.x + p.w > pick.x &&
            p.y < pick.y + 20 &&
            p.y + p.h > pick.y
          ) {
            if (pick.type === "focus") {
              p.focusTimer = 5.0;
              setFocusBoost(5);
              sounds.playFocus();
            } else {
              scoreRef.current += 150;
              setScore(scoreRef.current);
              sounds.playCoin();
            }

            for (let i = 0; i < 8; i++) {
              particlesRef.current.push({
                x: pick.x + 10,
                y: pick.y + 10,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: pick.color,
                size: Math.random() * 2 + 1,
                alpha: 0.9,
                decay: 0.05,
              });
            }
            pick.x = -100;
          }
        });

        pickupsRef.current = pickupsRef.current.filter((pick) => pick.x > -30);
      }

      particlesRef.current.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;
      });
      particlesRef.current = particlesRef.current.filter((pt) => pt.alpha > 0);

      // Draw
      ctx.save();

      if (shakeRef.current > 0) {
        const sx = (Math.random() - 0.5) * shakeRef.current;
        const sy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(sx, sy);
      }

      ctx.fillStyle = "#121210";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Foothills silhouette
      ctx.beginPath();
      ctx.moveTo(0, groundY + 10);
      ctx.lineTo(70, groundY - 45);
      ctx.lineTo(160, groundY - 20);
      ctx.lineTo(280, groundY - 55);
      ctx.lineTo(400, groundY - 30);
      ctx.lineTo(520, groundY - 50);
      ctx.lineTo(680, groundY - 25);
      ctx.lineTo(680, groundY + 10);
      ctx.closePath();
      ctx.fillStyle = "rgba(240, 236, 228, 0.03)";
      ctx.fill();

      // Floor line
      const trackY = groundY + p.h;
      ctx.strokeStyle = "rgba(240, 236, 228, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, trackY);
      ctx.lineTo(canvas.width, trackY);
      ctx.stroke();

      // Floor tick marks
      const offset = (currentTime * 0.22) % 36;
      ctx.strokeStyle = "rgba(240, 236, 228, 0.04)";
      for (let x = -offset; x < canvas.width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, trackY);
        ctx.lineTo(x - 16, canvas.height);
        ctx.stroke();
      }

      // Pickups
      pickupsRef.current.forEach((pick) => {
        const bob = Math.sin(currentTime * 0.006 + pick.id) * 3;
        ctx.save();
        ctx.translate(pick.x, pick.y + bob);

        if (pick.type === "focus") {
          ctx.fillStyle = "rgba(212, 168, 67, 0.18)";
          ctx.beginPath();
          ctx.arc(10, 10, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#d4a843";
          ctx.font = "13px monospace";
          ctx.fillText("⚡", 3, 14);
        } else {
          ctx.fillStyle = "rgba(143, 181, 115, 0.18)";
          ctx.beginPath();
          ctx.arc(10, 10, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#8fb573";
          ctx.font = "12px monospace";
          ctx.fillText("✦", 5, 14);
        }
        ctx.restore();
      });

      // Obstacles
      obstaclesRef.current.forEach((obs) => {
        ctx.save();
        ctx.fillStyle = "#1e1e1a";
        ctx.strokeStyle = obs.color;
        ctx.lineWidth = 1.5;

        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        ctx.fillStyle = obs.color;
        ctx.font = "8px sans-serif";
        ctx.fillText(obs.label, obs.x - 2, obs.y - 3);

        ctx.fillStyle = "#f0ece4";
        ctx.font = "10px monospace";
        ctx.fillText(obs.type === "leak" ? "▲" : obs.type === "conflict" ? "⚡" : "✕", obs.x + 6, obs.y + obs.h / 2 + 3);

        ctx.restore();
      });

      // Player character
      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.focusTimer > 0) {
        ctx.fillStyle = "rgba(212, 168, 67, 0.15)";
        ctx.beginPath();
        ctx.arc(p.w / 2, p.h / 2, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#d4a843";
      ctx.fillRect(4, 8, 12, 12);

      ctx.fillStyle = "#f0ece4";
      ctx.fillRect(5, 1, 10, 7);

      ctx.fillStyle = "#c87941";
      ctx.fillRect(4, 7, 12, 2);

      const legCycle = Math.sin(p.runFrame);
      ctx.fillStyle = "#1e1e1a";
      if (p.isGrounded) {
        ctx.fillRect(5, 20, 3, 8 + legCycle * 3);
        ctx.fillRect(12, 20, 3, 8 - legCycle * 3);
      } else {
        ctx.fillRect(4, 19, 4, 6);
        ctx.fillRect(12, 21, 4, 7);
      }

      if (p.isSlashing) {
        ctx.strokeStyle = "#8fb573";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p.w + 6, p.h / 2, 18, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }

      ctx.restore();

      // Particles
      particlesRef.current.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  return (
    <div className="flex flex-col select-none">
      {/* Telemetry bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs font-mono text-[#8a8a7a]">
        <div className="flex items-center gap-4">
          <span>
            SCORE: <strong className="text-[#f0ece4]">{score}</strong>
          </span>
          <span>
            HI: <strong className="text-[#d4a843]">{highScore}</strong>
          </span>
          {focusBoost > 0 && (
            <span className="text-[#d4a843] font-semibold flex items-center gap-1">
              ⚡ FOCUS BOOST ({focusBoost}s)
            </span>
          )}
        </div>

        {activeMilestone && (
          <span className="text-[#8fb573] truncate max-w-[200px]">
            ✦ {activeMilestone}
          </span>
        )}
      </div>

      {/* Canvas Viewport */}
      <div
        className="relative w-full cursor-pointer bg-[#121210]"
        onClick={executeJump}
      >
        <canvas
          ref={canvasRef}
          width={680}
          height={240}
          className="w-full h-[210px] sm:h-[240px] block"
        />

        {/* Idle start screen */}
        {gameState === "idle" && (
          <div
            className="absolute inset-0 bg-[#121210]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => {
              e.stopPropagation();
              startNewGame();
            }}
          >
            <span className="text-2xl mb-1">🏃‍♂️</span>
            <h3 className="font-display text-xl font-bold text-[#f0ece4]">
              Foothills Night Run
            </h3>
            <p className="mt-1 text-xs text-[#8a8a7a] max-w-sm leading-relaxed">
              Jog across the nocturnal Doon valley. Leap over memory leaks and slash merge conflicts.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startNewGame();
              }}
              className="mt-4 bg-[#f0ece4] text-[#0f0f0d] px-5 py-2 text-xs font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Click or Press Space to Run
            </button>
          </div>
        )}

        {/* Game over screen */}
        {gameState === "gameover" && (
          <div
            className="absolute inset-0 bg-[#121210]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-wider text-[#c87941] font-semibold">
              Run Complete
            </p>
            <h3 className="font-display text-2xl font-bold text-[#f0ece4] mt-1">
              {score} Points
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
                <span>Run Again (Space / R)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-[#333328] bg-[#171714] text-xs text-[#8a8a7a]">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">Space</kbd> / <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">W</kbd> Jump
          </span>
          <span>
            <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">X</kbd> / <kbd className="border border-[#333328] bg-[#1e1e1a] px-1.5 py-0.5 rounded text-[10px] text-[#f0ece4]">J</kbd> Slash
          </span>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeSlash();
            }}
            className="border border-[#333328] bg-[#1e1e1a] px-3 py-1 rounded text-xs text-[#f0ece4]"
          >
            ⚔️ Slash
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeJump();
            }}
            className="bg-[#f0ece4] text-[#0f0f0d] px-3 py-1 rounded text-xs font-semibold"
          >
            ↑ Jump
          </button>
        </div>
      </div>
    </div>
  );
}

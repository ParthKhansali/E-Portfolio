"use client";

// 26 Canonical Minecraft Standard Galactic Alphabet (SGA) 7x7 pixel matrices
// Exactly matching the font/ascii_sga.png texture from Minecraft
export const SGA_PIXEL_RUNES: number[][][] = [
  // A: Arch with vertical drop
  [[1,1], [2,1], [3,1], [1,2], [1,3], [1,4], [1,5], [2,5], [4,2], [4,3]],
  // B: L with middle cross & hook
  [[1,1], [1,2], [1,3], [1,4], [1,5], [2,5], [3,5], [4,5], [4,4], [2,3], [3,3]],
  // C: Bracket corners
  [[1,1], [2,1], [1,2], [4,1], [5,1], [5,2], [1,5], [2,5], [1,4], [4,5], [5,5], [5,4]],
  // D: Z-step / jagged lightning
  [[1,1], [2,1], [3,1], [3,2], [3,3], [4,3], [5,3], [5,4], [5,5], [1,5], [2,5]],
  // E: Three horizontal notches
  [[1,1], [2,1], [3,1], [4,1], [2,3], [3,3], [1,5], [2,5], [3,5], [4,5]],
  // F: Cross with dual tick
  [[3,1], [3,2], [3,3], [3,4], [3,5], [1,2], [2,2], [4,2], [5,2], [2,4], [4,4]],
  // G: Triple pillar with top bar
  [[1,1], [2,1], [3,1], [4,1], [5,1], [1,2], [1,3], [3,2], [3,3], [5,2], [5,3], [3,4], [3,5]],
  // H: Double vertical with center colon
  [[1,1], [1,2], [1,3], [1,4], [1,5], [5,1], [5,2], [5,3], [5,4], [5,5], [3,2], [3,4]],
  // I: Vertical dotted line
  [[3,1], [3,2], [3,4], [3,5]],
  // J: Hook with right accent
  [[4,1], [4,2], [4,3], [4,4], [3,5], [2,5], [1,4], [1,1]],
  // K: Reverse L with dots
  [[1,1], [1,2], [1,3], [1,4], [1,5], [2,5], [3,5], [3,2], [4,2]],
  // L: Square U with tail
  [[1,1], [1,2], [1,3], [1,4], [1,5], [2,5], [3,5], [4,5], [4,1], [4,2]],
  // M: Split column
  [[1,1], [1,2], [1,3], [1,4], [1,5], [3,2], [3,3], [5,1], [5,2], [5,3], [5,4], [5,5]],
  // N: Diagonal step
  [[1,1], [1,2], [2,2], [2,3], [3,3], [3,4], [4,4], [4,5], [5,5]],
  // O: Hollow box with center dot
  [[1,1], [2,1], [3,1], [4,1], [1,2], [4,2], [1,3], [4,3], [1,4], [4,4], [1,5], [2,5], [3,5], [4,5], [2,3]],
  // P: Inverted exclamation / key
  [[1,1], [1,2], [1,3], [2,1], [3,1], [3,2], [2,3], [1,5]],
  // Q: T-bar with diagonal kick
  [[1,1], [2,1], [3,1], [4,1], [5,1], [3,2], [3,3], [3,4], [4,5], [5,5]],
  // R: Dual colon pair
  [[2,1], [2,2], [4,1], [4,2], [2,4], [2,5], [4,4], [4,5]],
  // S: S-curve block
  [[2,1], [3,1], [4,1], [1,2], [2,3], [3,3], [4,4], [1,5], [2,5], [3,5]],
  // T: T-shape with double base
  [[1,1], [2,1], [3,1], [4,1], [5,1], [3,2], [3,3], [3,4], [3,5], [2,5], [4,5]],
  // U: U-shape goblet
  [[1,1], [1,2], [1,3], [5,1], [5,2], [5,3], [2,4], [4,4], [3,5]],
  // V: Angle
  [[1,1], [1,2], [2,3], [3,4], [4,3], [5,2], [5,1]],
  // W: Tri-dot colon
  [[3,1], [3,2], [1,4], [1,5], [5,4], [5,5]],
  // X: Twin pillars
  [[1,1], [1,2], [1,3], [1,4], [1,5], [4,1], [4,2], [4,3], [4,4], [4,5]],
  // Y: Arch with open base
  [[1,1], [2,1], [3,1], [4,1], [1,2], [1,3], [1,4], [4,2], [4,3], [4,4]],
  // Z: Hourglass
  [[1,1], [2,1], [3,1], [4,1], [5,1], [4,2], [3,3], [2,4], [1,5], [2,5], [3,5], [4,5], [5,5]],
];

export function SgaRune({
  runeIndex,
  className = "w-4 h-4",
  color = "#c77dff",
}: {
  runeIndex: number;
  className?: string;
  color?: string;
}) {
  const pixels = SGA_PIXEL_RUNES[runeIndex % SGA_PIXEL_RUNES.length];

  return (
    <svg
      viewBox="0 0 7 7"
      className={className}
      style={{
        shapeRendering: "crispEdges",
        color,
        filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}60)`,
      }}
      aria-hidden="true"
    >
      {pixels.map(([x, y], idx) => (
        <rect key={idx} x={x} y={y} width={1} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

// Fixed deterministic distribution to avoid SSR hydration mismatches
const FIELD_PARTICLES = [
  { rune: 0, left: "5%", top: "14%", duration: "6.5s", delay: "0.2s", size: "w-4 h-4", color: "#c77dff" },
  { rune: 4, left: "12%", top: "28%", duration: "7.8s", delay: "1.8s", size: "w-3.5 h-3.5", color: "#00f5d4" },
  { rune: 7, left: "22%", top: "10%", duration: "6.0s", delay: "3.2s", size: "w-4 h-4", color: "#e0aaff" },
  { rune: 11, left: "30%", top: "45%", duration: "8.2s", delay: "0.9s", size: "w-3 h-3", color: "#7209b7" },
  { rune: 14, left: "42%", top: "18%", duration: "7.1s", delay: "2.4s", size: "w-4 h-4", color: "#c77dff" },
  { rune: 18, left: "58%", top: "22%", duration: "6.7s", delay: "1.2s", size: "w-3.5 h-3.5", color: "#00f5d4" },
  { rune: 21, left: "70%", top: "12%", duration: "7.5s", delay: "3.5s", size: "w-4 h-4", color: "#ffd166" },
  { rune: 24, left: "82%", top: "34%", duration: "6.2s", delay: "0.5s", size: "w-4 h-4", color: "#e0aaff" },
  { rune: 2, left: "91%", top: "16%", duration: "8.0s", delay: "2.1s", size: "w-3.5 h-3.5", color: "#c77dff" },
  { rune: 6, left: "95%", top: "42%", duration: "6.9s", delay: "3.8s", size: "w-3 h-3", color: "#00f5d4" },

  // Middle & Lower section particles
  { rune: 9, left: "8%", top: "62%", duration: "7.3s", delay: "1.5s", size: "w-3.5 h-3.5", color: "#ffd166" },
  { rune: 13, left: "16%", top: "82%", duration: "6.4s", delay: "2.9s", size: "w-4 h-4", color: "#c77dff" },
  { rune: 17, left: "26%", top: "68%", duration: "7.9s", delay: "0.7s", size: "w-3 h-3", color: "#00f5d4" },
  { rune: 20, left: "36%", top: "88%", duration: "6.8s", delay: "3.1s", size: "w-4 h-4", color: "#e0aaff" },
  { rune: 23, left: "48%", top: "72%", duration: "8.1s", delay: "1.9s", size: "w-3.5 h-3.5", color: "#c77dff" },
  { rune: 1, left: "62%", top: "84%", duration: "6.3s", delay: "0.4s", size: "w-4 h-4", color: "#7209b7" },
  { rune: 5, left: "72%", top: "65%", duration: "7.4s", delay: "2.6s", size: "w-3.5 h-3.5", color: "#00f5d4" },
  { rune: 10, left: "84%", top: "80%", duration: "6.6s", delay: "3.7s", size: "w-4 h-4", color: "#ffd166" },
  { rune: 15, left: "92%", top: "66%", duration: "7.7s", delay: "1.1s", size: "w-3 h-3", color: "#c77dff" },

  // Additional atmospheric runes floating between cards
  { rune: 8, left: "52%", top: "40%", duration: "7.0s", delay: "2.2s", size: "w-3 h-3", color: "#c77dff" },
  { rune: 12, left: "45%", top: "54%", duration: "6.5s", delay: "0.8s", size: "w-3.5 h-3.5", color: "#00f5d4" },
  { rune: 16, left: "55%", top: "58%", duration: "8.4s", delay: "3.4s", size: "w-3 h-3", color: "#e0aaff" },
];

export default function EnchantingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-5 overflow-hidden select-none">
      {FIELD_PARTICLES.map((p, i) => (
        <div
          key={`sga-particle-${i}`}
          className="absolute will-change-transform"
          style={{
            left: p.left,
            top: p.top,
            animation: `sga-float ${p.duration} ease-in-out infinite`,
            animationDelay: `-${p.delay}`,
          }}
        >
          <SgaRune
            runeIndex={p.rune}
            className={p.size}
            color={p.color}
          />
        </div>
      ))}
    </div>
  );
}

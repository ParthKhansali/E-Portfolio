"use client";

import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number = 0;
    let isRunning = false;

    const loop = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.15;
      currentY += dy * 0.15;

      if (el) {
        el.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;
      }

      // If close to target, stop loop to preserve battery and GPU cycles
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rafId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Initial position
    el.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
    >
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full will-change-transform opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(67, 97, 238, 0.06) 0%, rgba(114, 9, 183, 0.02) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}

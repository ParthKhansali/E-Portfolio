"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const isTouchDevice = useRef(false);
  const isMouseDown = useRef(false);

  useEffect(() => {
    // Detect touch / mobile
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    let isVisible = false;

    const updateCursor = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // Dot tracks mouse position with 0 latency for crisp, responsive aiming
        const dotScale = isMouseDown.current ? 0.65 : 1;
        dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;

        // Ring follows with responsive, fluid lerp (0.35)
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.35;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.35;
        const ringScale = isMouseDown.current ? 0.85 : 1;
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;

        if (!isVisible && pos.current.x > 0) {
          isVisible = true;
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
      }

      rafId.current = requestAnimationFrame(updateCursor);
    };

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']"
      );
      const cardEl = target.closest("[data-cursor='card']");
      const textEl = target.closest("p, h1, h2, h3, h4, h5, h6, span, li, [data-cursor='text']");

      if (cardEl) {
        document.body.classList.remove("cursor-hover", "cursor-text");
        document.body.classList.add("cursor-card");
      } else if (interactive) {
        document.body.classList.remove("cursor-card", "cursor-text");
        document.body.classList.add("cursor-hover");
      } else if (textEl && !interactive) {
        document.body.classList.remove("cursor-hover", "cursor-card");
        document.body.classList.add("cursor-text");
      } else {
        document.body.classList.remove("cursor-hover", "cursor-text", "cursor-card");
      }
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onMouseLeave = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = "0";
        ringRef.current.style.opacity = "0";
      }
    };

    const onMouseEnter = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = "1";
        ringRef.current.style.opacity = "1";
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    rafId.current = requestAnimationFrame(updateCursor);

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    style.id = "custom-cursor-style";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = "";
      document.getElementById("custom-cursor-style")?.remove();
      document.body.classList.remove("cursor-hover", "cursor-text", "cursor-card");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot hidden md:block opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring hidden md:block opacity-0"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const cursorState = useRef("default");
  const rafId = useRef<number>(0);
  const isTouchDevice = useRef(false);

  const updateCursor = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Smooth interpolation — dot follows faster, ring lags behind
    dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.25;
    dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.25;
    ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
    ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

    dot.style.left = `${dotPos.current.x}px`;
    dot.style.top = `${dotPos.current.y}px`;
    ring.style.left = `${ringPos.current.x}px`;
    ring.style.top = `${ringPos.current.y}px`;

    rafId.current = requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    // Detect touch
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']"
      );
      const textEl = target.closest(
        "p, h1, h2, h3, h4, h5, h6, span, li, [data-cursor='text']"
      );
      const cardEl = target.closest("[data-cursor='card']");

      if (cardEl) {
        cursorState.current = "card";
        document.body.classList.remove("cursor-hover", "cursor-text");
        document.body.classList.add("cursor-card");
      } else if (interactive) {
        cursorState.current = "hover";
        document.body.classList.remove("cursor-card", "cursor-text");
        document.body.classList.add("cursor-hover");
      } else if (textEl && !interactive) {
        cursorState.current = "text";
        document.body.classList.remove("cursor-hover", "cursor-card");
        document.body.classList.add("cursor-text");
      } else {
        cursorState.current = "default";
        document.body.classList.remove(
          "cursor-hover",
          "cursor-text",
          "cursor-card"
        );
      }
    };

    const onMouseDown = () => {
      dotRef.current?.style.setProperty("transform", "translate(-50%, -50%) scale(0.6)");
      ringRef.current?.style.setProperty("transform", "translate(-50%, -50%) scale(0.85)");
    };

    const onMouseUp = () => {
      dotRef.current?.style.setProperty("transform", "translate(-50%, -50%) scale(1)");
      ringRef.current?.style.setProperty("transform", "translate(-50%, -50%) scale(1)");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    rafId.current = requestAnimationFrame(updateCursor);

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent =
      "*, *::before, *::after { cursor: none !important; }";
    style.id = "custom-cursor-style";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(rafId.current);
      document.body.style.cursor = "";
      document.getElementById("custom-cursor-style")?.remove();
      document.body.classList.remove(
        "cursor-hover",
        "cursor-text",
        "cursor-card"
      );
    };
  }, [updateCursor]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}

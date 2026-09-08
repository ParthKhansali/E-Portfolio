"use client";

import { useEffect, useRef, useState } from "react";
import { getVisitorLocation } from "@/lib/geo";

// Canonical Oneko 32x32 sprite coordinate map: [col, row]
// Multiplied by -32px for CSS background-position
const spriteSets: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

// Personality tour guide lines per section (Portfolio Copy v2)
const sectionGuides: Record<string, string[]> = {
  hero: [
    "You found me.",
    "I wasn't doing anything.",
    "Definitely not judging your tech stack.",
  ],
  portal: [
    "A suspicious number of technologies.",
  ],
  projects: [
    "Oh, these are the interesting bits.",
  ],
  dashboard: [
    "Less \"I know everything.\" More \"let me figure it out.\"",
    "Definitely not judging your tech stack.",
  ],
  experience: [
    "People, projects & a few microphones.",
  ],
  guestbook: [
    "Someone left a note. Probably important.",
  ],
  contact: [
    "Aha. The official paperwork.",
  ],
};

const petLines = [
  "Okay. Back to work.",
  "You found me.",
  "I wasn't doing anything.",
  "Definitely not judging your tech stack.",
];

export default function CursorAssistant() {
  const [enabled, setEnabled] = useState(true);
  const [visitorCity, setVisitorCity] = useState<string | null>(null);
  const [speech, setSpeech] = useState<string | null>("Hey! I'm Neko, your guide 🐾");
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isSleeping, setIsSleeping] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 140, y: 140 });
  const targetRef = useRef({ x: 140, y: 140 });
  const isHoveredRef = useRef(false);
  const isPettingRef = useRef(false);
  const currentSectionRef = useRef("hero");

  // Fetch visitor city
  useEffect(() => {
    let isMounted = true;
    getVisitorLocation().then((loc) => {
      if (isMounted && loc?.city) {
        setVisitorCity(loc.city);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle listener from Navbar
  useEffect(() => {
    const handleToggle = (e: CustomEvent<"cat" | "off">) => {
      setEnabled(e.detail === "cat");
    };
    window.addEventListener("toggle-assistant", handleToggle as EventListener);
    return () => window.removeEventListener("toggle-assistant", handleToggle as EventListener);
  }, []);

  // Easter egg: welcome back when returning to tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setSpeech("You're back! I was guarding your spot 🛡️");
        setTimeout(() => setSpeech(null), 3500);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Easter egg: fast scroll zoomies
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let isZooming = false;

    const handleScroll = () => {
      const now = Date.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaTime = now - lastScrollTime;

      if (deltaTime > 0 && deltaY / deltaTime > 2.5 && !isZooming && !isPettingRef.current) {
        isZooming = true;
        setSpeech("Whoa, zoomies! Hold on tight! 💨");
        setTimeout(() => {
          isZooming = false;
        }, 3000);
      }

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tour guide dialogue rotation
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPettingRef.current || isHoveredRef.current) return;

      // Detect current section on screen
      const scrollY = window.scrollY + window.innerHeight / 2;
      const portalEl = document.getElementById("portal-marquee");
      const projectsEl = document.getElementById("projects");
      const dashboardEl = document.getElementById("dev-dashboard");
      const expEl = document.getElementById("experience");
      const guestEl = document.getElementById("guestbook");
      const ctaEl = document.getElementById("contact");

      let active = "hero";
      if (ctaEl && scrollY >= ctaEl.offsetTop) active = "contact";
      else if (guestEl && scrollY >= guestEl.offsetTop) active = "guestbook";
      else if (expEl && scrollY >= expEl.offsetTop) active = "experience";
      else if (dashboardEl && scrollY >= dashboardEl.offsetTop) active = "dashboard";
      else if (projectsEl && scrollY >= projectsEl.offsetTop) active = "projects";
      else if (portalEl && scrollY >= portalEl.offsetTop) active = "portal";

      currentSectionRef.current = active;
      const pool = sectionGuides[active] || sectionGuides.hero;
      const randomLine = pool[Math.floor(Math.random() * pool.length)];

      setSpeech(randomLine);

      // Dismiss after 4.5 seconds
      setTimeout(() => {
        setSpeech((prev) => (prev === randomLine ? null : prev));
      }, 4500);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const catEl = catRef.current;
    if (!catEl) return;

    let nekoPosX = posRef.current.x;
    let nekoPosY = posRef.current.y;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let intervalId: NodeJS.Timeout | null = null;

    const setSprite = (name: string, frame: number) => {
      const frames = spriteSets[name];
      if (!frames || frames.length === 0) return;
      const sprite = frames[frame % frames.length];
      if (spriteRef.current) {
        spriteRef.current.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      frameCount++;

      // When being petted, stay still and alert
      if (isPettingRef.current) {
        setSprite("alert", 0);
        return;
      }

      // If user hovers over the cat, freeze in place so user can click or observe without chasing
      if (isHoveredRef.current) {
        setSprite("alert", 0);
        return;
      }

      const mouseX = targetRef.current.x;
      const mouseY = targetRef.current.y;

      // Rest strictly beside the mouse at a clean companion offset (never directly on the cursor)
      const isNearRightEdge = typeof window !== "undefined" && mouseX > window.innerWidth - 80;
      const offsetX = isNearRightEdge ? -48 : 48;
      const offsetY = 14;

      const targetX = mouseX + offsetX;
      const targetY = mouseY + offsetY;

      const diffX = nekoPosX - targetX;
      const diffY = nekoPosY - targetY;
      const distance = Math.hypot(diffX, diffY);

      // Cat sits comfortably in its resting companion spot beside cursor
      if (distance < 14) {
        idleTime++;

        // Random cute idle behavior while waiting
        if (idleTime > 8 && Math.floor(Math.random() * 30) === 0 && idleAnimation === null) {
          const choices = ["scratchSelf", "tired", "alert"];
          idleAnimation = choices[Math.floor(Math.random() * choices.length)];
          idleAnimationFrame = 0;
        }

        if (idleAnimation) {
          setSprite(idleAnimation, idleAnimationFrame);
          idleAnimationFrame++;
          if (idleAnimationFrame > 6) {
            idleAnimation = null;
          }
          setIsSleeping(false);
        } else if (idleTime > 50) {
          // Deep sleep (after ~5s still)
          if (idleTime === 51) {
            setSpeech("Zzz... even developers need sleep.");
            setTimeout(() => {
              setSpeech((s) => (s === "Zzz... even developers need sleep." ? null : s));
            }, 4000);
          }
          setIsSleeping(true);
          setSprite("sleeping", Math.floor(frameCount / 4));
        } else if (idleTime > 25) {
          // Yawn / tired (after ~2.5s still)
          setIsSleeping(false);
          setSprite("tired", 0);
        } else {
          setIsSleeping(false);
          setSprite("idle", 0);
        }
        return;
      }

      // If waking up from sleep, briefly alert then run
      if (idleTime > 50) {
        setSprite("alert", 0);
        idleTime = 5;
        setIsSleeping(false);
      } else {
        setIsSleeping(false);
        idleTime = 0;
        idleAnimation = null;
      }

      // Smooth catch-up speed proportional to distance, capped to avoid overshoot
      const speed = distance > 300 ? 22 : distance > 100 ? 15 : 10;
      const step = Math.min(speed, distance);

      // 8-direction navigation
      let direction = "";
      if (diffY / distance > 0.5) direction = "N";
      else if (diffY / distance < -0.5) direction = "S";

      if (diffX / distance > 0.5) direction += "W";
      else if (diffX / distance < -0.5) direction += "E";

      if (direction === "") direction = "S";

      // Classic 2-frame running gait
      setSprite(direction, frameCount % 2);

      // Move toward companion resting spot smoothly
      nekoPosX -= (diffX / distance) * step;
      nekoPosY -= (diffY / distance) * step;

      posRef.current = { x: nekoPosX, y: nekoPosY };
      catEl.style.transform = `translate3d(${nekoPosX - 16}px, ${nekoPosY - 16}px, 0)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    intervalId = setInterval(update, 100); // 100ms (10 FPS) authentic Oneko timing

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled]);

  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    isPettingRef.current = true;
    setIsSleeping(false);

    // Pick random charming petting response
    const activePetLines = visitorCity
      ? [...petLines, `Visiting from ${visitorCity}? Parth says hi! 🐾`]
      : petLines;
    const line = activePetLines[Math.floor(Math.random() * activePetLines.length)];
    setSpeech(line);

    const catX = posRef.current.x;
    const catY = posRef.current.y;
    const newHearts = [
      { id: Date.now(), x: catX - 12, y: catY - 22 },
      { id: Date.now() + 1, x: catX + 12, y: catY - 30 },
      { id: Date.now() + 2, x: catX - 2, y: catY - 40 },
    ];
    setHearts((prev) => [...prev.slice(-6), ...newHearts]);

    setTimeout(() => {
      isPettingRef.current = false;
    }, 2400);

    setTimeout(() => {
      setSpeech((prev) => (prev === line ? null : prev));
    }, 3200);
  };

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Container div with immediate translate3d and clean 32px sprite hit-box */}
      <div
        ref={catRef}
        onClick={handlePet}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        role="button"
        tabIndex={0}
        aria-label="Neko, your companion cat (Click to pet)"
        className="pointer-events-auto absolute h-8 w-8 flex items-center justify-center cursor-pointer select-none will-change-transform active:scale-125 transition-transform"
        style={{
          transform: "translate3d(140px, 140px, 0)",
        }}
      >
        {/* Actual 32x32 Oneko Sprite Element */}
        <div
          ref={spriteRef}
          className="h-8 w-8 pointer-events-none"
          style={{
            backgroundImage: "url('/oneko.gif')",
            backgroundPosition: "-96px -96px",
            imageRendering: "pixelated",
          }}
        />

        {/* Sleeping Zzz Indicator */}
        {isSleeping && (
          <div className="pointer-events-none absolute -top-4 -right-1 font-mono text-[10px] font-bold text-[#c77dff] animate-pulse">
            Zzz...
          </div>
        )}

        {/* Interactive Tour Guide Speech Bubble */}
        {speech && (
          <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-[#08080a]/95 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-white shadow-[0_8px_25px_rgba(0,0,0,0.8)] flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
            <span>{speech}</span>
          </div>
        )}
      </div>

      {/* Floating Hearts on Pet */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="pointer-events-none fixed text-base animate-[float-up_1.5s_ease-out_forwards]"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

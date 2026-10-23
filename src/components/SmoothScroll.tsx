"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    };

    // 1. Force manual scroll restoration so reloading never drops the user in the middle of the page
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      
      const navEntry = window.performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
      const isReload = navEntry?.type === "reload";

      if (isReload && window.location.hash) {
        history.replaceState(null, "", window.location.pathname);
      }

      window.scrollTo(0, 0);
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    let rafId: number;
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: false, // Let native OS touchpad/touch gestures remain 1:1 responsive
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // Reset Lenis scroll position to top
    const resetToTop = () => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    };

    resetToTop();
    requestAnimationFrame(resetToTop);
    const t1 = setTimeout(resetToTop, 60);
    const t2 = setTimeout(resetToTop, 180);

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      lenis.destroy();
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, []);

  return <>{children}</>;
}

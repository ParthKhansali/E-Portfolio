"use client";

import Image from "next/image";

// Row 1: Languages & Build tools (traverses Left -> Right through portals)
const row1Tools = [
  "C++",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "SQL",
  "React",
  "Next.js",
  "Node.js",
  "Spring Boot",
  "React Native",
  "Express",
];

// Row 2: Data, Infrastructure & Core Concepts (traverses Right -> Left through portals)
const row2Tools = [
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Cloudflare R2",
  "Docker",
  "Git",
  "GitHub",
  "REST APIs",
  "JWT",
  "Database Design",
  "System Design",
  "AI APIs",
];

export default function PortalMarquee() {
  // Quadruple items to guarantee seamless looping across any screen width
  const row1Items = [...row1Tools, ...row1Tools, ...row1Tools, ...row1Tools];
  const row2Items = [...row2Tools, ...row2Tools, ...row2Tools, ...row2Tools];

  return (
    <section
      id="portal-marquee"
      className="relative my-10 overflow-hidden bg-[#050505] py-14 border-y border-white/[0.04]"
      aria-label="Skills & Tooling Nether Portal Marquee"
    >
      {/* Background Portal Dimensional Space Warp */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#7209b7]/30 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#7209b7]/30 blur-[130px] animate-pulse" />

      {/* Section Header */}
      <div className="relative z-20 mb-8 flex flex-col items-center text-center px-4">
        <span className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#c77dff]">
          MY TOOLBOX
        </span>
        <h2 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-white">
          The stuff I reach for
        </h2>
        <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#888]">
          A mix of tools I&apos;ve actually spent time with — plus a growing list of things I&apos;m currently trying to break, understand and build with.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* PORTAL TRANSIT STAGE: Left Portal, Center Warp Marquee, Right Portal */}
      {/* Both portals and the scrolling tracks share the EXACT SAME vertical center */}
      {/* ========================================================================= */}
      <div className="relative w-full py-6 flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[260px]">

        {/* ----------------- LEFT PORTAL ----------------- */}
        {/* Layer 1: Left Back Vortex (Behind Text) */}
        <div className="pointer-events-none absolute -left-4 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 z-5 w-36 sm:w-48 md:w-56 drop-shadow-[0_0_35px_rgba(199,125,255,0.8)]">
          <div className="relative w-full [clip-path:inset(0_0_4%_0)]">
            <Image
              src="/nether-portal-vortex.png"
              alt="Nether Portal Left Vortex"
              width={300}
              height={300}
              className="h-auto w-full object-contain animate-pulse filter drop-shadow-[0_0_25px_rgba(199,125,255,0.7)]"
              priority
            />
          </div>
        </div>

        {/* ----------------- RIGHT PORTAL (Mirrored) ----------------- */}
        {/* Layer 1: Right Back Vortex (Behind Text) */}
        <div className="pointer-events-none absolute -right-4 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 z-5 w-36 sm:w-48 md:w-56 scale-x-[-1] drop-shadow-[0_0_35px_rgba(199,125,255,0.8)]">
          <div className="relative w-full [clip-path:inset(0_0_4%_0)]">
            <Image
              src="/nether-portal-vortex.png"
              alt="Nether Portal Right Vortex"
              width={300}
              height={300}
              className="h-auto w-full object-contain animate-pulse filter drop-shadow-[0_0_25px_rgba(199,125,255,0.7)]"
              priority
            />
          </div>
        </div>

        {/* ----------------- SCROLLING WARP MARQUEE (Traversing Aperture) ----------------- */}
        {/* Layer 2: Text Track with Aperture Horizon Mask (emerges from inside the purple opening) */}
        <div className="relative z-15 w-full flex flex-col gap-3 sm:gap-4 [mask-image:linear-gradient(to_right,transparent_0px,transparent_60px,rgba(0,0,0,0.3)_100px,black_160px,black_calc(100%-160px),rgba(0,0,0,0.3)_calc(100%-100px),transparent_calc(100%-60px),transparent_100%)] sm:[mask-image:linear-gradient(to_right,transparent_0px,transparent_80px,rgba(0,0,0,0.4)_130px,black_200px,black_calc(100%-200px),rgba(0,0,0,0.4)_calc(100%-130px),transparent_calc(100%-80px),transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0px,transparent_100px,rgba(0,0,0,0.4)_160px,black_230px,black_calc(100%-230px),rgba(0,0,0,0.4)_calc(100%-160px),transparent_calc(100%-100px),transparent_100%)]">
          
          {/* Row 1: Leftward Stream */}
          <div className="relative flex w-full overflow-hidden py-1">
            <div className="portal-track-left items-center gap-6 whitespace-nowrap">
              {row1Items.map((item, idx) => (
                <div
                  key={`r1-${idx}`}
                  className="group flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#aaa] transition-all hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm transition-all group-hover:border-[#c77dff]/70 group-hover:bg-[#7209b7]/20 group-hover:shadow-[0_0_20px_rgba(199,125,255,0.4)]">
                    <span className="text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {item}
                    </span>
                  </span>
                  <span className="text-[#c77dff] text-xs opacity-70">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Rightward Stream */}
          <div className="relative flex w-full overflow-hidden py-1">
            <div className="portal-track-right items-center gap-6 whitespace-nowrap">
              {row2Items.map((item, idx) => (
                <div
                  key={`r2-${idx}`}
                  className="group flex items-center gap-6 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[#888] transition-all hover:text-[#06d6a0] cursor-pointer"
                >
                  <span className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 backdrop-blur-sm transition-all group-hover:border-[#06d6a0]/60 group-hover:bg-[#06d6a0]/15 group-hover:shadow-[0_0_20px_rgba(6,214,160,0.3)]">
                    <span className="text-[#bbb] transition-colors group-hover:text-[#06d6a0]">
                      {item}
                    </span>
                  </span>
                  <span className="text-[#7209b7] text-xs opacity-80">◆</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------- FRONT OBSIDIAN FRAMES ----------------- */}
        {/* Layer 3: Left Front Obsidian Frame (clipped bottom to remove white line) */}
        <div className="pointer-events-none absolute -left-4 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 z-25 w-36 sm:w-48 md:w-56 drop-shadow-[0_0_40px_rgba(114,9,183,0.7)]">
          <div className="relative w-full [clip-path:inset(0_0_4%_0)]">
            <Image
              src="/nether-portal-frame.png"
              alt="Nether Portal Left Obsidian Frame"
              width={300}
              height={300}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          {/* Portal Event Horizon Ambient Light spilling inward */}
          <div className="pointer-events-none absolute right-2 top-1/4 bottom-1/4 w-12 bg-gradient-to-r from-transparent to-[#c77dff]/25 blur-sm" />
        </div>

        {/* Layer 3: Right Front Obsidian Frame (Mirrored, clipped bottom) */}
        <div className="pointer-events-none absolute -right-4 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 z-25 w-36 sm:w-48 md:w-56 scale-x-[-1] drop-shadow-[0_0_40px_rgba(114,9,183,0.7)]">
          <div className="relative w-full [clip-path:inset(0_0_4%_0)]">
            <Image
              src="/nether-portal-frame.png"
              alt="Nether Portal Right Obsidian Frame"
              width={300}
              height={300}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          {/* Portal Event Horizon Ambient Light spilling inward */}
          <div className="pointer-events-none absolute right-2 top-1/4 bottom-1/4 w-12 bg-gradient-to-r from-transparent to-[#c77dff]/25 blur-sm" />
        </div>

        {/* Floating Nether Portal Energy Sparks directly at the portal mouth */}
        <div className="pointer-events-none absolute left-36 sm:left-48 md:left-60 top-1/4 z-30 text-[#c77dff] animate-ping opacity-75 text-xs">✦</div>
        <div className="pointer-events-none absolute left-40 sm:left-52 md:left-64 bottom-1/4 z-30 text-[#e0aaff] animate-pulse opacity-90 text-sm">✧</div>
        <div className="pointer-events-none absolute right-36 sm:right-48 md:right-60 top-1/4 z-30 text-[#c77dff] animate-ping opacity-75 text-xs">✦</div>
        <div className="pointer-events-none absolute right-40 sm:right-52 md:right-64 bottom-1/4 z-30 text-[#e0aaff] animate-pulse opacity-90 text-sm">✧</div>
      </div>

      {/* Section Footer Thought */}
      <div className="relative z-20 mt-6 flex flex-col items-center text-center px-4">
        <p className="text-xs text-[#777] font-medium">
          No, I don&apos;t know every framework. Nobody does.
        </p>
        <p className="text-[11px] text-[#555] mt-1">
          Tools change. Good engineering habits stick around.
        </p>
      </div>
    </section>
  );
}

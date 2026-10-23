"use client";

import GitTerminal from "./GitTerminal";
import DevMetrics from "./DevMetrics";
import MusicWidget from "./MusicWidget";

export default function DevDashboard() {
  return (
    <section
      id="systems"
      className="section-padding relative overflow-hidden bg-[#131311] border-t border-[#f0ece4]/[0.04]"
      aria-label="Developer Workspace"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(240,236,228,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div id="dev-dashboard" className="absolute -top-24 pointer-events-none" />
      <div className="mx-auto max-w-6xl">
        {/* Section header — clean, no eyebrow */}
        <div className="mb-10">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-[#f0ece4]">
            The build log
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[#8a8a7a] leading-relaxed">
            Real terminal output. Real GitHub history. Whatever I'm listening to right now. Nothing here is made up.
          </p>
        </div>

        {/* Terminal + GitHub side by side */}
        <div className="grid gap-6 lg:grid-cols-12 items-start mb-8">
          <div className="lg:col-span-7">
            <GitTerminal />
          </div>
          <div className="lg:col-span-5">
            <DevMetrics />
          </div>
        </div>

        {/* Music widget */}
        <MusicWidget />
      </div>
    </section>
  );
}

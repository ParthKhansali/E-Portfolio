"use client";

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
  "JWT Auth",
  "Database Design",
  "Distributed Systems",
  "Kafka",
];

export default function PortalMarquee() {
  const row1Items = [...row1Tools, ...row1Tools, ...row1Tools];
  const row2Items = [...row2Tools, ...row2Tools, ...row2Tools];

  return (
    <section
      id="portal-marquee"
      className="relative overflow-hidden bg-[#0f0f0d] py-16 border-y border-[#f0ece4]/[0.06]"
      aria-label="Technologies and Tooling"
    >
      {/* Header */}
      <div className="relative z-10 mb-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <p className="text-xs font-semibold tracking-wider text-[#d4a843] uppercase mb-2">
          The Toolbox
        </p>
        <h2 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-[#f0ece4]">
          What I actually use
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8a8a7a]">
          I don't collect tools for the resume. These are the ones that show up in my git log.
        </p>
      </div>

      {/* Marquee dual stream with gradient edge masks */}
      <div className="relative w-full flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Row 1: Leftward Stream */}
        <div className="relative flex w-full overflow-hidden py-1">
          <div className="portal-track-left items-center gap-4 whitespace-nowrap">
            {row1Items.map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="group flex items-center gap-4 text-xs font-medium text-[#8a8a7a]"
              >
                <span className="flex items-center gap-2 rounded border border-[#333328] bg-[#171714] px-3.5 py-1.5 transition-colors group-hover:border-[#555548] group-hover:text-[#f0ece4]">
                  {item}
                </span>
                <span className="text-[#333328] text-xs">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Stream */}
        <div className="relative flex w-full overflow-hidden py-1">
          <div className="portal-track-right items-center gap-4 whitespace-nowrap">
            {row2Items.map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="group flex items-center gap-4 text-xs font-medium text-[#8a8a7a]"
              >
                <span className="flex items-center gap-2 rounded border border-[#333328] bg-[#171714] px-3.5 py-1.5 transition-colors group-hover:border-[#555548] group-hover:text-[#f0ece4]">
                  {item}
                </span>
                <span className="text-[#333328] text-xs">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtext thought */}
      <div className="relative z-10 mt-8 text-center px-4">
        <p className="text-xs text-[#6a6a5e]">
          The list changes. The habit of reading the source code before the tutorial doesn't.
        </p>
      </div>
    </section>
  );
}

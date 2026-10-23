"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, ExternalLink, ThumbsUp, MessageSquare, CloudUpload, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { projects, Project } from "@/data/projects";
import { sounds } from "@/lib/soundFx";

/* ═══════════════════════════════════════════════════════════
   VISUALIZER HERO BLOCKS
   Tailored, innovative animated micro-scenes engineered specifically
   for each project's domain and technical architecture.
   ═══════════════════════════════════════════════════════════ */

/* 1. OmniMentor: Anticipatory AI Classroom OS (Cognitive Neural Topology) */
function EqualizerViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520]">
      {/* Background neural matrix */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(212,168,67,0.25) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* SVG Synaptic Network */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M 40,75 C 90,30 140,110 200,65 C 260,20 310,100 370,55"
          fill="none"
          stroke="rgba(212,168,67,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 40,75 C 100,120 160,40 220,85 C 280,130 330,50 370,55"
          fill="none"
          stroke="rgba(212,168,67,0.18)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Neural Cognitive Nodes */}
      <div className="absolute inset-x-5 top-7 flex items-center justify-between">
        {[
          { label: "OmniProfile", sub: "Learner State", delay: "0s" },
          { label: "OmniPredict", sub: "Concept Gap", delay: "0.6s" },
          { label: "OmniLoop", sub: "Adaptive Pace", delay: "1.2s" },
          { label: "OmniFlow", sub: "Context Synthesis", delay: "1.8s" },
        ].map((node, i) => (
          <div key={node.label} className="relative flex flex-col items-center">
            <div
              className="relative h-11 w-11 rounded-xl border border-[#d4a843]/40 bg-[#1a1813] flex items-center justify-center shadow-[0_0_15px_rgba(212,168,67,0.12)]"
              style={{
                animation: "synapticPulse 3s ease-in-out infinite",
                animationDelay: node.delay,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-[#d4a843]" />
              {/* Outer orbit ring */}
              <div
                className="absolute -inset-1 rounded-xl border border-[#d4a843]/20 animate-ping"
                style={{ animationDuration: "3.5s", animationDelay: node.delay }}
              />
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-medium text-[#f0ece4]">
              {node.label}
            </span>
            <span className="text-[8px] font-mono text-[#8a8a7a]">{node.sub}</span>
          </div>
        ))}
      </div>

      {/* Top telemetry bar */}
      <div className="absolute top-2.5 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a843] animate-pulse" />
        <span className="text-[9px] font-mono tracking-wider text-[#8a8a7a] uppercase">
          AI Classroom OS · Cognitive Topology
        </span>
      </div>
      <div className="absolute top-2.5 right-4 flex items-center gap-1.5">
        <span className="text-[9px] font-mono text-[#8fb573]">RETENTION 98.4%</span>
      </div>

      {/* Bottom live insight pill */}
      <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-between rounded-md border border-[#2a2a22] bg-[#141411]/90 px-3 py-1 text-[9px] font-mono text-[#8a8a7a]">
        <span className="flex items-center gap-1.5 text-[#d4a843]">
          <span>⚡</span>
          <span>Anticipatory explanation queued</span>
        </span>
        <span className="text-[#6a6a5e]">latency: 18ms</span>
      </div>
    </div>
  );
}

/* 2. ForgeFlow: Workflow Automation Engine (DAG Pipeline) */
function PipelineViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520]">
      {/* Circuit background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(123,138,236,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(123,138,236,0.2) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Animated SVG Pipeline Connectors */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line x1="18%" y1="52%" x2="38%" y2="52%" stroke="#7b8aec" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="44%" y1="52%" x2="64%" y2="52%" stroke="#7b8aec" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="70%" y1="52%" x2="88%" y2="52%" stroke="#7b8aec" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
      </svg>

      {/* DAG Stage Nodes */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pt-3">
        {[
          { code: "src.in", name: "Ingest", icon: "{ }", status: "ok" },
          { code: "ast.parse", name: "Synthesize", icon: "λ", status: "ok" },
          { code: "dag.flow", name: "Pipeline", icon: "⫽", status: "active" },
          { code: "dist.exec", name: "Worker", icon: ">>", status: "ok" },
        ].map((stage, idx) => (
          <div key={stage.code} className="relative flex flex-col items-center">
            <div
              className={`h-11 w-11 rounded-lg border flex flex-col items-center justify-center font-mono transition-all ${
                stage.status === "active"
                  ? "border-[#7b8aec] bg-[#1a1c2b] text-[#7b8aec] shadow-[0_0_16px_rgba(123,138,236,0.3)]"
                  : "border-[#2a2a35] bg-[#14151e] text-[#a0a5c0]"
              }`}
            >
              <span className="text-xs font-bold">{stage.icon}</span>
              <span className="text-[7px] text-[#7b8aec]/80 mt-0.5">{stage.status}</span>
            </div>
            <span className="mt-1.5 text-[9px] font-mono text-[#f0ece4]">{stage.name}</span>
            <span className="text-[8px] font-mono text-[#5f6380]">{stage.code}</span>
          </div>
        ))}
      </div>

      {/* Traveling Data Packet */}
      <div
        className="absolute top-[52%] left-[18%] h-2 w-3 rounded-full bg-[#7b8aec] shadow-[0_0_10px_#7b8aec] -translate-y-1/2"
        style={{ animation: "particleFlow 2.4s linear infinite" }}
      />

      {/* Header telemetry */}
      <div className="absolute top-2.5 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#7b8aec] animate-pulse" />
        <span className="text-[9px] font-mono tracking-wider text-[#8a8a7a] uppercase">
          Workflow Automation · Reproducible DAG
        </span>
      </div>
      <div className="absolute top-2.5 right-4 text-[9px] font-mono text-[#7b8aec]">
        QUEUE: 0 · 0ms DELAY
      </div>
    </div>
  );
}

/* 3. ARANYA: Geospatial Records & Forest Rights Act Intelligence */
function RadarViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520] flex items-center justify-center">
      {/* Topographic GIS grid & concentric range rings */}
      <div className="absolute h-32 w-32 rounded-full border border-[#8fb573]/15" />
      <div className="absolute h-24 w-24 rounded-full border border-[#8fb573]/20" />
      <div className="absolute h-16 w-16 rounded-full border border-dashed border-[#8fb573]/30" />
      <div className="absolute h-full w-[1px] bg-[#8fb573]/10" />
      <div className="absolute w-full h-[1px] bg-[#8fb573]/10" />

      {/* 360-degree rotating radar scan beam */}
      <div
        className="absolute h-36 w-36 rounded-full pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent 270deg, rgba(143,181,115,0.3) 360deg)",
          animation: "radarSpin 4.5s linear infinite",
        }}
      />

      {/* Pinging FRA parcels and land claims */}
      <div className="absolute left-[30%] top-[35%] flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8fb573] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8fb573] shadow-[0_0_8px_#8fb573]" />
        </span>
        <span className="rounded bg-[#141913]/90 border border-[#8fb573]/30 px-1 py-0.2 text-[8px] font-mono text-[#8fb573]">
          FRA Claim #1402
        </span>
      </div>

      <div className="absolute right-[24%] bottom-[32%] flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#d4a843] shadow-[0_0_8px_#d4a843]" />
        <span className="text-[8px] font-mono text-[#b5b0a1]">Chamoli Parcel #09</span>
      </div>

      {/* Telemetry bar */}
      <div className="absolute top-2.5 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8fb573] animate-pulse" />
        <span className="text-[9px] font-mono tracking-wider text-[#8a8a7a] uppercase">
          GIS Cadastre · Uttarakhand Spatial Intel
        </span>
      </div>
      <div className="absolute top-2.5 right-4 text-[9px] font-mono text-[#b5b0a1]">
        30.3165° N, 78.0322° E
      </div>

      {/* Verification footer */}
      <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-between text-[9px] font-mono text-[#6a6a5e]">
        <span>Historical Deed Provenance</span>
        <span className="text-[#8fb573]">Traceability: Verified</span>
      </div>
    </div>
  );
}

/* 4. ORVESS-PAT: Optical Rendezvous & Simulation Suite (ISRO SIH) */
function OpticalViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520] flex items-center justify-center">
      {/* Optical Sensor HUD Grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,121,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,121,65,0.3) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Concentric reticle rings */}
      <div className="absolute h-32 w-32 rounded-full border border-[#c87941]/20" />
      <div className="absolute h-20 w-20 rounded-full border border-[#c87941]/35" />
      <div
        className="absolute h-14 w-14 rounded-full border border-dashed border-[#c87941]/60"
        style={{ animation: "radarSpin 10s linear infinite" }}
      />

      {/* Crosshair ticks */}
      <div className="absolute h-full w-[1px] bg-[#c87941]/25" />
      <div className="absolute w-full h-[1px] bg-[#c87941]/25" />

      {/* Target Centroid Lock Box */}
      <div
        className="absolute h-7 w-7 border border-[#c87941] flex items-center justify-center shadow-[0_0_12px_rgba(200,121,65,0.4)]"
        style={{ animation: "orbitalPulse 2s ease-in-out infinite" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#c87941]" />
        <span className="absolute -top-1 -left-1 h-1.5 w-1.5 border-t border-l border-[#f0ece4]" />
        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 border-t border-r border-[#f0ece4]" />
        <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border-b border-l border-[#f0ece4]" />
        <span className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border-b border-r border-[#f0ece4]" />
      </div>

      {/* Telemetry labels */}
      <div className="absolute top-2.5 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c87941] animate-ping" />
        <span className="text-[9px] font-mono tracking-wider text-[#8a8a7a] uppercase">
          FPA Centroid Lock · ISRO SIH
        </span>
      </div>
      <div className="absolute top-2.5 right-4 text-[9px] font-mono text-[#c87941] font-bold">
        LOCKED · SNR 34.2 dB
      </div>

      {/* Bottom telemetry coords */}
      <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-between text-[9px] font-mono text-[#8a8a7a]">
        <span>Δx: 0.018px · Δy: 0.009px</span>
        <span>Sensor: 1024x1024 FPA</span>
      </div>
    </div>
  );
}

/* 5. Resume Screener: Inverted Index & BM25 Search Engine */
function SearchViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520] p-4 flex flex-col justify-between">
      {/* Search Query Terminal Box */}
      <div>
        <div className="flex items-center gap-2 rounded-lg border border-[#2a2a22] bg-[#141411] px-3 py-1.5">
          <span className="text-[10px] font-mono text-[#d4a843]">$</span>
          <span className="text-[11px] font-mono text-[#f0ece4]">
            search(&quot;distributed systems&quot;, k=3)
          </span>
          <span className="ml-auto h-3 w-1.5 bg-[#d4a843] animate-pulse" />
        </div>

        {/* Inverted Index Match Tokens */}
        <div className="mt-2 flex items-center gap-1.5 text-[8px] font-mono">
          <span className="text-[#6a6a5e]">POSTING LIST:</span>
          <span className="rounded bg-[#d4a843]/10 border border-[#d4a843]/30 px-1 py-0.5 text-[#d4a843]">
            #42 (w: 0.94)
          </span>
          <span className="rounded bg-[#d4a843]/10 border border-[#d4a843]/30 px-1 py-0.5 text-[#d4a843]">
            #88 (w: 0.81)
          </span>
          <span className="rounded bg-[#2a2a22] px-1 py-0.5 text-[#8a8a7a]">
            #103 (w: 0.62)
          </span>
        </div>
      </div>

      {/* Ranked Candidate Results with BM25 Score Meters */}
      <div className="space-y-1.5">
        {[
          { candidate: "Senior Distributed Eng", score: 94.6, color: "#d4a843" },
          { candidate: "Core Platform Architect", score: 82.1, color: "#c87941" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-[#f0ece4] w-36 truncate">
              {item.candidate}
            </span>
            <div className="flex-1 h-2 bg-[#1a1a16] rounded-full overflow-hidden border border-[#2a2a22]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${item.score}%`,
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                }}
              />
            </div>
            <span className="text-[9px] font-mono text-[#d4a843]">{item.score}%</span>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="flex items-center justify-between text-[8px] font-mono text-[#6a6a5e] pt-1 border-t border-[#22221c]">
        <span>1,420 resumes indexed · BM25</span>
        <span className="text-[#8fb573]">Query Latency: 0.38ms</span>
      </div>
    </div>
  );
}

/* 6. AutoHire: Distributed Event Pipeline (Apache Kafka & Zookeeper) */
function StreamViz() {
  return (
    <div className="relative h-40 w-full bg-[#10100e] overflow-hidden rounded-t-xl border-b border-[#252520] p-3 flex flex-col justify-between">
      {/* Telemetry header */}
      <div className="flex items-center justify-between text-[9px] font-mono">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8fb573] animate-pulse" />
          <span className="text-[#8a8a7a] uppercase tracking-wider">
            Kafka Stream Broker · 3 Partitions
          </span>
        </div>
        <span className="text-[#8fb573]">LAG: 0 MSGS</span>
      </div>

      {/* Event Stream Partitions */}
      <div className="space-y-1.5 my-1">
        {[
          { topic: "resumes.in", packets: [0, 1.2], color: "#8fb573" },
          { topic: "ai.scoring", packets: [0.5, 1.8], color: "#7b8aec" },
          { topic: "dispatch.out", packets: [0.9, 2.2], color: "#d4a843" },
        ].map((lane) => (
          <div key={lane.topic} className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-[#8a8a7a] w-18 truncate">
              {lane.topic}
            </span>
            <div className="relative flex-1 h-5 rounded border border-[#262620] bg-[#141411] overflow-hidden">
              {lane.packets.map((delay, i) => (
                <div
                  key={i}
                  className="absolute top-1 h-3 px-1.5 rounded text-[7px] font-mono flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: `${lane.color}25`,
                    color: lane.color,
                    borderColor: `${lane.color}50`,
                    borderWidth: 1,
                    animation: "particleFlow 2.8s linear infinite",
                    animationDelay: `${delay}s`,
                  }}
                >
                  evt
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono text-[#8fb573] w-7 text-right">
              ACK
            </span>
          </div>
        ))}
      </div>

      {/* Consumer Group Footer */}
      <div className="flex items-center justify-between text-[8px] font-mono text-[#6a6a5e] pt-1 border-t border-[#22221c]">
        <span>Consumers: 4 Active Workers</span>
        <span className="text-[#8fb573]">Cluster: Synced</span>
      </div>
    </div>
  );
}

/* Map visualizer types to their component */
const VISUALIZER_MAP: Record<string, React.ComponentType> = {
  equalizer: EqualizerViz,
  cognition: EqualizerViz,
  pipeline: PipelineViz,
  radar: RadarViz,
  optical: OpticalViz,
  search: SearchViz,
  stream: StreamViz,
};

/* Accent colors per visualizer */
const VIZ_ACCENTS: Record<string, string> = {
  equalizer: "#d4a843",
  cognition: "#d4a843",
  pipeline: "#7b8aec",
  radar: "#8fb573",
  optical: "#c87941",
  search: "#d4a843",
  stream: "#8fb573",
};

/* ═══════════════════════════════════════════════════════════
   FLAGSHIP SHOWCASE: GEHU CONNECT
   Interactive, mobile-first campus preview with Live Feed,
   Cloudflare R2 media pipeline simulation, and community hubs.
   ═══════════════════════════════════════════════════════════ */

function GehuConnectShowcase() {
  const [activeTab, setActiveTab] = useState<"feed" | "pipeline" | "channels">("feed");
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(42);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [isUploading, setIsUploading] = useState(false);

  const toggleUpvote = () => {
    sounds.playMinecraftPop();
    if (upvoted) {
      setUpvotes((v) => v - 1);
      setUpvoted(false);
    } else {
      setUpvotes((v) => v + 1);
      setUpvoted(true);
    }
  };

  const simulateUpload = () => {
    sounds.playMinecraftPop();
    setIsUploading(true);
    setUploadProgress(12);
    setTimeout(() => setUploadProgress(54), 140);
    setTimeout(() => setUploadProgress(88), 280);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
    }, 450);
  };

  return (
    <figure
      aria-label="GEHU Connect Interactive Preview"
      className="w-full rounded-2xl border border-[#2e2e28] bg-[#141411] p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden relative"
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#8fb573]/[0.08] blur-3xl" />

      {/* Top Device Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252520] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8fb573] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8fb573] shadow-[0_0_8px_#8fb573]" />
            </span>
            <span className="text-xs font-semibold text-[#f0ece4] tracking-tight">gehuconnect.in</span>
            <span className="rounded bg-[#8fb573]/10 border border-[#8fb573]/30 px-1.5 py-0.5 text-[9px] font-mono text-[#8fb573]">
              LIVE ALPHA
            </span>
          </div>
          <span className="text-[10px] text-[#8a8a7a] font-mono">Dehradun Campus</span>
        </div>

        {/* Interactive Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#1c1c18] p-1 border border-[#2a2a22] mb-4">
          <button
            type="button"
            onClick={() => {
              sounds.playMinecraftPop();
              setActiveTab("feed");
            }}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "feed"
                ? "bg-[#282822] text-[#f0ece4] shadow-sm border border-[#3e3e34]"
                : "text-[#8a8a7a] hover:text-[#b5b0a1] hover:bg-[#20201a]"
            }`}
            aria-label="Switch to Campus Feed tab"
            aria-pressed={activeTab === "feed"}
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#8fb573]" />
            <span>Feed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playMinecraftPop();
              setActiveTab("pipeline");
            }}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "pipeline"
                ? "bg-[#282822] text-[#f0ece4] shadow-sm border border-[#3e3e34]"
                : "text-[#8a8a7a] hover:text-[#b5b0a1] hover:bg-[#20201a]"
            }`}
            aria-label="Switch to R2 Pipeline tab"
            aria-pressed={activeTab === "pipeline"}
          >
            <CloudUpload className="h-3.5 w-3.5 text-[#d4a843]" />
            <span>R2 Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playMinecraftPop();
              setActiveTab("channels");
            }}
            className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "channels"
                ? "bg-[#282822] text-[#f0ece4] shadow-sm border border-[#3e3e34]"
                : "text-[#8a8a7a] hover:text-[#b5b0a1] hover:bg-[#20201a]"
            }`}
            aria-label="Switch to Campus Hub tab"
            aria-pressed={activeTab === "channels"}
          >
            <Users className="h-3.5 w-3.5 text-[#7b8aec]" />
            <span>Hub</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "feed" && (
          <div className="space-y-3">
            {/* Campus Post Card */}
            <div className="rounded-xl border border-[#2a2a22] bg-[#181814] p-3.5 sm:p-4 transition-colors">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8fb573]/30 to-[#d4a843]/30 text-[#8fb573] flex items-center justify-center text-xs font-bold border border-[#8fb573]/30 font-mono">
                    AN
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#f0ece4]">Aditya Nautiyal</span>
                      <CheckCircle2 className="h-3 w-3 text-[#8fb573]" />
                    </div>
                    <span className="text-[10px] text-[#8a8a7a] font-mono">B.Tech CSE '25 · Dehradun</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#6a6a5e] font-mono">12m ago</span>
              </div>

              <p className="text-xs text-[#c4c0b4] leading-relaxed">
                MUN Spring Conference delegate slots allocated for UNSC and DISEC. Country profile dossiers are available in the campus hub.
              </p>

              {/* R2 Media Bucket Teaser */}
              <div className="mt-3 rounded-lg border border-[#2f2f26] bg-[#12120f] p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded bg-[#8fb573]/10 text-[#8fb573] flex items-center justify-center text-xs">
                    📁
                  </span>
                  <div>
                    <div className="text-[11px] font-mono text-[#f0ece4]">delegation_brief_2026.pdf</div>
                    <div className="text-[9px] font-mono text-[#8a8a7a]">Cloudflare R2 Bucket · 0 Egress</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#8fb573]">2.4 MB · 28ms</span>
              </div>

              {/* Interactive Engagement Row */}
              <div className="mt-3.5 pt-3 border-t border-[#252520] flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleUpvote}
                  className={`min-h-[44px] px-3 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-all ${
                    upvoted
                      ? "border-[#8fb573] bg-[#8fb573]/15 text-[#8fb573] shadow-[0_0_12px_rgba(143,181,115,0.3)]"
                      : "border-[#2f2f26] bg-[#1d1d18] text-[#b5b0a1] hover:border-[#8fb573]/40 hover:text-[#f0ece4]"
                  }`}
                  aria-label="Upvote this campus update"
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${upvoted ? "fill-[#8fb573]" : ""}`} />
                  <span>▲ {upvotes}</span>
                </button>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#8a8a7a]">
                  <span className="flex items-center gap-1 text-[#b5b0a1]">
                    <MessageSquare className="h-3 w-3 text-[#6a6a5e]" />
                    <span>18 replies</span>
                  </span>
                  <span className="rounded bg-[#8fb573]/10 text-[#8fb573] px-1.5 py-0.5 text-[9px]">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-3">
            {/* Architecture Node Cards */}
            <div className="rounded-xl border border-[#2a2a22] bg-[#181814] p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8a7a]">
                <span>Cloudflare R2 Direct Pipeline</span>
                <span className="text-[#8fb573]">Active Zero-Egress</span>
              </div>

              {/* Step progression */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-[#12120f] border border-[#262620]">
                  <span className="text-[#b5b0a1]">1. React Native (Expo)</span>
                  <span className="text-[#8fb573]">Image Compress (WebP)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#12120f] border border-[#262620]">
                  <span className="text-[#b5b0a1]">2. Spring Boot Auth</span>
                  <span className="text-[#d4a843]">Signed Presigned URL</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#12120f] border border-[#262620]">
                  <span className="text-[#b5b0a1]">3. Cloudflare R2 Bucket</span>
                  <span className="text-[#7b8aec]">S3 Client · Zero Cost</span>
                </div>
              </div>

              {/* Live Upload Simulator */}
              <div className="pt-2 border-t border-[#252520]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#f0ece4] mb-1.5">
                  <span>test_media_upload.webp</span>
                  <span className="text-[#8fb573]">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-[#12120f] rounded-full overflow-hidden border border-[#2a2a22]">
                  <div
                    className="h-full bg-gradient-to-r from-[#8fb573] to-[#d4a843] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className="min-h-[44px] px-3.5 rounded-lg border border-[#3e3e32] bg-[#22221b] text-xs font-mono text-[#f0ece4] hover:bg-[#2c2c23] hover:border-[#8fb573]/50 transition-all cursor-pointer flex items-center gap-1.5"
                    aria-label="Simulate media upload via Cloudflare R2"
                  >
                    <CloudUpload className="h-3.5 w-3.5 text-[#8fb573]" />
                    <span>{isUploading ? "Uploading to R2..." : "Simulate Media Upload"}</span>
                  </button>
                  <span className="text-[10px] font-mono text-[#8a8a7a]">Latency: 28ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "channels" && (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#2a2a22] bg-[#181814] p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#8a8a7a] mb-1">
                <span>Campus Community Hubs</span>
                <span className="text-[#8fb573]">18 Active Clubs</span>
              </div>

              {[
                { tag: "#announcements", desc: "Official Graphic Era Updates", count: "480 students", color: "#8fb573" },
                { tag: "#mun-society", desc: "Spring Delegation Logistics", count: "142 members", color: "#d4a843" },
                { tag: "#gehu-devs", desc: "Open Source & Hackathon Teams", count: "210 members", color: "#7b8aec" },
                { tag: "#campus-buzz", desc: "Student Marketplace & Housing", count: "340 students", color: "#c87941" },
              ].map((c) => (
                <div
                  key={c.tag}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#12120f] border border-[#262620] hover:border-[#38382e] transition-colors"
                >
                  <div>
                    <span className="text-xs font-mono font-semibold" style={{ color: c.color }}>
                      {c.tag}
                    </span>
                    <p className="text-[10px] text-[#8a8a7a] font-mono">{c.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#6a6a5e]">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Telemetry */}
      <div className="mt-4 pt-3 border-t border-[#252520] flex flex-wrap items-center justify-between text-[10px] text-[#8a8a7a] font-mono gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#8fb573]" />
          <span>JWT Student Auth · Zero-Egress Storage</span>
        </span>
        <span className="text-[#f0ece4] font-medium">v0.4.2 Alpha</span>
      </div>
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const flagship = projects.find((p) => p.id === "gehu-connect") || projects[0];
  const otherProjects = projects.filter((p) => p.id !== "gehu-connect");
  const displayedProjects = expanded ? otherProjects : otherProjects.slice(0, 4);

  useEffect(() => {
    const handleNavigate = (e: CustomEvent<{ id: string }>) => {
      const targetId = e.detail?.id;
      setExpanded(true);
      if (targetId) {
        setHighlightedId(targetId);
        setTimeout(() => {
          const el = document.getElementById(`project-${targetId}`) || document.getElementById("projects");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
        setTimeout(() => setHighlightedId(null), 3500);
      }
    };
    window.addEventListener("navigate-to-project", handleNavigate as EventListener);
    return () => window.removeEventListener("navigate-to-project", handleNavigate as EventListener);
  }, []);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setExpanded(true);
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#0f0f0d] scroll-mt-24 border-t border-[#f0ece4]/[0.06]"
      aria-labelledby="projects-heading"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <header className="mb-14">
          <h2
            id="projects-heading"
            className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold tracking-tight text-[#f0ece4]"
          >
            Ideas that made it out of the notes app
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8a8a7a]">
            Some started as university projects, some started as &ldquo;wait, why does this not exist yet?&rdquo; I build them far enough to run into the real engineering problems.
          </p>
        </header>

        {/* ═══════════ Flagship: GEHU Connect ═══════════ */}
        <article
          id={`project-${flagship.id}`}
          itemScope
          itemType="https://schema.org/SoftwareApplication"
          className={`group relative mb-14 scroll-mt-28 rounded-2xl border border-[#f0ece4]/[0.08] bg-[#171714] overflow-hidden transition-all duration-500 ${
            highlightedId === flagship.id
              ? "ring-2 ring-[#d4a843] shadow-[0_0_40px_rgba(212,168,67,0.2)]"
              : "hover:border-[#f0ece4]/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
          }`}
        >
          {/* SEO Structured Microdata */}
          <meta itemProp="name" content="GEHU Connect" />
          <meta itemProp="operatingSystem" content="iOS, Android, React Native" />
          <meta itemProp="applicationCategory" content="SocialNetworkingApplication" />
          <meta itemProp="author" content="Parth Khansali" />
          <meta itemProp="url" content="https://gehuconnect.in" />
          <meta
            itemProp="description"
            content="Student community and networking platform built with React Native and Spring Boot for Graphic Era Hill University students."
          />

          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-[#d4a843]/[0.03] blur-[60px]" />
          <div className="h-[2px] w-full bg-gradient-to-r from-[#8fb573]/60 via-[#8fb573]/20 to-transparent" />

          <div className="grid gap-8 lg:grid-cols-12 items-stretch p-6 sm:p-9">
            <div className="lg:col-span-7 flex flex-col justify-between relative z-10">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8fb573]/30 bg-[#8fb573]/10 px-3 py-0.5 text-xs font-medium text-[#8fb573]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fb573] animate-pulse" />
                    Flagship · Live Alpha
                  </span>
                  <span className="text-xs text-[#6a6a5e]">Graphic Era Hill University</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#f0ece4]">
                  {flagship.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#d4a843]">{flagship.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#8a8a7a]">{flagship.description}</p>

                <div className="mt-5 space-y-2.5 border-l-2 border-[#d4a843]/20 pl-4 text-xs sm:text-[13px] text-[#b5b0a1]">
                  <div><span className="font-semibold text-[#f0ece4]">Stack:</span> React Native + Spring Boot backend, JWT student auth, community spaces.</div>
                  <div><span className="font-semibold text-[#f0ece4]">Media Pipeline:</span> Cloudflare R2 bucket with AWS S3-compatible client for zero-egress media storage.</div>
                  <div><span className="font-semibold text-[#f0ece4]">Current State:</span> In hands of active students at GEHU. Still fixing corner cases, which is the fun part.</div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-1.5">
                  {flagship.techStack.map((tech) => (
                    <span
                      key={tech}
                      onClick={() => sounds.playMinecraftPop()}
                      className="rounded-lg border border-[#333328] bg-[#1e1e1a] px-2.5 py-1 text-[11px] font-medium text-[#b5b0a1] hover:border-[#d4a843]/40 hover:text-[#d4a843] hover:bg-[#d4a843]/[0.06] transition-all cursor-pointer select-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#333328] pt-5">
                <a
                  href={flagship.links.demo || "https://gehuconnect.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playMinecraftPop()}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-lg bg-[#f0ece4] px-5 py-2.5 text-xs font-semibold text-[#0f0f0d] transition-all hover:bg-white active:scale-95 shadow-sm"
                  aria-label="Open GEHU Connect live application"
                >
                  <span>Open GEHU Connect</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {flagship.links.github && (
                  <a
                    href={flagship.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-[#333328] px-4 py-2.5 text-xs font-medium text-[#b5b0a1] transition-colors hover:border-[#555548] hover:text-[#f0ece4]"
                    aria-label="View GEHU Connect source code on GitHub"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Live Interactive Mobile App Preview */}
            <div className="lg:col-span-5 flex items-stretch">
              <GehuConnectShowcase />
            </div>
          </div>
        </article>

        {/* ═══════════ Project Grid ═══════════ */}
        <div className="grid gap-5 md:grid-cols-2">
          {displayedProjects.map((project, idx) => {
            const VizComponent = project.visualizer ? VISUALIZER_MAP[project.visualizer] : null;
            const accent = project.visualizer ? VIZ_ACCENTS[project.visualizer] || "#d4a843" : "#d4a843";

            return (
              <motion.article
                key={project.id}
                id={`project-${project.id}`}
                itemScope
                itemType="https://schema.org/SoftwareSourceCode"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group featured-project-card scroll-mt-28 rounded-xl border border-[#f0ece4]/[0.06] bg-[#171714] overflow-hidden transition-all duration-300 hover:border-[#f0ece4]/12 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] flex flex-col ${
                  highlightedId === project.id
                    ? "ring-2 ring-[#d4a843] shadow-[0_0_35px_rgba(212,168,67,0.2)]"
                    : ""
                }`}
              >
                {/* SEO Metadata for Project */}
                <meta itemProp="name" content={project.title} />
                <meta itemProp="programmingLanguage" content={project.techStack.join(", ")} />
                <meta itemProp="description" content={project.description} />

                {/* Hero visualizer area */}
                {VizComponent ? (
                  <VizComponent />
                ) : (
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
                )}

                {/* Content area */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#555548] uppercase">
                        {project.category}
                      </span>
                      {project.status && (
                        <span className="rounded-full border border-[#2a2a24] bg-[#1a1a16] px-2.5 py-0.5 text-[10px] font-mono text-[#6a6a5e]">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#f0ece4] group-hover:text-[#f5f1ea] transition-colors">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="mt-0.5 text-xs font-medium" style={{ color: accent }}>
                        {project.subtitle}
                      </p>
                    )}

                    <p className="mt-3 text-[13px] leading-relaxed text-[#8a8a7a]">
                      {project.description}
                    </p>

                    {project.bullets && project.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-xs text-[#b5b0a1]">
                        {project.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-[#2a2a24] bg-[#141412] px-2 py-0.5 text-[10px] font-mono text-[#555548] hover:text-[#8a8a7a] hover:border-[#333328] transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#2a2a24] pt-4">
                    <a
                      href={project.links.demo || project.links.github || "#"}
                      target={project.links.demo ? "_blank" : undefined}
                      rel={project.links.demo ? "noopener noreferrer" : undefined}
                      className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-[#f0ece4] transition-all hover:bg-[#f0ece4]/[0.06]"
                      aria-label={`${project.buttonText || "View project"} for ${project.title}`}
                    >
                      <span>{project.buttonText || "View project"}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#555548] transition-all hover:text-[#f0ece4] hover:bg-[#f0ece4]/[0.04]"
                        aria-label={`View source code for ${project.title} on GitHub`}
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Expand / Collapse */}
        {otherProjects.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleToggle}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border border-[#333328] px-6 py-2.5 text-xs font-medium text-[#b5b0a1] transition-all hover:border-[#555548] hover:text-[#f0ece4] hover:bg-[#f0ece4]/[0.03] cursor-pointer"
              aria-expanded={expanded}
              aria-label={expanded ? "Show fewer projects" : `Show all projects (${otherProjects.length})`}
            >
              {expanded ? (
                <>
                  <span>Show fewer projects</span>
                  <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <span>Show all projects ({otherProjects.length})</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


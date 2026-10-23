"use client";

import { useEffect, useRef, useState } from "react";
import { Radio, Send, SkipForward, UserCheck, ShieldAlert } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface OmePairProps {
  profile: VisitorProfile;
  isActive: boolean;
}

interface DirectMessage {
  id: string;
  isSelf: boolean;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
}

const STRANGER_POOL = [
  { name: "Doon Coder #14", avatar: "🐱", location: "Dehradun, India", intro: "Hey! Exploring Parth's systems projects." },
  { name: "Campus Explorer #09", avatar: "🦊", location: "Graphic Era Hill University", intro: "Yo! Checking out GEHU Connect." },
  { name: "Dev Nomad #42", avatar: "⚡", location: "Bengaluru, India", intro: "Hey there! Love the retro flash arcade." },
  { name: "Night Owl #88", avatar: "🦉", location: "Meerut, India", intro: "Midnight coding session here. Ready for Skribbl?" },
  { name: "Frontend Crafter", avatar: "🚀", location: "Delhi, India", intro: "Hey! The magnetic avatar is awesome." },
];

const QUICK_ICEBREAKERS = [
  "What stack do you code in?",
  "Have you tried Skribbl or Pong yet?",
  "Checking out Parth's AI projects?",
  "Late night coding from where?",
];

export default function OmePair({ profile, isActive }: OmePairProps) {
  const [status, setStatus] = useState<"idle" | "searching" | "connected">("idle");
  const [partner, setPartner] = useState<typeof STRANGER_POOL[0] | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputVal, setInputVal] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const startSearch = () => {
    setStatus("searching");
    setPartner(null);
    setMessages([]);
    sounds.playFocus();

    // 1.5s simulated match search
    setTimeout(() => {
      const match = STRANGER_POOL[Math.floor(Math.random() * STRANGER_POOL.length)];
      setPartner(match);
      setStatus("connected");
      sounds.playMinecraftLevelUp();

      // Partner greeting
      const greetMsg: DirectMessage = {
        id: `msg-${Date.now()}`,
        isSelf: false,
        senderName: match.name,
        senderAvatar: match.avatar,
        text: match.intro,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([greetMsg]);
    }, 1600);
  };

  const handleNext = () => {
    sounds.playMinecraftPop();
    startSearch();
  };

  const handleDisconnect = () => {
    setStatus("idle");
    setPartner(null);
    setMessages([]);
    sounds.playClick(300, 0.05);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || status !== "connected" || !partner) return;
    const selfMsg: DirectMessage = {
      id: `self-${Date.now()}`,
      isSelf: true,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, selfMsg]);
    setInputVal("");
    sounds.playChirp();

    // Simulated reply after 1.8s
    setTimeout(() => {
      const responses = [
        "That is awesome! Have you seen his OmniMentor anticipatory OS?",
        "Same here. His distributed Kafka pipeline architecture looks solid.",
        "Totally agree. Let's compete on the Latency Reflex leaderboard!",
        "Nice! The whole site has so much craft and passion built into it.",
      ];
      const botReply: DirectMessage = {
        id: `reply-${Date.now()}`,
        isSelf: false,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botReply]);
      sounds.playMinecraftPop();
    }, 1800);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[340px] sm:h-[370px] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#121210] border-b border-[#333328] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm">⚡</span>
          <span className="font-semibold text-[#f0ece4]">Live Pair Room (Ome.gg Style)</span>
        </div>

        {status === "connected" && partner && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#8fb573]/30 bg-[#8fb573]/10 text-[11px] text-[#8fb573]">
              <span className="h-2 w-2 rounded-full bg-[#8fb573] animate-pulse" />
              <span>Paired with {partner.name}</span>
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] text-[#0f0f0d] text-xs font-semibold cursor-pointer"
            >
              <SkipForward className="h-3 w-3" />
              <span>Next</span>
            </button>

            <button
              type="button"
              onClick={handleDisconnect}
              className="px-2 py-1 rounded-lg border border-[#333328] bg-[#171714] text-[11px] text-[#8a8a7a] hover:text-[#c87941]"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport */}
      {status === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#141412]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4a843]/15 text-[#d4a843] border border-[#d4a843]/30 text-2xl">
            ⚡
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#f0ece4]">
              Match With Another Live Visitor
            </h3>
            <p className="text-xs text-[#8a8a7a] max-w-sm mt-1 leading-relaxed">
              Connect 1-on-1 with visitors exploring the site right now. Chat about tech, share notes, or duel in Skribbl.
            </p>
          </div>
          <button
            type="button"
            onClick={startSearch}
            className="inline-flex items-center gap-2 rounded-xl bg-[#d4a843] hover:bg-[#e0b44f] px-5 py-2.5 text-xs font-semibold text-[#0f0f0d] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Find Next Live Stranger</span>
          </button>
        </div>
      )}

      {status === "searching" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#141412]">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fb573] opacity-50" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#8fb573]/20 border border-[#8fb573] text-[#8fb573]">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#f0ece4]">
              Scanning Active Visitor Pool...
            </h3>
            <p className="text-xs text-[#8a8a7a] mt-1">
              Matching with someone exploring projects right now.
            </p>
          </div>
        </div>
      )}

      {status === "connected" && partner && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#141412]">
          {/* Messages Feed */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${m.isSelf ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#333328] bg-[#1e1e1a] text-xs flex-shrink-0">
                  {m.senderAvatar}
                </div>
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                    m.isSelf
                      ? "bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#f0ece4]"
                      : "bg-[#1e1e1a] border border-[#333328] text-[#f0ece4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold text-[#8a8a7a]">
                      {m.senderName}
                    </span>
                    <span className="text-[9px] text-[#6b6b5c]">{m.time}</span>
                  </div>
                  <p className="leading-relaxed break-words">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Icebreaker pills */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121210] border-t border-[#333328] overflow-x-auto">
            <span className="text-[10px] text-[#6b6b5c] uppercase font-mono mr-1">Ask:</span>
            {QUICK_ICEBREAKERS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="px-2.5 py-0.5 rounded-lg border border-[#333328] bg-[#171714] hover:border-[#d4a843]/40 text-[11px] text-[#c5c2b8] whitespace-nowrap cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputVal);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#171714] border-t border-[#333328]"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Message ${partner.name}...`}
              className="flex-1 bg-[#121210] border border-[#333328] rounded-lg px-3 py-1.5 text-xs text-[#f0ece4] placeholder-[#6b6b5c] outline-none focus:border-[#d4a843]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="flex items-center justify-center h-8 px-3 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] disabled:opacity-40 text-[#0f0f0d] text-xs font-semibold cursor-pointer transition-all"
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Users, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundFx";
import { VisitorProfile } from "./types";

interface LoungeMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  type: "chat" | "reaction" | "score";
  timestamp: number;
}

interface LoungeVisitor {
  id: string;
  name: string;
  avatar: string;
  activity: string;
}

interface LoungeChatProps {
  profile: VisitorProfile;
  isActive: boolean;
}

const QUICK_REACTIONS = [
  { emoji: "👋", label: "Wave", text: "waved to all visitors hanging out in the lounge." },
  { emoji: "🔥", label: "Hype", text: "is hyped about Parth's engineering work!" },
  { emoji: "🏆", label: "GG", text: "Good game, great runs everyone!" },
  { emoji: "🚀", label: "Compete", text: "challenged everyone to beat their arcade high score!" },
];

export default function LoungeChat({ profile, isActive }: LoungeChatProps) {
  const [messages, setMessages] = useState<LoungeMessage[]>([]);
  const [visitors, setVisitors] = useState<LoungeVisitor[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isSending, setIsSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchRoomData = async () => {
    try {
      const res = await fetch("/api/lounge");
      if (res.ok) {
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
        if (data.visitors) setVisitors(data.visitors);
      }
    } catch {}
  };

  useEffect(() => {
    fetchRoomData();
    const interval = setInterval(fetchRoomData, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string, type: "chat" | "reaction" = "chat") => {
    if (!text.trim() || isSending) return;
    setIsSending(true);

    const optimisticMsg: LoungeMessage = {
      id: `local-${Date.now()}`,
      sender: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
      },
      text: text.trim(),
      type,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputVal("");
    sounds.playChirp();

    try {
      await fetch("/api/lounge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "message",
          sender: {
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
          },
          text: text.trim(),
          type,
        }),
      });
      fetchRoomData();
    } catch {} finally {
      setIsSending(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[340px] sm:h-[370px]">
      {/* Active Room Visitors Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#121210] border-b border-[#333328] text-xs">
        <div className="flex items-center gap-2 text-[#8a8a7a]">
          <Users className="h-3.5 w-3.5 text-[#8fb573]" />
          <span>In the Room ({Math.max(1, visitors.length)}):</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px]">
          {visitors.map((v) => (
            <span
              key={v.id}
              title={`${v.name} · ${v.activity}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#333328] bg-[#1a1a16] text-[11px] text-[#f0ece4]"
            >
              <span>{v.avatar}</span>
              <span className="truncate max-w-[80px]">{v.name}</span>
            </span>
          ))}
          {visitors.length === 0 && (
            <span className="text-[11px] text-[#8a8a7a] flex items-center gap-1">
              <span>{profile.avatar}</span>
              <span>{profile.name} (You)</span>
            </span>
          )}
        </div>
      </div>

      {/* Message Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#141412]"
      >
        {messages.map((msg) => {
          const isSelf = msg.sender.id === profile.id;
          const isReaction = msg.type === "reaction";
          const isScore = msg.type === "score";

          if (isReaction || isScore) {
            return (
              <div
                key={msg.id}
                className="flex items-center justify-center py-1 text-center"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#333328] bg-[#1a1a16] text-xs text-[#c5c2b8]">
                  <span>{msg.sender.avatar}</span>
                  <span className="font-semibold text-[#f0ece4]">{msg.sender.name}</span>
                  <span className={isScore ? "text-[#d4a843]" : "text-[#8a8a7a]"}>
                    {msg.text}
                  </span>
                  <span className="text-[10px] text-[#6b6b5c] ml-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isSelf ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#333328] bg-[#1e1e1a] text-sm flex-shrink-0">
                {msg.sender.avatar}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                isSelf
                  ? "bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#f0ece4]"
                  : "bg-[#1e1e1a] border border-[#333328] text-[#f0ece4]"
              }`}>
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <span className={`text-[10px] font-semibold ${isSelf ? "text-[#d4a843]" : "text-[#8a8a7a]"}`}>
                    {msg.sender.name}
                  </span>
                  <span className="text-[9px] text-[#6b6b5c]">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="leading-relaxed break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reactions Bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#121210] border-t border-[#333328] overflow-x-auto">
        <span className="text-[10px] text-[#6b6b5c] uppercase font-mono mr-1">Shouts:</span>
        {QUICK_REACTIONS.map((qr) => (
          <button
            key={qr.label}
            type="button"
            onClick={() => sendMessage(qr.text, "reaction")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#333328] bg-[#171714] hover:border-[#d4a843]/40 hover:bg-[#d4a843]/10 text-xs text-[#c5c2b8] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{qr.emoji}</span>
            <span>{qr.label}</span>
          </button>
        ))}
      </div>

      {/* Text Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputVal);
        }}
        className="flex items-center gap-2 px-3 py-2.5 bg-[#171714] border-t border-[#333328]"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Chat as ${profile.name}...`}
          maxLength={180}
          className="flex-1 bg-[#121210] border border-[#333328] rounded-lg px-3 py-1.5 text-xs text-[#f0ece4] placeholder-[#6b6b5c] outline-none focus:border-[#d4a843]/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isSending}
          className="flex items-center justify-center h-8 px-3 rounded-lg bg-[#d4a843] hover:bg-[#e0b44f] disabled:opacity-40 text-[#0f0f0d] text-xs font-semibold transition-all cursor-pointer"
        >
          <Send className="h-3.5 w-3.5 mr-1" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}

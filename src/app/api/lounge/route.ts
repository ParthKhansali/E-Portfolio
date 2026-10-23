import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface LoungeMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  type: "chat" | "reaction" | "score" | "skribbl";
  timestamp: number;
}

import { LeaderboardEntry } from "@/components/effects/lounge/types";
export type { LeaderboardEntry };

interface LoungeVisitor {
  id: string;
  name: string;
  avatar: string;
  activity: string;
  lastSeen: number;
}

export interface SkribblStroke {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  size: number;
}

export interface SkribblState {
  word: string;
  hint: string;
  drawer: {
    id: string;
    name: string;
    avatar: string;
  };
  strokes: SkribblStroke[];
  roundId: number;
  startedAt: number;
}

interface LoungeRoomState {
  messages: LoungeMessage[];
  leaderboards: Record<string, LeaderboardEntry[]>;
  visitors: Map<string, LoungeVisitor>;
  skribbl: SkribblState;
}

const SKRIBBL_WORDS = [
  "Creeper",
  "Diamond Sword",
  "Next.js",
  "Terminal",
  "Redstone",
  "Kafka",
  "Coffee Cup",
  "Docker",
  "Python",
  "Keyboard",
  "Database",
  "Rocket",
];

function maskWord(word: string): string {
  return word
    .split("")
    .map((c) => (c === " " || c === "." || c === "-" ? c : "_"))
    .join(" ");
}

// Global in-memory storage to survive hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __pkLoungeRoom: LoungeRoomState | undefined;
}

function getRoomState(): LoungeRoomState {
  if (!globalThis.__pkLoungeRoom) {
    const initialWord = SKRIBBL_WORDS[Math.floor(Math.random() * SKRIBBL_WORDS.length)];
    globalThis.__pkLoungeRoom = {
      messages: [
        {
          id: "welcome-1",
          sender: { id: "parth", name: "Parth Khansali", avatar: "☕" },
          text: "Welcome to the Late Night Lounge. Join Skribbl.io draw & guess, or duel in retro flash games!",
          type: "chat",
          timestamp: Date.now() - 1000 * 60 * 30,
        },
      ],
      leaderboards: {
        skribbl: [
          { id: "1", player: "Parth Khansali", avatar: "☕", score: 620, date: "Today", game: "skribbl" },
          { id: "2", player: "PixelArtist", avatar: "🦊", score: 450, date: "Today", game: "skribbl" },
          { id: "3", player: "DoonDoodler", avatar: "🎨", score: 300, date: "Yesterday", game: "skribbl" },
        ],
        runner: [
          { id: "1", player: "Parth Khansali", avatar: "☕", score: 2450, date: "Today", game: "runner" },
          { id: "2", player: "Doon Explorer #07", avatar: "🦊", score: 1820, date: "Today", game: "runner" },
        ],
        snake: [
          { id: "1", player: "Parth Khansali", avatar: "☕", score: 38, date: "Today", game: "snake" },
          { id: "2", player: "BugSquasher", avatar: "👾", score: 29, date: "Yesterday", game: "snake" },
        ],
        pong: [
          { id: "1", player: "PaddleMaster", avatar: "🎮", score: 5, date: "Today", game: "pong" },
        ],
        reflex: [
          { id: "1", player: "Parth Khansali", avatar: "☕", score: 184, date: "Today", game: "reflex" },
          { id: "2", player: "QuantumPing", avatar: "🚀", score: 206, date: "Today", game: "reflex" },
        ],
      },
      visitors: new Map<string, LoungeVisitor>(),
      skribbl: {
        word: initialWord,
        hint: maskWord(initialWord),
        drawer: { id: "parth", name: "Parth Khansali", avatar: "☕" },
        strokes: [],
        roundId: 1,
        startedAt: Date.now(),
      },
    };
  }
  return globalThis.__pkLoungeRoom;
}

function cleanupVisitors(visitors: Map<string, LoungeVisitor>) {
  const threshold = Date.now() - 60000;
  for (const [id, v] of visitors.entries()) {
    if (v.lastSeen < threshold) {
      visitors.delete(id);
    }
  }
}

export async function GET() {
  const room = getRoomState();
  cleanupVisitors(room.visitors);

  return NextResponse.json({
    success: true,
    messages: room.messages.slice(-50),
    leaderboards: room.leaderboards,
    visitors: Array.from(room.visitors.values()),
    skribbl: {
      hint: room.skribbl.hint,
      drawer: room.skribbl.drawer,
      strokes: room.skribbl.strokes,
      roundId: room.skribbl.roundId,
      startedAt: room.skribbl.startedAt,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const room = getRoomState();
    const body = await req.json();
    const { action, sender, text, type, game, score, strokes, guess } = body;

    // 1. Post a new chat or reaction message
    if (action === "message") {
      if (!text || !sender) {
        return NextResponse.json({ success: false, error: "Missing text or sender" }, { status: 400 });
      }

      const newMsg: LoungeMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: {
          id: sender.id || "guest",
          name: sender.name || "Anonymous Guest",
          avatar: sender.avatar || "🐱",
        },
        text: String(text).slice(0, 200),
        type: type || "chat",
        timestamp: Date.now(),
      };

      room.messages.push(newMsg);
      if (room.messages.length > 80) room.messages.shift();

      return NextResponse.json({ success: true, message: newMsg });
    }

    // 2. Register/Update visitor heartbeat
    if (action === "heartbeat") {
      if (sender && sender.id) {
        room.visitors.set(sender.id, {
          id: sender.id,
          name: sender.name || "Visitor",
          avatar: sender.avatar || "🐱",
          activity: sender.activity || "Chilling in Lounge",
          lastSeen: Date.now(),
        });
      }
      cleanupVisitors(room.visitors);
      return NextResponse.json({
        success: true,
        visitors: Array.from(room.visitors.values()),
      });
    }

    // 3. Post a game score to the leaderboard
    if (action === "score") {
      if (!game || score === undefined || !sender) {
        return NextResponse.json({ success: false, error: "Missing game, score or sender" }, { status: 400 });
      }

      if (!room.leaderboards[game]) {
        room.leaderboards[game] = [];
      }

      const newEntry: LeaderboardEntry = {
        id: `score-${Date.now()}`,
        player: sender.name || "Guest",
        avatar: sender.avatar || "☕",
        score: Number(score),
        date: "Just now",
        game,
      };

      room.leaderboards[game].push(newEntry);
      if (game === "reflex") {
        room.leaderboards[game].sort((a, b) => a.score - b.score);
      } else {
        room.leaderboards[game].sort((a, b) => b.score - a.score);
      }
      room.leaderboards[game] = room.leaderboards[game].slice(0, 10);

      const gameNames: Record<string, string> = {
        runner: "Foothills Dash",
        snake: "Code Snake",
        pong: "Pixel Pong",
        reflex: "Latency Reflex",
        skribbl: "Skribbl.io",
      };
      const scoreUnit = game === "reflex" ? "ms" : "pts";

      const announcementMsg: LoungeMessage = {
        id: `msg-score-${Date.now()}`,
        sender: {
          id: sender.id || "guest",
          name: sender.name || "Guest",
          avatar: sender.avatar || "🏆",
        },
        text: `scored ${score} ${scoreUnit} in ${gameNames[game] || game}!`,
        type: "score",
        timestamp: Date.now(),
      };
      room.messages.push(announcementMsg);

      return NextResponse.json({
        success: true,
        leaderboards: room.leaderboards,
      });
    }

    // 4. Skribbl: Broadcast strokes
    if (action === "skribbl_stroke") {
      if (Array.isArray(strokes)) {
        room.skribbl.strokes.push(...strokes);
        if (room.skribbl.strokes.length > 5000) {
          room.skribbl.strokes = room.skribbl.strokes.slice(-5000);
        }
      }
      return NextResponse.json({ success: true, count: room.skribbl.strokes.length });
    }

    // 5. Skribbl: Clear Canvas
    if (action === "skribbl_clear") {
      room.skribbl.strokes = [];
      return NextResponse.json({ success: true });
    }

    // 6. Skribbl: Guess Word
    if (action === "skribbl_guess") {
      const cleanGuess = String(guess || "").trim().toLowerCase();
      const currentWord = room.skribbl.word.toLowerCase();

      if (cleanGuess === currentWord) {
        // Correct guess!
        const winningPlayer = sender?.name || "Visitor";
        const points = 150;

        const guessMsg: LoungeMessage = {
          id: `msg-skribbl-${Date.now()}`,
          sender: {
            id: sender?.id || "guest",
            name: winningPlayer,
            avatar: sender?.avatar || "🎨",
          },
          text: `🎉 GUESSED THE WORD: ${room.skribbl.word.toUpperCase()}! (+${points} pts)`,
          type: "skribbl",
          timestamp: Date.now(),
        };
        room.messages.push(guessMsg);

        // Update skribbl leaderboard
        if (!room.leaderboards.skribbl) room.leaderboards.skribbl = [];
        room.leaderboards.skribbl.push({
          id: `skribbl-${Date.now()}`,
          player: winningPlayer,
          avatar: sender?.avatar || "🎨",
          score: points,
          date: "Just now",
          game: "skribbl",
        });
        room.leaderboards.skribbl.sort((a, b) => b.score - a.score);
        room.leaderboards.skribbl = room.leaderboards.skribbl.slice(0, 10);

        // Advance to next round
        const nextWord = SKRIBBL_WORDS[Math.floor(Math.random() * SKRIBBL_WORDS.length)];
        room.skribbl = {
          word: nextWord,
          hint: maskWord(nextWord),
          drawer: {
            id: sender?.id || "guest",
            name: winningPlayer,
            avatar: sender?.avatar || "🎨",
          },
          strokes: [],
          roundId: room.skribbl.roundId + 1,
          startedAt: Date.now(),
        };

        return NextResponse.json({
          success: true,
          correct: true,
          word: currentWord,
          nextDrawer: winningPlayer,
          hint: room.skribbl.hint,
        });
      }

      // Incorrect guess, post as chat
      const chatMsg: LoungeMessage = {
        id: `msg-${Date.now()}`,
        sender: {
          id: sender?.id || "guest",
          name: sender?.name || "Visitor",
          avatar: sender?.avatar || "🐱",
        },
        text: `Guess: ${guess}`,
        type: "chat",
        timestamp: Date.now(),
      };
      room.messages.push(chatMsg);

      return NextResponse.json({ success: true, correct: false });
    }

    // 7. Skribbl: Start new round
    if (action === "skribbl_new_round") {
      const nextWord = SKRIBBL_WORDS[Math.floor(Math.random() * SKRIBBL_WORDS.length)];
      room.skribbl = {
        word: nextWord,
        hint: maskWord(nextWord),
        drawer: {
          id: sender?.id || "guest",
          name: sender?.name || "Visitor",
          avatar: sender?.avatar || "🎨",
        },
        strokes: [],
        roundId: room.skribbl.roundId + 1,
        startedAt: Date.now(),
      };
      return NextResponse.json({
        success: true,
        word: nextWord,
        hint: room.skribbl.hint,
        drawer: room.skribbl.drawer,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

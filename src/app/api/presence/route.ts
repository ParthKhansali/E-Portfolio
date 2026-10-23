import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ViewerSession {
  id: string;
  location: string;
  flagEmoji?: string;
  name?: string;
  avatar?: string;
  lastSeen: number;
}

// In-memory sliding-window store for concurrent visitors
// Attached to globalThis to preserve state across dev server hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __pkPresenceSessions: Map<string, ViewerSession> | undefined;
}

const sessions: Map<string, ViewerSession> =
  globalThis.__pkPresenceSessions || new Map<string, ViewerSession>();
globalThis.__pkPresenceSessions = sessions;

const WINDOW_MS = 45000; // 45 seconds activity window

function cleanup() {
  const threshold = Date.now() - WINDOW_MS;
  for (const [id, session] of sessions.entries()) {
    if (session.lastSeen < threshold) {
      sessions.delete(id);
    }
  }
}

export async function GET() {
  cleanup();
  const viewers = Array.from(sessions.values());
  return NextResponse.json({
    success: true,
    count: Math.max(1, viewers.length),
    viewers,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, location, flagEmoji, name, avatar } = body;

    if (sessionId) {
      sessions.set(sessionId, {
        id: sessionId,
        location: location || "Dehradun, India",
        flagEmoji: flagEmoji || "🇮🇳",
        name: name || "Anonymous Explorer",
        avatar: avatar || undefined,
        lastSeen: Date.now(),
      });
    }

    cleanup();
    const viewers = Array.from(sessions.values());

    return NextResponse.json({
      success: true,
      count: Math.max(1, viewers.length),
      viewers,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (sessionId) {
    sessions.delete(sessionId);
  }
  cleanup();
  return NextResponse.json({
    success: true,
    count: Math.max(1, sessions.size),
  });
}

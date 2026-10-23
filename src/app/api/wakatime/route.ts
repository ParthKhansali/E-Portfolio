import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: true,
      configured: false,
      isCoding: false,
      message: "WakaTime API key not configured in .env.local",
      todayHours: "0m",
      weekHours: "0m",
      dailyAvg: "0m",
      languages: [
        { name: "TypeScript", percent: 45, color: "#4361ee" },
        { name: "Python", percent: 30, color: "#7209b7" },
        { name: "Java", percent: 15, color: "#06d6a0" },
        { name: "SQL", percent: 10, color: "#f5c451" },
      ],
    });
  }

  try {
    const statsRes = await fetch(
      `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${apiKey}`,
      { cache: "no-store" }
    );

    if (!statsRes.ok) {
      throw new Error(`WakaTime API returned ${statsRes.status}`);
    }

    const json = await statsRes.json();
    const data = json.data;

    // Check if user is coding right now (heartbeat in last 15 minutes)
    let isCoding = false;
    let currentProject: string | null = null;
    let currentLanguage: string | null = null;

    try {
      const todayDate = new Date().toISOString().split("T")[0];
      const heartRes = await fetch(
        `https://wakatime.com/api/v1/users/current/heartbeats?date=${todayDate}&api_key=${apiKey}`,
        { cache: "no-store" }
      );
      if (heartRes.ok) {
        const heartJson = await heartRes.json();
        const beats = heartJson.data || [];
        if (beats.length > 0) {
          const lastBeat = beats[beats.length - 1];
          const diffMinutes = (Date.now() - lastBeat.time * 1000) / (1000 * 60);
          if (diffMinutes <= 15) {
            isCoding = true;
            currentProject = lastBeat.project || null;
            currentLanguage = lastBeat.language || null;
          }
        }
      }
    } catch {
      // Heartbeat check is optional
    }

    const PALETTE = ["#4361ee", "#06d6a0", "#7209b7", "#f5c451", "#ff6b6b"];

    return NextResponse.json({
      success: true,
      configured: true,
      isCoding,
      currentProject,
      currentLanguage,
      todayHours: data.human_readable_daily_average || "0m",
      weekHours: data.human_readable_total || "0m",
      dailyAvg: data.human_readable_daily_average || "0m",
      languages: (data.languages || []).slice(0, 5).map((l: { name: string; percent: number }, i: number) => ({
        name: l.name,
        percent: Math.round(l.percent),
        color: PALETTE[i % PALETTE.length],
      })),
      projects: (data.projects || []).slice(0, 4).map((p: { name: string; percent: number }) => ({
        name: p.name,
        percent: Math.round(p.percent),
      })),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("WakaTime fetch error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch WakaTime metrics",
      },
      { status: 500 }
    );
  }
}

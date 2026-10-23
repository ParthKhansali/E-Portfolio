import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return new NextResponse(`Spotify authorization failed: ${error || "No code provided"}`, {
      status: 400,
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local", {
      status: 500,
    });
  }

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/spotify/callback`;

  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(`Token exchange error: ${errText}`, { status: res.status });
    }

    const data = await res.json();
    const refreshToken = data.refresh_token;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Spotify Token Generated</title>
        <style>
          body { font-family: monospace; background: #050505; color: #e8e8e8; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; }
          .card { background: #0e0e11; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; max-width: 620px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
          h2 { color: #1DB954; margin-top: 0; }
          code { background: #18181f; padding: 0.8rem 1rem; border-radius: 8px; display: block; word-break: break-all; border: 1px solid rgba(255,255,255,0.06); color: #fff; margin: 1rem 0; }
          button { background: #1DB954; color: #000; border: none; padding: 0.7rem 1.4rem; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: inherit; }
          button:hover { background: #1ed760; }
          p { color: #888; font-size: 13px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Spotify Authorization Successful!</h2>
          <p>Copy this Refresh Token and paste it into your <code>.env.local</code> file:</p>
          <code id="tok">${refreshToken}</code>
          <button onclick="navigator.clipboard.writeText('${refreshToken}'); this.textContent='Copied!';">Copy Refresh Token</button>
          <p style="margin-top: 1.5rem;">After adding <code>SPOTIFY_REFRESH_TOKEN=${refreshToken}</code> to your <code>.env.local</code>, restart your Next.js server with <code>npm run dev</code>.</p>
          <p><a href="/" style="color: #4361ee;">← Return to Portfolio</a></p>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    return new NextResponse(`Unexpected error: ${String(err)}`, { status: 500 });
  }
}

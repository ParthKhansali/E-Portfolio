import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  if (!clientId) {
    return new NextResponse(
      "Missing SPOTIFY_CLIENT_ID in .env.local. Add your Spotify Client ID from developer.spotify.com/dashboard first.",
      { status: 400 }
    );
  }

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/spotify/callback`;

  const scope = "user-read-currently-playing user-read-recently-played";
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

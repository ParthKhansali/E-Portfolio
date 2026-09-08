import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    success: true,
    location: {
      city: "Dehradun",
      country: "India",
      countryCode: "IN",
      flagEmoji: "🇮🇳",
      formatted: "Dehradun, India",
    },
  });
}

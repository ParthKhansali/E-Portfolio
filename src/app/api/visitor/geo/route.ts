import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Client IP lookup via ip-api.com (high accuracy for Indian telecom circles like Dehradun)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "";
    const isPublicIp = ip && ip !== "127.0.0.1" && ip !== "::1" && !ip.startsWith("192.168.") && !ip.startsWith("10.");

    try {
      const targetUrl = isPublicIp ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json/";
      const geoRes = await fetch(targetUrl, { cache: "no-store" });
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data.status === "success" && data.city) {
          const flag = getFlagEmoji(data.countryCode || "IN");
          return NextResponse.json({
            success: true,
            source: "ip-api",
            location: {
              city: data.city,
              region: data.regionName || "",
              country: data.country || "India",
              countryCode: data.countryCode || "IN",
              flagEmoji: flag,
              formatted: `${data.city}, ${data.country || "India"}`,
            },
          });
        }
      }
    } catch (e) {
      console.warn("ip-api lookup error, falling back:", e);
    }

    // 2. Fallback to edge platform headers if present
    const vercelCity = req.headers.get("x-vercel-ip-city");
    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const vercelRegion = req.headers.get("x-vercel-ip-country-region");
    const cfCity = req.headers.get("cf-ipcity");
    const cfCountry = req.headers.get("cf-ipcountry");

    const city = vercelCity || cfCity;
    const countryCode = vercelCountry || cfCountry;

    if (city && countryCode) {
      const decodedCity = decodeURIComponent(city);
      const flagEmoji = getFlagEmoji(countryCode);
      return NextResponse.json({
        success: true,
        source: "edge_headers",
        location: {
          city: decodedCity,
          region: vercelRegion || "",
          country: countryCode,
          countryCode,
          flagEmoji,
          formatted: `${decodedCity}, ${countryCode}`,
        },
      });
    }

    // 3. Fallback to ipwho.is if needed
    try {
      const fallbackUrl = isPublicIp ? `https://ipwho.is/${ip}` : "https://ipwho.is/";
      const fallbackRes = await fetch(fallbackUrl, { cache: "no-store" });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.success && data.city) {
          const flag = data.flag?.emoji || getFlagEmoji(data.country_code);
          return NextResponse.json({
            success: true,
            source: "ipwho",
            location: {
              city: data.city,
              region: data.region || "",
              country: data.country || "Earth",
              countryCode: data.country_code || "UN",
              flagEmoji: flag,
              formatted: `${data.city}, ${data.country}`,
            },
          });
        }
      }
    } catch {}

    // 4. Final graceful fallback
    return NextResponse.json({
      success: true,
      source: "fallback",
      location: {
        city: "Earth",
        country: "Global",
        countryCode: "UN",
        flagEmoji: "🌍",
        formatted: "Earth",
      },
    });
  } catch (err) {
    console.error("Geo API route error:", err);
    return NextResponse.json({
      success: false,
      location: {
        city: "Earth",
        country: "Global",
        countryCode: "UN",
        flagEmoji: "🌍",
        formatted: "Earth",
      },
    });
  }
}

function getFlagEmoji(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

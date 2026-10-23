/**
 * Client-side visitor geolocation utility
 * Queries internal Next.js /api/visitor/geo (using Vercel Edge IP headers)
 * with graceful direct fallback to ipwho.is
 */

export interface VisitorLocation {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  flagEmoji?: string;
  formatted: string;
}

export async function getVisitorLocation(): Promise<VisitorLocation | null> {
  if (typeof window === "undefined") return null;

  // 1. Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem("pk_visitor_geo_v3");
    if (cached) {
      const parsed = JSON.parse(cached) as VisitorLocation;
      if (parsed && parsed.formatted && !parsed.formatted.toLowerCase().includes("khurja")) {
        return parsed;
      }
    }
  } catch {
    // sessionStorage blocked or unavailable
  }

  // 2. Primary: Query our internal /api/visitor/geo endpoint
  try {
    const res = await fetch("/api/visitor/geo", {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.location) {
        const location: VisitorLocation = data.location;
        try {
          sessionStorage.setItem("pk_visitor_geo_v3", JSON.stringify(location));
        } catch {}
        return location;
      }
    }
  } catch (err) {
    console.debug("Internal geo route fetch failed, trying direct client lookup:", err);
  }

  // 3. Fallback: Direct client-side lookup via ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://ipwho.is/", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const city = data.city || data.region || "Earth";
        const country = data.country || "Earth";
        const flagEmoji = data.flag?.emoji || "🌍";
        const formatted = data.city ? `${data.city}, ${data.country}` : country;

        const location: VisitorLocation = {
          city,
          region: data.region,
          country,
          countryCode: data.country_code,
          flagEmoji,
          formatted,
        };

        try {
          sessionStorage.setItem("pk_visitor_geo", JSON.stringify(location));
        } catch {}

        return location;
      }
    }
  } catch (err) {
    console.debug("Client IP geolocation fallback failed:", err);
  }

  // 4. Default generic location
  const defaultLoc: VisitorLocation = {
    city: "Earth",
    country: "Global",
    countryCode: "UN",
    flagEmoji: "🌍",
    formatted: "Earth",
  };
  return defaultLoc;
}

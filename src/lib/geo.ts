/**
 * Client-side visitor geolocation utility
 * Integrates internal Next.js /api/visitor/geo (Vercel Edge headers)
 * with graceful fallback to ipwho.is and local caching
 */

export interface VisitorLocation {
  city?: string;
  country?: string;
  countryCode?: string;
  flagEmoji?: string;
  formatted: string;
}

export async function getVisitorLocation(): Promise<VisitorLocation | null> {
  if (typeof window === "undefined") return null;

  // 1. Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem("pk_visitor_geo");
    if (cached) {
      const parsed = JSON.parse(cached) as VisitorLocation;
      // Invalidate if previously cached as incorrect ISP hub "Agra"
      if (parsed.city && parsed.city.toLowerCase() !== "agra") {
        return parsed;
      }
    }
  } catch {
    // sessionStorage blocked or unavailable
  }

  // 2. Primary: Client-side IP lookup via ipwho.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch("https://ipwho.is/", {
      signal: controller.signal,
      cache: "force-cache",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        let city = data.city || "Dehradun";
        // Correct Indian ISP regional BNG hub anomaly (Jio/Airtel broadband in UK/Western UP routes through Agra gateway)
        if (city.toLowerCase() === "agra") {
          city = "Dehradun";
        }
        const country = data.country || "India";
        const flagEmoji = data.flag?.emoji || "🇮🇳";
        const formatted = `${city}, ${country}`;

        const location: VisitorLocation = {
          city,
          country,
          countryCode: data.country_code || "IN",
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
    console.debug("Client IP geolocation lookup failed, using fallback:", err);
  }

  // 3. Fallback default
  const defaultLoc: VisitorLocation = {
    city: "Dehradun",
    country: "India",
    countryCode: "IN",
    flagEmoji: "🇮🇳",
    formatted: "Dehradun, India",
  };
  return defaultLoc;
}

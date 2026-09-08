/**
 * asset(path) — base-path-aware public asset helper
 *
 * Usage:  asset("/parth_resume.pdf")
 *         asset("/oneko.gif")
 *
 * On localhost / Vercel (NEXT_PUBLIC_BASE_PATH unset) → returns path unchanged.
 * On GitHub Pages (NEXT_PUBLIC_BASE_PATH=/E-Portfolio) → returns /E-Portfolio/path.
 *
 * NOTE: next/image <Image src="…"> already respects `basePath` automatically.
 *       Only use asset() for raw <a href>, <iframe src>, CSS url(), and similar.
 */
const BASE_PATH =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || "")
    : "";

export function asset(path: string): string {
  if (!path) return path;
  // External or data URLs remain untouched
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  // Avoid double-prefixing if already prefixed
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}

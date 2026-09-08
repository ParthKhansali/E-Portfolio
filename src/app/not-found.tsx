import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-center text-[#e8e8e8]">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
          404 — I built everything except this page.
        </h1>
        <p className="text-xs sm:text-sm text-[#777] leading-relaxed">
          Looks like this route escaped the notes app and got lost in the ether.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#4361ee] px-6 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(67,97,238,0.35)] transition-all hover:bg-[#3451d1]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to the chaos</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

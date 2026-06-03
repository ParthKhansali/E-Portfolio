import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parth Khansali — Developer, Strategist, Builder",
  description:
    "A cinematic digital identity for a modern technologist, strategist, and creative builder. Building systems and experiences at the intersection of technology, communication, and strategy.",
  keywords: [
    "Parth Khansali",
    "software engineer",
    "machine learning",
    "full-stack developer",
    "portfolio",
    "strategist",
    "builder",
  ],
  openGraph: {
    title: "Parth Khansali — Developer, Strategist, Builder",
    description:
      "Building digital systems and experiences at the intersection of technology, communication, and strategy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#050505] text-[#e8e8e8]">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/navigation/Navbar";
import StarfieldCanvas from "@/components/effects/StarfieldCanvas";
import CursorSpotlight from "@/components/effects/CursorSpotlight";
import CursorAssistant from "@/components/assistant/CursorAssistant";
import CommandPalette from "@/components/navigation/CommandPalette";
import ResumeModal from "@/components/resume/ResumeModal";
import LiveReviewCelebration from "@/components/effects/LiveReviewCelebration";
import RetroArcadeModal from "@/components/effects/RetroArcadeModal";
import AnimeScrollHUD from "@/components/effects/AnimeScrollHUD";
import ScrollDots from "@/components/effects/ScrollDots";
import { asset } from "@/lib/basepath";

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

export const viewport: Viewport = {
  themeColor: "#0f0f0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://parthkhansali.com"),
  title: {
    default: "Parth Khansali | Developer · Builder · Problem Solver",
    template: "%s | Parth Khansali",
  },
  description:
    "Portfolio of Parth Khansali, Computer Science student, systems builder, and developer. Building AI systems, mobile applications, distributed workflows, and university platforms.",
  keywords: [
    "Parth Khansali",
    "software engineer",
    "full stack developer",
    "Next.js",
    "React Native",
    "Spring Boot",
    "Python",
    "AI systems",
    "Graphic Era Hill University",
    "Graphic Era MUN",
    "GEHU Connect",
    "OmniMentor",
    "portfolio",
  ],
  authors: [{ name: "Parth Khansali", url: "https://parthkhansali.com" }],
  creator: "Parth Khansali",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://parthkhansali.com",
    siteName: "Parth Khansali",
    title: "Parth Khansali | Developer · Builder · Problem Solver",
    description:
      "I build things I wish already existed. Computer Science student, builder, and developer.",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Parth Khansali: Developer & Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khansali | Developer · Builder · Problem Solver",
    description:
      "I build things I wish already existed. Computer Science student, builder, and developer.",
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: asset("/icon.png"),
    apple: asset("/icon.png"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://parthkhansali.com/#person",
      name: "Parth Khansali",
      url: "https://parthkhansali.com",
      jobTitle: "Software Developer & Computer Science Student",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Graphic Era Hill University",
      },
      sameAs: [
        "https://github.com/ParthKhansali",
        "https://linkedin.com/in/parth-khansali",
        "https://instagram.com/parth_khansali",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://parthkhansali.com/#website",
      url: "https://parthkhansali.com",
      name: "Parth Khansali Portfolio",
      description: "Portfolio of Parth Khansali: Developer, Builder, Problem Solver",
      publisher: {
        "@id": "https://parthkhansali.com/#person",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://gehuconnect.in/#app",
      name: "GEHU Connect",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "iOS, Android, React Native",
      author: {
        "@id": "https://parthkhansali.com/#person",
      },
      description:
        "Student community and networking platform built with React Native and Spring Boot for Graphic Era Hill University students.",
      url: "https://gehuconnect.in",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0f0f0d] text-[#f0ece4] selection:bg-[#d4a843]/25 selection:text-white">

        {/* Global Twinkling Starfield Canvas Background */}
        <StarfieldCanvas />

        {/* Radial Mouse Torchlight Spotlight */}
        <CursorSpotlight />

        {/* Interactive Cursor-Following Oneko Cat Assistant */}
        <CursorAssistant />

        {/* Global Search Command Palette (⌘K) */}
        <CommandPalette />

        {/* Lenis Smooth Scroll Wrapper */}
        <SmoothScroll>
          <AnimeScrollHUD />
          <ScrollDots />
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>

        {/* Global Resume Preview & Download Modal mounted at body bottom */}
        <ResumeModal />

        {/* Real-time Guestbook Review Celebration & Live Wave Easter Egg Toast */}
        <LiveReviewCelebration />

        {/* Playable Retro Arcade Easter Egg (Nether Dash) */}
        <RetroArcadeModal />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/navigation/Navbar";
import StarfieldCanvas from "@/components/effects/StarfieldCanvas";
import CursorSpotlight from "@/components/effects/CursorSpotlight";
import ScrollProgress from "@/components/effects/ScrollProgress";
import CursorAssistant from "@/components/assistant/CursorAssistant";
import CommandPalette from "@/components/navigation/CommandPalette";
import ResumeModal from "@/components/resume/ResumeModal";

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
  metadataBase: new URL("https://parthkhansali.com"),
  title: {
    default: "Parth Khansali — Developer · Builder · Problem Solver",
    template: "%s | Parth Khansali",
  },
  description:
    "Portfolio of Parth Khansali — Computer Science student, systems builder, and developer. Building AI systems, mobile applications, distributed workflows, and university platforms.",
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
    title: "Parth Khansali — Developer · Builder · Problem Solver",
    description:
      "I build things I wish already existed. Computer Science student, builder, and developer.",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Parth Khansali — Developer & Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parth Khansali — Developer · Builder · Problem Solver",
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
    icon: "/icon.png",
    apple: "/icon.png",
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
      description: "Portfolio of Parth Khansali — Developer, Builder, Problem Solver",
      publisher: {
        "@id": "https://parthkhansali.com/#person",
      },
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
      className={`${inter.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#050505] text-[#e8e8e8] selection:bg-[#4361ee]/30 selection:text-white">
        {/* Viewport Top Reading Progress Line */}
        <ScrollProgress />

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
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>

        {/* Global Resume Preview & Download Modal mounted at body bottom */}
        <ResumeModal />
      </body>
    </html>
  );
}

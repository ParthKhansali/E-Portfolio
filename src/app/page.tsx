import Hero from "@/components/sections/Hero";
import PortalMarquee from "@/components/sections/PortalMarquee";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import DevDashboard from "@/components/dashboard/DevDashboard";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import GuestbookSection from "@/components/sections/GuestbookSection";
import ClosingCTA from "@/components/sections/ClosingCTA";
import SiteFooter from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main className="relative bg-[#050505] text-[#e8e8e8]">
      {/* 1. Clean Typographic Engineering Hero */}
      <Hero />

      {/* 2. 3D Nether Portal Dual Crisscross Skills Marquee */}
      <PortalMarquee />

      {/* 3. Featured Projects with Enchanted Book & Breathing Cards */}
      <FeaturedProjects />

      {/* 4. Developer Systems Deck (Terminal, WakaTime, Spotify) */}
      <DevDashboard />

      {/* 5. About & Multidisciplinary Capabilities */}
      <About />

      {/* 6. Career & Leadership Journey with Gavel Easter Egg */}
      <Experience />

      {/* 7. Live Community Guestbook & Real-Time Reviews */}
      <GuestbookSection />

      {/* 8. Closing CTA Section with Parallax Voxel Night Sky & Perched Mascot */}
      <ClosingCTA />

      {/* 9. Site Footer with Live Views */}
      <SiteFooter />
    </main>
  );
}

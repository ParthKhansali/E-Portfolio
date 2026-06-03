import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Experience from "@/components/sections/Experience";
import Philosophy from "@/components/sections/Philosophy";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <Philosophy />
      <ContactCTA />
    </main>
  );
}

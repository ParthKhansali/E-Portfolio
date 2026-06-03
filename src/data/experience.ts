export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
  type: "leadership" | "technical" | "speaking";
}

export const experience: ExperienceEntry[] = [
  {
    id: "mun-club",
    role: "Director General",
    organization: "Graphic Era MUN Club",
    period: "2024 — Present",
    description:
      "Served as Director General, the second-highest leadership position in the university’s Model United Nations club. Led strategic operations, team building, and institutional relations.",
    highlights: [
      "Led planning, coordination, and execution of 2 large-scale college-level debate and simulation events",
      "Managed committee operations, delegate engagement, and cross-team coordination in high-pressure environments",
      "Developed strong communication, leadership, negotiation, and organizational skills through public speaking and diplomatic simulations",
    ],
    type: "leadership",
  },
  {
    id: "nss-ambassador",
    role: "College Ambassador",
    organization: "National Social Summit 2025, IIT Roorkee",
    period: "2024 — 2025",
    description:
      "Led outreach and student engagement initiatives for IIT Roorkee’s National Social Summit 2025, coordinating registrations and promoting participation.",
    highlights: [
      "Coordinated registrations, promotions, and student participation across university communities",
      "Engaged with student networks to expand outreach and drive registrations",
      "Acted as a liaison between IIT Roorkee organizers and GEHU student body",
    ],
    type: "leadership",
  },
];

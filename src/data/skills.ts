export interface Skill {
  name: string;
  description: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Development",
    skills: [
      {
        name: "Languages & Logic",
        description:
          "C++, Python, Java, JavaScript, SQL — writing clean, structured, and high-performance code.",
        icon: "Code2",
      },
      {
        name: "Frameworks & Apps",
        description:
          "Next.js, React.js, Node.js, Spring Boot, React Native, Expo — building web and mobile frontends/backends.",
        icon: "Blocks",
      },
      {
        name: "Cloud & Infrastructure",
        description:
          "Cloudflare R2, AWS SDK, REST APIs — building secure, scalable cloud storage and reliable system integrations.",
        icon: "Database",
      },
    ],
  },
  {
    title: "AI & Core Systems",
    skills: [
      {
        name: "Intelligent Systems",
        description:
          "Adaptive Learning Systems, AI Workflow Design, Predictive Assistance Systems — crafting proactive software.",
        icon: "Brain",
      },
      {
        name: "System Architecture",
        description:
          "System Design, Event-Driven Architecture, OOP, Data Structures & Algorithms — designing robust distributed systems.",
        icon: "Layers",
      },
      {
        name: "Asynchronous Pipelines",
        description:
          "Message queues, event-driven integrations with Kafka & Zookeeper, decoupled state synchronization.",
        icon: "Sparkles",
      },
    ],
  },
  {
    title: "Leadership",
    skills: [
      {
        name: "Strategic Operations",
        description:
          "Serving as Director General for Graphic Era MUN Club, managing operations and cross-team coordination.",
        icon: "Target",
      },
      {
        name: "Outreach & Engagement",
        description:
          "College Ambassador for IIT Roorkee's National Social Summit 2025, leading registration and promotion campaigns.",
        icon: "Users",
      },
      {
        name: "Communication",
        description:
          "Debate coordination, diplomatic simulations, public speaking, negotiation, and high-stakes negotiation.",
        icon: "MessageSquare",
      },
    ],
  },
];

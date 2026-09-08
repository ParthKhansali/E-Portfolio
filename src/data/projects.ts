export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  category: "web" | "ml" | "tools" | "mobile";
  featured: boolean;
  status?: string;
  buttonText?: string;
  image?: string;
  links: {
    demo?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    id: "forgeflow",
    title: "ForgeFlow",
    subtitle: "Turn the boring steps into a workflow.",
    description:
      "We got tired of creating the same files by copy-pasting things, running commands manually, checking terminal output and repeating the same steps.\n\nSo we're building ForgeFlow — a workflow automation tool that uses Python libraries and AI to turn those repetitive steps into something the computer can handle on its own.\n\nLess copy-paste. Less terminal babysitting. More done.",
    techStack: ["Python", "AI", "Automation", "Workflow Engineering"],
    category: "tools",
    featured: true,
    status: "Ongoing Project",
    buttonText: "Explore ForgeFlow →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "aranya",
    title: "ARANYA",
    subtitle: "From claim to impact.",
    description:
      "ARANYA explores how fragmented Forest Rights Act records, evidence and claims can be turned into information that is easier to understand, connect, trace and act on.\n\nFocused on evidence registry, claim intelligence, provenance and traceability, legacy records processing, spatial map context, and AI-assisted information handling.",
    techStack: ["AI & ML", "Spatial Context", "Provenance", "Records Intelligence"],
    category: "ml",
    featured: true,
    status: "Ongoing Initiative",
    buttonText: "Explore ARANYA →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "omnimentor",
    title: "OmniMentor",
    subtitle: "An AI classroom that tries to stay one step ahead.",
    description:
      "OmniMentor is my take on a more adaptive classroom — one that can understand the learning context, anticipate where a student might get stuck, and respond with something useful instead of another wall of text.\n\nThe project brings together AI, interactive teaching, personalization and a classroom-style experience designed around how students actually learn.",
    techStack: ["Next.js", "React", "Node.js", "Python", "AI"],
    category: "ml",
    featured: true,
    buttonText: "See OmniMentor →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "gehu-connect",
    title: "GEHU Connect",
    subtitle: "A campus that fits in your pocket.",
    description:
      "A student-focused platform for discovering people, communities and opportunities around university life — without hunting through ten different WhatsApp groups.\n\nBuilt as a real mobile product with a React Native frontend and Spring Boot backend.",
    techStack: ["React Native", "Spring Boot", "JWT", "Cloudflare R2"],
    category: "mobile",
    featured: true,
    buttonText: "Explore GEHU Connect →",
    links: {
      demo: "https://gehuconnect.in",
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "taskflow",
    title: "TaskFlow",
    subtitle: "Because \"I'll remember it\" is not a task-management system.",
    description:
      "A full-stack project and task manager built to keep work simple: create projects, break them into tasks, track what's moving and stop losing important things in random tabs.",
    techStack: ["React", "Node.js", "Express", "MongoDB"],
    category: "web",
    featured: true,
    buttonText: "View the build →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
];

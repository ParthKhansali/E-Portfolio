export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets?: string[];
  techStack: string[];
  category: "web" | "ml" | "tools" | "mobile";
  featured: boolean;
  status?: string;
  buttonText?: string;
  image?: string;
  visualizer?: "equalizer" | "pipeline" | "radar" | "optical" | "search" | "stream";
  glowColor?: string;
  links: {
    demo?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    id: "gehu-connect",
    title: "GEHU Connect",
    subtitle: "Student Community & Networking Platform",
    description:
      "College life has a strange habit of spreading itself across ten different group chats. GEHU Connect is our attempt to put some of it back in one place: people, communities, conversations and campus stuff, in one app.",
    bullets: [
      "A React Native app with a Spring Boot backend: auth, profiles, communities and a campus feed.",
      "Cloudflare R2 and AWS SDK for reliable media uploads without choking the server.",
      "Deployed and being used by real students at GEHU, in alpha.",
    ],
    techStack: ["React Native", "Expo", "Java", "Spring Boot", "Cloudflare R2", "AWS SDK", "REST APIs"],
    category: "mobile",
    featured: true,
    status: "Deployed · Alpha",
    glowColor: "6, 214, 160",
    buttonText: "Open GEHU Connect →",
    links: {
      demo: "https://gehuconnect.in",
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "omnimentor",
    title: "OmniMentor",
    subtitle: "Anticipatory AI Classroom OS",
    description:
      "We kept wondering what a classroom would feel like if the software noticed where you were getting stuck before you had to ask. OmniMentor is that question turned into something you can click on: a learning layer that keeps context, adapts to where you are, and hands you an explanation at the moment it is useful.",
    bullets: [
      "Contextual explanations instead of disconnected one-shots.",
      "Adaptive pacing based on where students actually encounter difficulty.",
      "Modular architecture built around OmniProfile, OmniPredict, OmniLoop and OmniFlow.",
    ],
    techStack: ["Next.js", "React", "Node.js", "Python", "AI APIs"],
    category: "ml",
    featured: true,
    status: "Exploring",
    visualizer: "equalizer",
    glowColor: "114, 9, 183",
    buttonText: "See OmniMentor →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "forgeflow",
    title: "ForgeFlow",
    subtitle: "Workflow Automation Tool",
    description:
      "We got tired of making the same files by copy-pasting things, running commands manually and checking terminal output over and over. So we are building ForgeFlow: a workflow automation tool that uses Python libraries and AI to turn repetitive steps into something the computer handles on its own.",
    bullets: [
      "Less copy-paste. Less terminal babysitting. More done.",
      "Transforms command sequences into reproducible automation pipelines.",
    ],
    techStack: ["Python", "AI", "Automation", "Workflow Tooling"],
    category: "tools",
    featured: true,
    status: "Building",
    visualizer: "pipeline",
    glowColor: "67, 97, 238",
    buttonText: "Explore ForgeFlow →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "aranya",
    title: "ARANYA",
    subtitle: "Real-World Data & Maps",
    description:
      "ARANYA started with a simple question: can maps, data and AI make difficult real-world information easier to understand? Right now it is about turning fragmented Forest Rights Act records, evidence and claims into something you can actually trace: where a record came from, what it connects to, and what it supports.",
    bullets: [
      "Evidence registry and claim intelligence for legacy records.",
      "Provenance and traceability for messy historical documents.",
      "Spatial context for Uttarakhand: forest areas, fire risk and community zones.",
    ],
    techStack: ["Geospatial", "Data Pipelines", "AI Records", "Maps"],
    category: "ml",
    featured: true,
    status: "Early",
    visualizer: "radar",
    glowColor: "255, 107, 107",
    buttonText: "Explore ARANYA →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "orvess-pat",
    title: "ORVESS-PAT",
    subtitle: "Optical Rendezvous & Validation Experiment Simulation Suite",
    description:
      "A research-flavoured detour that started from an ISRO Smart India Hackathon problem in optical tracking and free-space optical communication. I got curious about what happens between light hitting a sensor and a system deciding it has a usable observation, so I ended up writing pieces of the simulation.",
    bullets: [
      "Sensor/FPA simulation and sub-pixel centroiding algorithms.",
      "Observation quality, adaptive filtering and failure reasoning.",
      "Gimbal tracking and Monte Carlo runs to see what holds up under noise.",
    ],
    techStack: ["Python", "Simulation", "Monte Carlo", "Optical Tracking"],
    category: "tools",
    featured: true,
    status: "Research",
    visualizer: "optical",
    glowColor: "114, 9, 183",
    buttonText: "View Research Notes →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "resume-screener",
    title: "Resume Screener Search Engine",
    subtitle: "Search, from scratch",
    description:
      "Search engines felt like magic, so I built a small one to find out what is underneath: an inverted index, TF-IDF and BM25 ranking, a FastAPI backend, and a React front end that lets you search through candidate resumes.",
    bullets: [
      "Inverted index with tokenization, stop-word filtering and BM25 scoring.",
      "FastAPI service with sub-millisecond query responses on cached indices.",
    ],
    techStack: ["Python", "FastAPI", "React", "BM25", "TF-IDF", "Inverted Index"],
    category: "web",
    featured: true,
    status: "Complete",
    visualizer: "search",
    glowColor: "67, 97, 238",
    buttonText: "View Code →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "autohire",
    title: "AutoHire",
    subtitle: "AI-Powered Hiring Platform",
    description:
      "An event-driven recruitment platform built to take manual coordination out of candidate workflows. Instead of people chasing spreadsheets, candidate pipelines move asynchronously on distributed event streams.",
    bullets: [
      "Distributed asynchronous pipelines on Apache Kafka and Zookeeper.",
      "Backend services for candidate tracking, scoring and workflow orchestration.",
    ],
    techStack: ["Node.js", "Kafka", "Zookeeper", "MongoDB"],
    category: "web",
    featured: true,
    status: "2025",
    visualizer: "stream",
    glowColor: "255, 107, 107",
    buttonText: "View Pipeline →",
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
];

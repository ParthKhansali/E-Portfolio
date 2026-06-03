export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  category: "web" | "ml" | "tools" | "mobile";
  featured: boolean;
  image?: string;
  links: {
    demo?: string;
    github?: string;
    caseStudy?: string;
  };
}

export const projects: Project[] = [
  {
    id: "omnimentor",
    title: "OmniMentor",
    description:
      "AI-powered anticipatory classroom OS that personalizes learning environments in real time based on learner behavior.",
    longDescription:
      "Designed and developed an AI-powered adaptive classroom system that personalizes teaching based on learner behavior and performance. Built predictive assistance workflows capable of anticipating user doubts and proactively generating contextual explanations in real time. Implemented adaptive learning pipelines using behavioral analysis, user profiling, and dynamic pacing systems. Developed interactive classroom environments with AI teacher interaction, personalized slide generation, coding practice modules, and intelligent learning assistance. Architected modular intelligence layers including OmniProfile, OmniPredict, OmniLoop, and OmniFlow.",
    techStack: ["Next.js", "React.js", "Node.js", "Python", "AI APIs"],
    category: "ml",
    featured: true,
    links: {
      demo: "#",
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "gehu-connect",
    title: "GEHU Connect",
    description:
      "Full-stack student community and campus networking mobile application with scalable cloud media management.",
    longDescription:
      "Developed a full-stack mobile application designed to connect university students through community-driven interaction and campus networking features. Built scalable backend services using Java Spring Boot with RESTful APIs for authentication, user management, and application workflows. Implemented mobile frontend using React Native and Expo to deliver a cross-platform user experience. Integrated Cloudflare R2 object storage and Amazon SDK services for efficient media handling and cloud-based asset management. Managed deployment workflows and production infrastructure setup including domain integration through gehuconnect.in.",
    techStack: ["Java Spring Boot", "React Native", "Expo", "Cloudflare R2", "AWS SDK"],
    category: "mobile",
    featured: true,
    links: {
      demo: "https://gehuconnect.in",
      github: "https://github.com/ParthKhansali",
    },
  },
  {
    id: "autohire",
    title: "AutoHire",
    description:
      "Automated hiring platform architected with an event-driven design for high-throughput candidate processing.",
    longDescription:
      "Developed an automated hiring platform using event-driven architecture for scalable candidate processing workflows. Implemented asynchronous communication pipelines using Kafka and Zookeeper to improve system scalability and reliability. Built backend services for candidate management, interview coordination, and workflow automation. Worked on distributed systems concepts including message queues, scalable communication, and modular service architecture.",
    techStack: ["Node.js", "Kafka", "Zookeeper", "MongoDB"],
    category: "tools",
    featured: true,
    links: {
      github: "https://github.com/ParthKhansali",
    },
  },
];

export interface Project {
  title: string;
  github: string;
  description: string;
  stack: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  title: string;
  period: string;
  organization: string;
  location?: string;
  details: string[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  website: string;
  location: string;
  status: string;
  license: string;
  languages: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  contact: ContactInfo;
}

export const profileData: ProfileData = {
  name: "Yasser Gombra",
  title: "Junior DevOps Engineer & Full-Stack Developer",
  subtitle: "Junior DevOps Engineer & Full-Stack Developer · ISET Nabeul · Tunisia",
  bio: "Student in Développement des Systèmes d'Information at ISET Nabeul since 2024. Passionate about DevOps, CI/CD pipelines, containerization, and open-source contributions. Actively exploring AI-driven development tools (Claude Code, Codex, GitHub Copilot) to optimize workflows.",
  projects: [
    {
      title: "BarberGo",
      github: "https://github.com/YasserYG8/BarberGo-Project",
      description: "Full-stack home hairdresser booking platform with role-based auth (Client/Hairdresser/Admin), PDF invoice generation, email notifications, live geolocation, and a booking state machine (pending → confirmed → on_way → arrived → in_progress → done).",
      stack: ["Next.js 14", "Laravel 11", "MySQL", "Laravel Sanctum", "DomPDF", "Zustand", "Tailwind CSS", "React Hook Form", "Zod"]
    },
    {
      title: "Chat-App",
      github: "https://github.com/YasserYG8/chat-app",
      description: "Real-time persistent chat app with messaging rooms, delivery status tracking, and state sync across users.",
      stack: ["Node.js", "WebSocket", "React", "MongoDB"]
    },
    {
      title: "Takwira TN",
      github: "https://github.com/YasserYG8/takwira_tn",
      description: "Digital platform for organizing, booking, and tracking local soccer matches and amateur sports events in Tunisia.",
      stack: ["Next.js", "TypeScript", "Docker"]
    },
    {
      title: "weftmap (DataDave-Dev)",
      github: "https://github.com/DataDave-Dev/weftmap",
      description: "Contributing to an open-source call graph visualization tool. Analyzed pluggable grammar specs, triaged issues, and worked with Tree-sitter WASM and React Flow.",
      stack: ["Next.js", "TypeScript", "Tree-sitter (WASM)", "React Flow", "Vitest"]
    }
  ],
  skills: [
    {
      category: "DevOps & Infrastructure",
      skills: ["Docker", "Ansible", "GitHub Actions", "Snyk", "Trivy", "Grafana", "Prometheus", "Git"]
    },
    {
      category: "Frontend",
      skills: ["React", "Next.js", "Angular", "Tailwind CSS", "shadcn/ui", "TypeScript", "JavaScript", "Zustand"]
    },
    {
      category: "Backend",
      skills: ["Laravel", "PHP", "Node.js", "Express", "Java", "Python"]
    },
    {
      category: "Databases",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"]
    },
    {
      category: "Tools & Design",
      skills: ["VS Code", "Cursor", "Figma", "Eclipse"]
    },
    {
      category: "Currently Exploring",
      skills: ["Claude Code", "Codex", "GitHub Copilot", "AI-driven dev workflows"]
    }
  ],
  experience: [
    {
      title: "Web Developer Intern",
      period: "Jan 2026 — Feb 2026",
      organization: "Dream Tek Consulting",
      location: "Web Agency",
      details: [
        "Developed dynamic features using native PHP and OOP design patterns.",
        "Collaborated via Git (branching, PRs, code reviews).",
        "Participated in daily standups and pair programming sessions."
      ]
    },
    {
      title: "Technical Assistant Intern",
      period: "Jan 2025 — Feb 2025",
      organization: "Tunisie Telecom",
      location: "Ghomrassen",
      details: [
        "Discovered corporate telecom systems and network administration.",
        "Provided hardware/software technical support and client assistance."
      ]
    },
    {
      title: "Student",
      period: "2024 — Present",
      organization: "ISET Nabeul — Licence DSI",
      details: [
        "Focus: Software Architecture, DevOps, DBMS, AI integrations, Software Engineering."
      ]
    },
    {
      title: "Baccalauréat Informatique",
      period: "Sept 2023 — June 2024",
      organization: "Lycée 2 Mars 1934, Ghomrassen",
      details: []
    }
  ],
  contact: {
    email: "yasserg4e@gmail.com",
    phone: "(+216) 99 087 181",
    github: "https://github.com/YasserYG8",
    linkedin: "https://linkedin.com/in/gombra-yasser-a8ab46274",
    website: "https://yassergombra.com",
    location: "Hammam Lif, Ben Arous / Ghomrassen, Tunisia",
    status: "Open to work — Looking for an internship",
    license: "Permis B",
    languages: ["Arabic (Native)", "French (Fluent)", "English (Intermediate)"]
  }
};

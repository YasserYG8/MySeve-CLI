export interface Project {
  title: string;
  github?: string;
  note?: string; // set on open source contributions
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
  x: string;
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
  bio: "Student in Information Systems Development at ISET Nabeul since 2024. Passionate about DevOps, CI/CD pipelines, containerization, and open-source contributions. Interested in AI tools like Claude Code, Codex, and GitHub Copilot.",
  projects: [
    {
      title: "Specter",
      github: "https://github.com/YasserYG8/Specter",
      description: "Zero-configuration developer CLI in Go that attaches to any running server process by port or PID and streams live stdout and stderr to the terminal. Features procfs inspection, automatic TCP port resolution, line reassembly, and JSON log formatting, with zero external runtime dependencies.",
      stack: ["Go", "Linux /proc", "Syscalls", "Concurrency", "CLI / TUI", "DevOps"]
    },
    {
      title: "VoxArena ML",
      description: "Deterministic acoustic signal processing engine for vocal imitation party games. Scores mimicry against sound effects using speaker-normalized pYIN pitch tracking, constrained Dynamic Time Warping, spectral flux onset detection, and MFCCs with CMS for sub-50ms CPU scoring. Includes a full FastAPI and MongoDB game architecture.",
      stack: ["Python", "FastAPI", "Librosa", "FastDTW", "SciPy", "MongoDB", "Signal Processing"]
    },
    {
      title: "Modlane",
      github: "https://github.com/YasserYG8/modlane",
      description: "Adaptive AI model router and low-latency API proxy for coding agents. Sends routine actions (file reading, AST search, git commits) to fast, inexpensive models and keeps frontier models for complex refactoring, cutting agent costs by up to 70%.",
      stack: ["TypeScript", "Node.js", "OpenAI & Anthropic APIs", "Streaming SSE", "AI Agents", "Gateway"]
    },
    {
      title: "Tajweed AI",
      github: "https://github.com/YasserYG8/Tajweed-AI",
      description: "Machine learning dataset engine and acoustic alignment pipeline for Quranic recitation. Combines ASR forced alignment (WhisperX and MFA) with deterministic DSP rules to evaluate phoneme boundaries, Madd duration, Ghunnah resonance, and Qalqalah transients.",
      stack: ["Python", "WhisperX", "MFA", "PyTorch", "DSP", "Levenshtein Diff"]
    },
    {
      title: "ImanHub",
      github: "https://github.com/YasserYG8/ImanHub",
      description: "Cross-platform Islamic companion mobile app. Features a 604-page dual-mode Quran reader with audio sync and tafsir, offline astronomical prayer calculation, a magnetometer-driven Qibla compass, a customizable Athkar counter, and localized push notifications.",
      stack: ["React Native", "Expo", "TypeScript", "Expo Router", "AsyncStorage", "Sensors & Geolocation", "Reanimated"]
    },
    {
      title: "becwright",
      note: "DataDave-Dev · 6 merged PRs",
      github: "https://github.com/DataDave-Dev/becwright",
      description: "Pre-commit guardrails and policy enforcement for AI coding agents. Parallelized rule execution with ThreadPoolExecutor, fixed cross-platform stdout/stderr capture and Windows quoting, added global excludes and cleaner CLI groups, and wrote the official Dockerfile and release workflow.",
      stack: ["Python", "Pre-commit", "ThreadPoolExecutor", "Docker", "GitHub Actions"]
    },
    {
      title: "weftmap",
      note: "DataDave-Dev · 15 merged PRs",
      github: "https://github.com/DataDave-Dev/weftmap",
      description: "Turns source code into an interactive call graph using Tree-sitter WASM. Added graph validation, cycle guards and error boundaries, LTR code layout in RTL/Arabic contexts, Vitest coverage for CI, and dynamic sitemap, robots and hreflang support.",
      stack: ["Next.js", "TypeScript", "Tree-sitter (WASM)", "React Flow", "Vitest"]
    },
  ],
  skills: [
    {
      category: "DevOps & Infrastructure",
      skills: ["Docker", "GitHub Actions", "Ansible", "Grafana", "Prometheus", "Snyk", "Trivy", "Linux", "Git"]
    },
    {
      category: "Frontend",
      skills: ["React", "Next.js", "React Native", "Angular", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Zustand"]
    },
    {
      category: "Backend",
      skills: ["Go", "Python", "Laravel", "Native PHP", "Node.js", "FastAPI", "Express", "Java"]
    },
    {
      category: "Databases",
      skills: ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis"]
    },
    {
      category: "Tools & Design",
      skills: ["Zed (#1 IDE)", "VS Code", "Cursor", "Eclipse", "Figma", "Vitest", "Postman"]
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
        "Native PHP development with OOP design patterns.",
        "Git team workflows: branching strategies, pull requests, and peer code reviews.",
        "Daily standups and pair programming sessions."
      ]
    },
    {
      title: "Technical Assistant Intern",
      period: "Jan 2025 — Feb 2025",
      organization: "Tunisie Telecom",
      location: "Ghomrassen",
      details: [
        "Discovered corporate communication networks and systems.",
        "Provided hardware and software technical support and client assistance.",
        "Learned essential network administration and management principles."
      ]
    },
    {
      title: "Bachelor's Degree, Information Systems Development",
      period: "2024 — Present",
      organization: "ISET Nabeul",
      location: "Higher Institute of Technological Studies",
      details: []
    },
    {
      title: "High School Diploma in Computer Science (Baccalaureate)",
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
    x: "https://x.com/YasserGombra",
    website: "https://yassergombra.com",
    location: "Ghomrassen, Tataouine / Hammam Lif, Ben Arous, Tunisia (open to relocation)",
    status: "Open to work — Looking for an internship",
    license: "Category B",
    languages: ["Arabic (Native)", "French (Intermediate)", "English (Intermediate)"]
  }
};

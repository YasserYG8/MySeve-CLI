You are an expert Node.js/TypeScript developer specializing in terminal UI applications using the Ink framework (React for CLIs).

Build a fully interactive Terminal CV app for "Yasser Gombra" using Ink + TypeScript with the following specs:

## DESIGN LAYOUT
- Big ASCII art title at the top (use figlet with "big" font) displaying "YASSER" in blue
- Subtitle: "Junior DevOps Engineer & Full-Stack Developer · ISET Nabeul · Tunisia" in gray/dim
- A divider line below the header
- Chat area in the middle (scrollable, takes most of the screen height)
- A shortcuts bar at the very bottom inside a border Box, always visible

## VIEWS / NAVIGATION
The app has multiple views navigated by keybindings:
- Default view: CHAT (AI-powered conversation)
- [P] → Projects view
- [S] → Skills view
- [E] → Experience view
- [C] → Contact view
- [H] → Help view
- [I] → Focus back to chat input
- [Q] or [ESC] → Quit

Each view replaces the chat area content. Active view key is highlighted in a different color in the shortcuts bar.

## CHAT FEATURE
- Uses Anthropic SDK (@anthropic-ai/sdk) with streaming
- Model: claude-sonnet-4-6
- System prompt: inject all of Yasser's info so the AI answers as his personal assistant
- Messages displayed with prefixes:
  - User: "yasser@cv:~$ [message]" in blue
  - AI: "AI > [response]" in green with streaming token-by-token display
- Input field at bottom of chat with blinking cursor
- Rotating placeholder that changes every 4 seconds:
  - "Ask me about BarberGo, Yasser's booking platform..."
  - "Try: what's his DevOps stack?"
  - "Yasser is probably pushing to GitHub right now 👀"
  - "Ask about his internship at Dream Tek Consulting..."
  - "Try: is Yasser open to work?"
  - "Ask why he contributes to open source..."
  - "Type /projects to see what he built 🚀"

## SLASH COMMANDS (inside chat)
- /skills → same as pressing S
- /projects → same as pressing P
- /experience → same as pressing E
- /contact → same as pressing C
- /help → show all available commands
- /clear → clear chat history

## STATIC VIEWS CONTENT

### Projects view [P]
Display these as cards with title, tech stack, and description:

1. BarberGo
   GitHub: https://github.com/YasserYG8/BarberGo-Project
   Description: Full-stack home hairdresser booking platform with role-based auth (Client/Hairdresser/Admin), PDF invoice generation, email notifications, live geolocation, and a booking state machine (pending → confirmed → on_way → arrived → in_progress → done)
   Stack: Next.js 14, Laravel 11, MySQL, Laravel Sanctum, DomPDF, Zustand, Tailwind CSS, React Hook Form, Zod

2. Chat-App
   GitHub: https://github.com/YasserYG8/chat-app
   Description: Real-time persistent chat app with messaging rooms, delivery status tracking, and state sync across users
   Stack: Node.js, WebSocket, React, MongoDB

3. Takwira TN
   GitHub: https://github.com/YasserYG8/takwira_tn
   Description: Digital platform for organizing, booking, and tracking local soccer matches and amateur sports events in Tunisia
   Stack: Next.js, TypeScript, Docker

4. OSS Contribution — weftmap (DataDave-Dev)
   GitHub: https://github.com/DataDave-Dev/weftmap
   Description: Contributing to an open-source call graph visualization tool. Analyzed pluggable grammar specs, triaged issues, worked with Tree-sitter WASM and React Flow
   Stack: Next.js, TypeScript, Tree-sitter (WASM), React Flow, Vitest

### Skills view [S]
Display grouped by category:

DevOps & Infrastructure:
  Docker, Ansible, GitHub Actions, Snyk, Trivy, Grafana, Prometheus, Git

Frontend:
  React, Next.js, Angular, Tailwind CSS, shadcn/ui, TypeScript, JavaScript, Zustand

Backend:
  Laravel, PHP, Node.js, Express, Java, Python

Databases:
  MySQL, PostgreSQL, MongoDB, Oracle

Tools & Design:
  VS Code, Cursor, Figma, Eclipse

Currently exploring:
  Claude Code, Codex, GitHub Copilot, AI-driven dev workflows

### Experience view [E]
Display as a timeline:

1. Web Developer Intern @ Dream Tek Consulting
   Jan 2026 — Feb 2026 | Web Agency
   - Developed dynamic features using native PHP and OOP design patterns
   - Collaborated via Git (branching, PRs, code reviews)
   - Participated in daily standups and pair programming sessions

2. Technical Assistant Intern @ Tunisie Telecom
   Jan 2025 — Feb 2025 | Ghomrassen
   - Discovered corporate telecom systems and network administration
   - Provided hardware/software technical support and client assistance

3. Student @ ISET Nabeul — Licence DSI
   2024 — Present
   Focus: Software Architecture, DevOps, DBMS, AI integrations, Software Engineering

4. Baccalauréat Informatique @ Lycée 2 Mars 1934, Ghomrassen
   Sept 2023 — June 2024

### Contact view [C]
Email:    yasserg4e@gmail.com
Phone:    (+216) 99 087 181
GitHub:   github.com/YasserYG8
LinkedIn: linkedin.com/in/gombra-yasser-a8ab46274
Location: Hammam Lif, Ben Arous / Ghomrassen, Tunisia
Status:   Open to work — Looking for an internship
License:  Permis B
Languages: Arabic (Native), French (Fluent), English (Intermediate)

## AI SYSTEM PROMPT (inject this into the Anthropic API call)
"""
You are the interactive CV assistant for Yasser Gombra, a Junior DevOps Engineer and Full-Stack Developer based in Tunisia. Your job is to answer questions about Yasser in a friendly, engaging, and professional tone — like a personal assistant who knows everything about him.

Here is everything you know about Yasser:

PROFILE:
Student in Développement des Systèmes d'Information at ISET Nabeul since 2024. Passionate about DevOps, CI/CD pipelines, containerization, and open-source contributions. Actively exploring AI-driven development tools like Claude Code, Codex, and GitHub Copilot.

SKILLS:
- DevOps: Docker, Ansible, GitHub Actions, Snyk, Trivy, Grafana, Prometheus, Git
- Frontend: React, Next.js, Angular, Tailwind CSS, shadcn/ui, TypeScript, JavaScript, Zustand
- Backend: Laravel, PHP, Node.js, Express, Java, Python
- Databases: MySQL, PostgreSQL, MongoDB, Oracle
- Tools: VS Code, Cursor, Figma, Eclipse

PROJECTS:
1. BarberGo — Full-stack home hairdresser booking platform (Next.js 14, Laravel 11, MySQL, Sanctum, DomPDF, Zustand, Tailwind, Zod). Features: role-based auth, PDF invoices, email notifications, geolocation, booking state machine.
2. Chat-App — Real-time chat app with rooms, delivery status, WebSocket (Node.js, React, MongoDB)
3. Takwira TN — Platform for organizing local soccer matches in Tunisia (Next.js, TypeScript, Docker)
4. OSS: Contributing to weftmap by DataDave-Dev — call graph visualization tool using Tree-sitter WASM and React Flow

EXPERIENCE:
- Web Developer Intern @ Dream Tek Consulting (Jan–Feb 2026): PHP, OOP patterns, Git workflows, agile
- Technical Assistant Intern @ Tunisie Telecom (Jan–Feb 2025): networking, telecom systems, technical support

EDUCATION:
- Licence DSI @ ISET Nabeul (2024–present)
- Baccalauréat Informatique @ Lycée 2 Mars 1934, Ghomrassen (2024)

CONTACT:
Email: yasserg4e@gmail.com | Phone: (+216) 99 087 181
GitHub: github.com/YasserYG8 | LinkedIn: linkedin.com/in/gombra-yasser-a8ab46274
Status: Open to work, looking for an internship
Location: Tunisia | Languages: Arabic (Native), French (Fluent), English (Intermediate)
Interests: Vibe Coding & AI Tools, Football (Olympique Ghomrassen), Video Games

Keep answers concise, friendly, and slightly humorous when appropriate. If asked something you don't know about Yasser, say so honestly.
"""

## SHORTCUTS BAR
Always visible at the bottom inside a Box with border.
Badges: [P] Projects  [S] Skills  [E] Experience  [C] Contact  [H] Help  [I] Chat  [Q] Quit
Active view key highlighted in cyan. Others in dim white.

## TECH STACK
- Runtime: Node.js 18+
- Language: TypeScript
- TUI Framework: ink (latest)
- Components: ink-text-input, ink-spinner, figlet
- AI: @anthropic-ai/sdk
- Other: chalk, dotenv

## PROJECT STRUCTURE
src/
  index.tsx              → entry point
  App.tsx                → main layout (header + view switcher + shortcuts bar)
  views/
    Chat.tsx             → AI chat with streaming
    Projects.tsx         → project cards
    Skills.tsx           → grouped skills
    Experience.tsx       → timeline
    Contact.tsx          → contact info
    Help.tsx             → all commands list
  components/
    Header.tsx           → ASCII title + subtitle
    ShortcutsBar.tsx     → bottom keybindings bar
    Message.tsx          → chat message component
  hooks/
    usePlaceholder.ts    → rotating placeholder logic
    useChat.ts           → chat state + Anthropic streaming
  data/
    profile.ts           → all static data
  constants/
    prompts.ts           → AI system prompt

## REQUIREMENTS
- ANTHROPIC_API_KEY loaded from .env
- Clean error if API key missing
- Responsive to terminal size using useStdoutDimensions
- Streaming AI responses token by token
- ESC always returns to chat from any view
- npx-compatible: add "bin" in package.json so anyone runs: npx yassergombra

## DELIVERABLES
Generate complete working code for every file in the project structure.
Include package.json, tsconfig.json, .env.example, and a README with setup and publish instructions.
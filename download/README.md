# TechHub EMSI Fès — Website

> Where Tech Meets Ideas.

A premium, fullstack website for TechHub EMSI Fès, a student-run technology laboratory at École Marocaine des Sciences de l'Ingénieur — Fès. Designed with a minimalist engineering aesthetic inspired by Linear, Vercel, and GitHub.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5** — strict throughout
- **Tailwind CSS 4** with **shadcn/ui** (New York style) + Lucide icons
- **Prisma ORM** with **SQLite** (file-based, zero config)
- **Zustand** for client state, **react-hook-form** + **zod** for forms
- **react-markdown**, **framer-motion**, **recharts**, **Sonner** toasts

## Architecture

The site is a single-page application served from `/` (`src/app/page.tsx`). A lightweight hash-based router (`src/lib/router.ts`) drives 11 views without SSR routing — this is intentional for the sandbox environment and works perfectly with browser back/forward.

- `src/components/views/*` — one file per "page" (home, about, projects, events, playground, learning, community, join, contact, dashboard, admin).
- `src/components/playground/*` — interactive tools (binary converter, logic gates, algorithm visualizer, code editor, dev tools).
- `src/app/api/*` — REST endpoints backed by Prisma + cookie sessions.
- `src/lib/session.ts` — server-only session helpers (`"server-only"` enforced).
- `src/lib/session-shared.ts` — types and `fetchSession()` for client components.

## Authentication & permissions

- Cookie-based sessions (`th_session`), hashed passwords (scrypt), 14-day TTL.
- Three roles: `ADMIN`, `LEAD`, `MEMBER`.
- `requireUser` / `requireLeadOrAbove` / `requireAdmin` helpers enforce permissions on every admin endpoint.

## Demo accounts (seeded)

| Email | Password | Role |
|---|---|---|
| admin@techhub-emsi.ma | techhub2024 | ADMIN |
| lead@techhub-emsi.ma | lead2024 | LEAD |

## Seeded content

6 projects · 4 events · 4 tutorials · 3 coding challenges · 3 quizzes · 3 announcements · 2 members. Re-run the seed script any time — it is idempotent for the admin user:

```bash
bun run scripts/seed.ts
```

## Pages & features

| Page | Highlights |
|---|---|
| **Home** | Hero, schematic panel, marquee, focus pillars, featured projects, upcoming events, process loop, principles, CTA |
| **About** | Story, values, structure, year timeline, related links |
| **Projects** | Search, category/status filters, detail dialog with GitHub/demo links, contributor list |
| **Events** | Type filter, schedule, capacity management, real registration with waitlist |
| **Playground** | Binary converter, logic gate simulator (with truth table & schematic), algorithm visualizer (bubble/insertion/selection), live HTML/CSS/JS editor, dev tools (regex, JSON, UUID, hash) |
| **Learning Hub** | Tutorials (Markdown), coding challenges (server-graded), quizzes with per-question feedback |
| **Community** | Member grid, announcements (pinned), contribution counts |
| **Join Us** | Validated application form, skills manager, motivation length check, persisted to DB |
| **Contact** | Contact form with validation, persisted to DB |
| **Member Dashboard** | Profile editor, project list, event registrations, learning progress, quiz scores |
| **Admin Dashboard** | Full CRUD for applications, projects, events, members, tutorials, challenges, quizzes, announcements |

## Design system

- Engineering palette: paper-white background, deep navy ink, restrained engineering-blue accent.
- Mono labels (`label-mono`), blueprint corner ticks (`BlueprintFrame`), engineering grid backgrounds.
- Dark mode (next-themes), focus-visible rings, ARIA labels, keyboard-reachable interactions.
- Sticky footer, mobile-first responsive layout, custom scrollbars.

## Notes

- All "Members" stats and project counts shown on the home page are real (computed from the DB). We do not invent statistics — placeholders are clearly labeled.
- The "Members" hero stat is shown as `—` until members register.
- The project content (Atlas, Marsa, Zellige, etc.) is illustrative placeholder content representing the *kinds* of projects the club would build. Replace with real projects via the admin console.

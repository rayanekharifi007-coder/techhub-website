/* eslint-disable @typescript-eslint/no-require-imports */
// TechHub EMSI Fès — seed script
// Run: bun run scripts/seed.ts
// Seeds an admin user, sample projects, events, tutorials, challenges, quizzes, and announcements.
// Re-running is safe — it is idempotent for the admin user.

const { PrismaClient } = require("@prisma/client");
const scryptSync = require("crypto").scryptSync;
const randomBytes = require("crypto").randomBytes;

const prisma = new PrismaClient();

function hash(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding TechHub EMSI Fès database...");

  // ---- Admin user ----
  const adminEmail = "admin@techhub-emsi.ma";
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "TechHub Admin",
        passwordHash: hash("techhub2024"),
        role: "ADMIN",
        bio: "Founding administrator of TechHub EMSI Fès.",
        specialty: "Software Engineering",
        github: "techhub-emsi",
      },
    });
    console.log("Created admin user — email: admin@techhub-emsi.ma  password: techhub2024");
  } else {
    console.log("Admin user already exists.");
  }

  // A second lead for demo purposes
  const leadEmail = "lead@techhub-emsi.ma";
  let lead = await prisma.user.findUnique({ where: { email: leadEmail } });
  if (!lead) {
    lead = await prisma.user.create({
      data: {
        email: leadEmail,
        name: "Yasmine El Idrissi",
        passwordHash: hash("lead2024"),
        role: "LEAD",
        bio: "Project lead — backend & systems track.",
        specialty: "Software Engineering",
        github: "yasmine-dev",
        skills: JSON.stringify(["TypeScript", "PostgreSQL", "Distributed systems", "Go"]),
      },
    });
    console.log("Created lead user — email: lead@techhub-emsi.ma  password: lead2024");
  }

  // ---- Projects ----
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    const projects = [
      {
        title: "Atlas Routing Engine",
        slug: "atlas-routing-engine",
        summary: "Open-source routing engine for Moroccan logistics — multimodal, edge-cached, and geospatial.",
        description:
          "Atlas is a high-performance routing engine designed for the Moroccan logistics industry. It supports multimodal routing (road, rail, sea) and uses an edge-cached tile pipeline to deliver sub-50ms route queries at national scale. The project began as a hackathon prototype at TechHub EMSI Fès and is now in production pilot with two regional carriers.",
        category: "SYSTEMS",
        techStack: JSON.stringify(["Rust", "PostGIS", "Redis", "Kubernetes"]),
        githubUrl: "https://github.com/techhub-emsi/atlas-routing",
        demoUrl: "https://atlas.techhub-emsi.ma",
        status: "SHIPPED",
        featured: true,
        authorId: admin.id,
        contributors: JSON.stringify(["Yasmine El Idrissi", "Anas Bennani", "Salma Tazi"]),
        coverColor: "#1f3a8a",
      },
      {
        title: "Marsa Vision",
        slug: "marsa-vision",
        summary: "Computer-vision pipeline that detects port congestion from satellite imagery.",
        description:
          "Marsa Vision is a computer-vision pipeline that ingests Sentinel-2 satellite imagery of the Tanger-Med port and produces daily congestion reports. Built with PyTorch and FastAPI, the model classifies vessel types and berth occupancy. Outputs feed a public dashboard operated by a student research collective.",
        category: "AI",
        techStack: JSON.stringify(["PyTorch", "FastAPI", "NumPy", "GDAL"]),
        githubUrl: "https://github.com/techhub-emsi/marsa-vision",
        status: "IN_PROGRESS",
        featured: true,
        authorId: lead.id,
        contributors: JSON.stringify(["Omar Chraibi", "Salma Tazi"]),
        coverColor: "#0d4f7c",
      },
      {
        title: "Toumaï CLI",
        slug: "toumai-cli",
        summary: "A developer toolkit for scaffolding production-grade Next.js services with one command.",
        description:
          "Toumaï CLI is a developer toolkit that scaffolds production-grade Next.js services with one command. It encodes the architecture patterns used across TechHub EMSI Fès projects: type-safe Prisma layers, edge-deployable API routes, observability hooks, and zero-config CI. Used internally to bootstrap three club projects in 2024.",
        category: "TOOLING",
        techStack: JSON.stringify(["TypeScript", "Bun", "Turborepo"]),
        githubUrl: "https://github.com/techhub-emsi/toumai-cli",
        status: "SHIPPED",
        featured: false,
        authorId: admin.id,
        contributors: JSON.stringify(["Anas Bennani"]),
        coverColor: "#2c5282",
      },
      {
        title: "Zellige UI",
        slug: "zellige-ui",
        summary: "An accessible component library inspired by Moroccan geometric patterns.",
        description:
          "Zellige UI is an accessible React component library inspired by Moroccan geometric patterns. It ships 36 headless components built on Radix primitives, with full keyboard navigation, RTL support, and a theming system that draws from the zellige color palette. Currently in alpha — used by three internal projects.",
        category: "WEB",
        techStack: JSON.stringify(["React", "Radix UI", "Tailwind CSS", "Storybook"]),
        githubUrl: "https://github.com/techhub-emsi/zellige-ui",
        demoUrl: "https://zellige.techhub-emsi.ma",
        status: "IN_PROGRESS",
        featured: true,
        authorId: lead.id,
        contributors: JSON.stringify(["Salma Tazi", "Yasmine El Idrissi"]),
        coverColor: "#7c2d12",
      },
      {
        title: "Argan Board",
        slug: "argan-board",
        summary: "Self-hostable, low-latency Kanban board designed for engineering teams.",
        description:
          "Argan Board is a self-hostable, low-latency Kanban board engineered for student and small engineering teams. It features real-time collaboration over WebSocket, full keyboard control, Markdown cards, and a SQLite-friendly footprint that runs on a $5 VPS. Built as a learning vehicle for distributed systems.",
        category: "WEB",
        techStack: JSON.stringify(["Next.js", "tRPC", "SQLite", "WebSocket"]),
        githubUrl: "https://github.com/techhub-emsi/argan-board",
        status: "SHIPPED",
        featured: false,
        authorId: admin.id,
        contributors: JSON.stringify(["Omar Chraibi", "Anas Bennani"]),
        coverColor: "#166534",
      },
      {
        title: "Riad Sensor Mesh",
        slug: "riad-sensor-mesh",
        summary: "Low-power environmental sensor mesh for heritage riads in the Fès Medina.",
        description:
          "Riad Sensor Mesh is a low-power environmental sensor mesh designed for heritage riads in the Fès Medina. ESP32 nodes report temperature, humidity, and particulate matter to a gateway that exposes data via MQTT and a small Next.js dashboard. The mesh is deployed in three pilot riads as part of a heritage-preservation collaboration.",
        category: "HARDWARE",
        techStack: JSON.stringify(["ESP32", "MQTT", "Rust", "Next.js"]),
        githubUrl: "https://github.com/techhub-emsi/riad-sensor-mesh",
        status: "IN_PROGRESS",
        featured: false,
        authorId: lead.id,
        contributors: JSON.stringify(["Salma Tazi", "Yasmine El Idrissi"]),
        coverColor: "#92400e",
      },
    ];
    for (const p of projects) {
      await prisma.project.create({ data: p });
    }
    console.log(`Created ${projects.length} projects.`);
  } else {
    console.log(`Projects already exist (${existingProjects}). Skipping.`);
  }

  // ---- Events ----
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    const now = Date.now();
    const events = [
      {
        title: "Hackathon Atlas — 48h Build",
        slug: "hackathon-atlas-2024",
        description:
          "A 48-hour build marathon where 12 student teams ship a working prototype around the theme 'Engineering for Moroccan logistics'. Mentors from national carriers and engineering firms will be on-site. Meals and coffee provided.",
        type: "HACKATHON",
        startDate: new Date(now + 14 * 86400000),
        endDate: new Date(now + 16 * 86400000),
        location: "EMSI Fès — Amphitheatre A",
        capacity: 80,
        status: "UPCOMING",
        schedule: JSON.stringify([
          { time: "Sat 09:00", title: "Doors & team formation", speaker: "TechHub" },
          { time: "Sat 10:00", title: "Kick-off & rules", speaker: "Yasmine El Idrissi" },
          { time: "Sat 11:00", title: "Hacking begins", speaker: "" },
          { time: "Sun 17:00", title: "Final demos", speaker: "All teams" },
          { time: "Sun 19:00", title: "Awards", speaker: "Jury" },
        ]),
        coverColor: "#1f3a8a",
      },
      {
        title: "Workshop: Rust for Systems",
        slug: "workshop-rust-systems",
        description:
          "A hands-on, 3-hour introduction to Rust for systems programming. We will cover ownership, borrowing, async runtimes, and ship a small CLI that talks to a Postgres database. Bring a laptop with Rust installed.",
        type: "WORKSHOP",
        startDate: new Date(now + 5 * 86400000),
        endDate: new Date(now + 5 * 86400000 + 3 * 3600000),
        location: "EMSI Fès — Lab 3",
        capacity: 30,
        status: "UPCOMING",
        schedule: JSON.stringify([
          { time: "14:00", title: "Setup & ownership", speaker: "Anas Bennani" },
          { time: "15:00", title: "Borrowing & lifetimes", speaker: "Anas Bennani" },
          { time: "16:00", title: "Async & a Postgres CLI", speaker: "Anas Bennani" },
        ]),
        coverColor: "#7c2d12",
      },
      {
        title: "Talk: Scaling a Moroccan Startup to 1M Users",
        slug: "talk-scaling-startup",
        description:
          "An engineering talk by a guest founder on the architecture decisions behind scaling a Moroccan SaaS to one million users — caching, multi-tenancy, observability, and the cost of speed.",
        type: "TALK",
        startDate: new Date(now + 21 * 86400000),
        endDate: new Date(now + 21 * 86400000 + 2 * 3600000),
        location: "EMSI Fès — Amphitheatre B",
        capacity: 120,
        status: "UPCOMING",
        schedule: JSON.stringify([
          { time: "18:00", title: "Welcome", speaker: "TechHub" },
          { time: "18:15", title: "Talk", speaker: "Guest founder" },
          { time: "19:30", title: "Q&A", speaker: "" },
        ]),
        coverColor: "#0d4f7c",
      },
      {
        title: "Study Jam: Algorithms Crash-Course",
        slug: "study-jam-algorithms",
        description:
          "A weekly study jam focused on core algorithms and data structures. We work through problems in groups, review solutions, and prepare for technical interviews. Open to all engineering levels.",
        type: "STUDY_JAM",
        startDate: new Date(now - 2 * 86400000),
        endDate: new Date(now - 2 * 86400000 + 2 * 3600000),
        location: "EMSI Fès — Lab 1",
        capacity: 25,
        status: "COMPLETED",
        schedule: JSON.stringify([
          { time: "16:00", title: "Warm-up problems", speaker: "Salma Tazi" },
          { time: "17:00", title: "Graph algorithms", speaker: "Salma Tazi" },
        ]),
        coverColor: "#166534",
      },
    ];
    for (const e of events) await prisma.event.create({ data: e });
    console.log(`Created ${events.length} events.`);
  } else {
    console.log(`Events already exist (${existingEvents}). Skipping.`);
  }

  // ---- Tutorials ----
  const existingTutorials = await prisma.tutorial.count();
  if (existingTutorials === 0) {
    const tutorials = [
      {
        title: "Type-Safe API Routes with Next.js 16",
        slug: "type-safe-api-routes-nextjs",
        summary: "Build end-to-end type-safe API routes using zod, Prisma, and a small validation layer.",
        content:
          "# Type-Safe API Routes with Next.js 16\n\nThis tutorial walks through building an API route that is type-safe from the HTTP edge down to the database.\n\n## Step 1 — Define the schema with zod\n\n```ts\nconst schema = z.object({ title: z.string().min(3) });\n```\n\n## Step 2 — Validate the request\n\nParse the body, narrow the type, and pass the typed object to Prisma.\n\n## Step 3 — Return a typed response\n\nUse `NextResponse.json` with an explicit `TypedResponse<...>` to keep callers type-safe.\n\n## Conclusion\n\nA 30-line wrapper buys you end-to-end safety and removes an entire class of runtime errors.",
        category: "BACKEND",
        difficulty: "INTERMEDIATE",
        minutes: 18,
        authorId: admin.id,
      },
      {
        title: "Understanding SQL Indexes by Reading EXPLAIN",
        slug: "understanding-sql-indexes",
        summary: "A practical walkthrough of SQLite/Postgres query plans and how indexes change them.",
        content:
          "# Understanding SQL Indexes by Reading EXPLAIN\n\nIndexes are the single most important performance lever in a relational database.\n\n## Read the plan, not the query\n\nRun `EXPLAIN QUERY PLAN` and look for `SCAN TABLE` — that means a full table scan. `SEARCH TABLE ... USING INDEX` is what you want.\n\n## Composite indexes\n\nOrder matters. `(tenant_id, created_at)` is not the same as `(created_at, tenant_id)`. Put the equality columns first, then the range column.\n\n## Conclusion\n\nRead the plan after every schema change. The plan is the truth.",
        category: "BACKEND",
        difficulty: "ADVANCED",
        minutes: 22,
        authorId: lead.id,
      },
      {
        title: "Building Accessible React Components",
        slug: "accessible-react-components",
        summary: "The 6 accessibility checks every component should pass before it ships.",
        content:
          "# Building Accessible React Components\n\nAccessibility is not a feature. It is a baseline.\n\n## The 6 checks\n\n1. Keyboard reachable — every interaction reachable with Tab.\n2. Visible focus — every focusable element has a visible focus ring.\n3. ARIA labels — buttons and links have accessible names.\n4. Roles — use semantic HTML first; ARIA only when needed.\n5. Contrast — minimum 4.5:1 for body text.\n6. Screen reader — test with VoiceOver or NVDA.\n\n## Conclusion\n\nRun these checks on every PR. No exceptions.",
        category: "FRONTEND",
        difficulty: "BEGINNER",
        minutes: 12,
        authorId: lead.id,
      },
      {
        title: "Your First ESP32 Sensor Node",
        slug: "first-esp32-sensor-node",
        summary: "Wire up a DHT22 sensor, flash firmware, and publish readings over MQTT.",
        content:
          "# Your First ESP32 Sensor Node\n\nHardware engineering starts with one working sensor.\n\n## Wiring\n\nConnect the DHT22 data pin to GPIO4, VCC to 3.3V, GND to GND. Add a 10kΩ pull-up between data and VCC.\n\n## Firmware\n\nUse PlatformIO. Read the sensor every 10 seconds and publish a JSON payload to `sensors/riad-01`.\n\n## Conclusion\n\nOnce one node works, the mesh is just configuration.",
        category: "TOOLS",
        difficulty: "BEGINNER",
        minutes: 25,
        authorId: admin.id,
      },
    ];
    for (const t of tutorials) await prisma.tutorial.create({ data: t });
    console.log(`Created ${tutorials.length} tutorials.`);
  } else {
    console.log(`Tutorials already exist (${existingTutorials}). Skipping.`);
  }

  // ---- Coding challenges ----
  const existingChallenges = await prisma.codingChallenge.count();
  if (existingChallenges === 0) {
    const challenges = [
      {
        title: "Two-Sum",
        slug: "two-sum",
        description:
          "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Assume exactly one solution exists.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        starterCode: "function twoSum(nums, target) {\n  // your code here\n}",
        solution: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const want = target - nums[i];\n    if (seen.has(want)) return [seen.get(want), i];\n    seen.set(nums[i], i);\n  }\n}",
        tests: JSON.stringify([
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] },
        ]),
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        description:
          "Given a string containing only '()', '{}', '[]', determine if the input is valid. An input is valid if all brackets close in the correct order.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        starterCode: "function isValid(s) {\n  // your code here\n}",
        solution: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);\n    else if (stack.pop() !== map[ch]) return false;\n  }\n  return stack.length === 0;\n}",
        tests: JSON.stringify([
          { input: ["()"], expected: true },
          { input: ["()[]{}"], expected: true },
          { input: ["(]"], expected: false },
          { input: ["([)]"], expected: false },
          { input: ["{[]}"], expected: true },
        ]),
      },
      {
        title: "Binary Tree Level Order",
        slug: "binary-tree-level-order",
        description:
          "Given the root of a binary tree, return the level order traversal of its nodes (list of lists).",
        difficulty: "MEDIUM",
        category: "ALGORITHMS",
        starterCode: "function levelOrder(root) {\n  // your code here\n}",
        solution: "function levelOrder(root) {\n  if (!root) return [];\n  const out = [];\n  let q = [root];\n  while (q.length) {\n    const level = [];\n    const next = [];\n    for (const n of q) { level.push(n.val); if (n.left) next.push(n.left); if (n.right) next.push(n.right); }\n    out.push(level);\n    q = next;\n  }\n  return out;\n}",
        tests: JSON.stringify([
          { input: [{ val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }], expected: [[3], [9, 20], [15, 7]] },
        ]),
      },
    ];
    for (const c of challenges) await prisma.codingChallenge.create({ data: c });
    console.log(`Created ${challenges.length} coding challenges.`);
  } else {
    console.log(`Challenges already exist (${existingChallenges}). Skipping.`);
  }

  // ---- Quizzes ----
  const existingQuizzes = await prisma.quiz.count();
  if (existingQuizzes === 0) {
    const quizzes = [
      {
        title: "Web Fundamentals",
        slug: "web-fundamentals",
        category: "FRONTEND",
        questions: JSON.stringify([
          {
            id: "q1",
            prompt: "Which HTTP method is idempotent and safe?",
            options: ["POST", "PUT", "GET", "PATCH"],
            answer: 2,
          },
          {
            id: "q2",
            prompt: "What does the `Cache-Control: max-age=60` header mean?",
            options: [
              "The browser must revalidate every 60 requests",
              "The resource is fresh for 60 seconds",
              "The resource expires in 60 hours",
              "The server caches the response for 60 minutes",
            ],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "Which CSS property creates a new stacking context?",
            options: ["display: block", "position: static", "opacity: 0.99", "color: red"],
            answer: 2,
          },
          {
            id: "q4",
            prompt: "Which selector has the highest specificity?",
            options: [".btn .primary", "#submit", "button[type=submit]", "button"],
            answer: 1,
          },
          {
            id: "q5",
            prompt: "What is the default `position` value?",
            options: ["relative", "absolute", "static", "fixed"],
            answer: 2,
          },
        ]),
      },
      {
        title: "Algorithms Essentials",
        slug: "algorithms-essentials",
        category: "ALGORITHMS",
        questions: JSON.stringify([
          {
            id: "q1",
            prompt: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "Which data structure is best for a LIFO queue?",
            options: ["Queue", "Stack", "Heap", "Trie"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "Quicksort worst-case time complexity is:",
            options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
            answer: 2,
          },
          {
            id: "q4",
            prompt: "Which structure supports O(1) amortized append and O(1) amortized pop?",
            options: ["Linked list", "Dynamic array", "Binary tree", "Hash map"],
            answer: 1,
          },
        ]),
      },
      {
        title: "Systems & Networking",
        slug: "systems-networking",
        category: "SYSTEMS",
        questions: JSON.stringify([
          {
            id: "q1",
            prompt: "Which port does HTTPS use by default?",
            options: ["80", "443", "8080", "22"],
            answer: 1,
          },
          {
            id: "q2",
            prompt: "What does TCP three-way handshake establish?",
            options: ["A UDP connection", "A reliable session", "A DNS lookup", "A TLS certificate"],
            answer: 1,
          },
          {
            id: "q3",
            prompt: "Which is NOT a load-balancing algorithm?",
            options: ["Round-robin", "Least-connections", "IP-hash", "DNS-ping"],
            answer: 3,
          },
          {
            id: "q4",
            prompt: "Which caching strategy serves stale data while revalidating in the background?",
            options: ["Write-through", "Cache-aside", "Stale-while-revalidate", "Write-behind"],
            answer: 2,
          },
        ]),
      },
    ];
    for (const q of quizzes) await prisma.quiz.create({ data: q });
    console.log(`Created ${quizzes.length} quizzes.`);
  } else {
    console.log(`Quizzes already exist (${existingQuizzes}). Skipping.`);
  }

  // ---- Announcements ----
  const existingAnnouncements = await prisma.announcement.count();
  if (existingAnnouncements === 0) {
    const announcements = [
      {
        title: "Hackathon Atlas registration is open",
        body: "Registration for Hackathon Atlas — 48h Build is now open. We have capacity for 80 builders across 12 teams. Apply early — spots fill fast. Meals, coffee, and mentorship are provided. Bring a laptop, an idea, and an engineering mindset.",
        category: "EVENT",
        pinned: true,
        authorId: admin.id,
      },
      {
        title: "New Rust track in the Learning Hub",
        body: "We have added a Rust systems track to the Learning Hub, including a 3-hour hands-on workshop on November 5th. Members who complete the workshop and the linked tutorial will receive a track badge on their profile.",
        category: "LEARNING",
        pinned: false,
        authorId: lead.id,
      },
      {
        title: "Project submissions open for the fall cohort",
        body: "Members can now submit project proposals for the fall cohort via the Member Dashboard. Proposals are reviewed by leads every Friday. Approved projects receive a dedicated repository in the TechHub GitHub org and a small infrastructure budget.",
        category: "CLUB",
        pinned: false,
        authorId: admin.id,
      },
    ];
    for (const a of announcements) await prisma.announcement.create({ data: a });
    console.log(`Created ${announcements.length} announcements.`);
  } else {
    console.log(`Announcements already exist (${existingAnnouncements}). Skipping.`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

# TechHub EMSI Fès — How to Run Locally

## Prerequisites
- Node.js 18+ or Bun
- A SQLite database (included, file-based)

## Steps

1. **Unzip the source code**
   ```
   unzip techhub-website-source.zip -d techhub
   cd techhub
   ```

2. **Install dependencies**
   ```
   npm install
   # or: bun install
   ```

3. **Set up the database**
   ```
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the database** (creates admin user + sample data)
   ```
   node scripts/seed.js
   # or: bun run scripts/seed.ts
   ```

5. **Start the dev server**
   ```
   npm run dev
   # or: bun run dev
   ```

6. **Open http://localhost:3000**

## Demo Accounts
- admin@techhub-emsi.ma / techhub2024 (admin)
- lead@techhub-emsi.ma / lead2024 (lead)

## Email Setup (optional)
To send real emails, add these to your .env file:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="TechHub EMSI Fès <your-email@gmail.com>"
```
Without SMTP config, emails use a test account (Ethereal) and won't actually send.

## Tech Stack
- Next.js 16 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM + SQLite
- nodemailer for emails
- PWA (installable on mobile/desktop)
- i18n (English/French)

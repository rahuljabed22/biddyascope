# BiddyaScope — Selective HSC Science Home Tutor Platform

BiddyaScope is a full-stack Next.js (App Router) web application for selective HSC Science home tutoring (**Physics, Chemistry, Higher Math, Biology**) by vetted 3rd & 4th year students from **KUET** and **Khulna Medical College**.

## Features
- **Bilingual Landing Page (বাংলা / English)**: Highlights the anti-tuition-media philosophy, verified KUET & Khulna Medical College mentor roster, active HSC Science subjects, and student home-tutor application form with a dynamic backend-driven subject dropdown.
- **Visitor Analytics & IP Tracking**: Captures client IP (`x-forwarded-for` / `cf-connecting-ip` / `x-real-ip`), Vercel geo location (`city`, `region`, `country`), device type, OS, browser, path, and referrer.
- **Full Admin Dashboard (`/admin`)**:
  - **Views & IP Analytics**: Total views, unique IPs, today's traffic, 14-day chart, top visiting IPs, and searchable live IP log table.
  - **Student Applications**: Filter/search applications, update status, assign a selective mentor, and save internal notes.
  - **Subjects Dropdown Manager**: Add, edit, enable/disable, or delete subjects directly from the backend — updates the student form dropdown immediately.
  - **Selective Tutors Manager**: Add, edit, hide, or remove KUET / Khulna Medical mentors.
  - **Site Content CMS**: Edit hero headlines, philosophy copy, announcement banner, service area, and contact details live.

## Environment Variables
Copy `.env.example` to `.env.local` for local development or set in **Vercel Project Settings -> Environment Variables**:
- `ADMIN_PASSWORD`: Password for `/admin` (defaults to `biddyascope-admin-2026` if unset — change in production!).
- `SESSION_SECRET`: Strong random string for signing admin session cookies.
- `DATABASE_URL`: PostgreSQL connection string (e.g., Neon or Supabase via Vercel Marketplace). When omitted locally, data is stored in `.data/biddyascope.json`.

## Local Development
```bash
npm install
npm run dev
```

## Deploying to Vercel & Custom Domain
1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Attach a free PostgreSQL database (Neon/Supabase) in Vercel Storage so `DATABASE_URL` is populated automatically, and set `ADMIN_PASSWORD` + `SESSION_SECRET`.
4. Add your custom domain in **Vercel Project Settings -> Domains** and update your DNS records as instructed by Vercel.

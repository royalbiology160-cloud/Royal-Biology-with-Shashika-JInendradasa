# Royal Biology – Premium Online Biology LMS

**Website:** Royal Biology  
**Only Course:** 2027 Revision  
**Target:** Sri Lankan G.C.E. A/L Biology students  
**Language:** Sinhala (primary)  
**Theme:** White + Emerald Green (`#087B4C`)

## Features Included

- Public homepage (Sinhala)
- Student registration & login (Supabase Auth)
- Unique Student ID generation
- Student Dashboard with sidebar (DM Education inspired layout)
- Single course: **2027 Revision**
- Payment system (bank transfer + receipt upload + admin approval)
- Server-side payment access control for recordings
- Live classes listing
- AI Biology Tutor (Google Gemini) with credits system
- Admin panel with stats
- Notifications-ready schema
- Row Level Security (RLS) foundation
- Responsive design

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL + Storage)
- Lucide Icons
- Google Gemini API

## Setup Instructions

### 1. Install dependencies

```bash
cd royal-biology
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **SQL Editor** and run the entire content of `supabase/schema.sql`.
3. Create a Storage bucket named `payment-receipts` (private).
4. (Optional) Create bucket for video recordings (private).

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

### 4. Create first Admin user

1. Register a normal student via the website.
2. In Supabase Table Editor → `profiles` → change that user’s `role` to `admin`.
3. Also insert a row into `admins` table with the same `id`.

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Important Notes

- **Only one class** exists: 2027 Revision. Do not create other batches.
- Recordings must be protected by `hasActivePayment()` on the server before issuing signed URLs.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to the client.
- Expand RLS policies for production (especially admin write access).
- Update bank details and monthly fee in the Payments page / settings table.
- Teacher photo and contact info can be managed via Admin Settings.

## Project Structure

```
src/
  app/
    (auth)/login, register
    (student)/dashboard/...
    (admin)/admin/...
    api/ai
  components/layout, ui, dashboard
  lib/supabase, payments, utils
  types
supabase/schema.sql
```

## Next Modules to Expand

1. Full Recorded Lessons player with signed URLs
2. Exam creation + taking + auto MCQ marking
3. Notes upload + PDF viewer
4. Admin payment approve/reject UI
5. Attendance marking
6. Leaderboard
7. More complete RLS + audit logs

---

Built for production use as a premium Sri Lankan Biology education platform.

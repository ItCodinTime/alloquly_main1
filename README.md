# Alloquly · Neuroinclusive Assignment Studio

Production-ready Next.js app for teachers to remodel, assign, and grade work with AI while keeping student privacy intact.

## What’s inside
- **Auth**: Google OAuth via Supabase
- **Teacher tools**: Assignment remodeler, AI grader, class roster + join codes, insights
- **Student tools**: Dashboard, mission workspace, join-by-code onboarding
- **APIs**: `/api/remodel`, `/api/grade`, `/api/assignments`, `/api/students`, `/api/join-class`, `/api/submissions`
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind 4, Supabase (Postgres + RLS), OpenAI (gpt-4o-mini), Vercel

## Project map
```
app/              # Routes + pages
  api/            # Edge/server routes (OpenAI, Supabase)
  (teacher)/...   # Teacher flows
  (student)/...   # Student flows
components/       # UI + feature blocks (grader, remodeler, join form, etc.)
lib/              # Supabase clients, mocks, services
supabase/         # schema.sql and config
```

## Quickstart (local)
```bash
git clone <your-repo-url>
cd alloquly_main1
npm install
cp .env.example .env.local  # fill values
npm run dev
# open http://localhost:3000
```

### Environment variables
Set in `.env.local` and Vercel:
```
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ALLOQULY_AI_API_KEY=
```
Secrets stay server-side; anon keys are safe for the browser.

### Supabase setup
1) Create project → SQL Editor → run `supabase/schema.sql`  
2) Auth → Providers → enable Google; redirect: `https://your-app.vercel.app/auth/callback` (and localhost for dev)  
3) Settings → API: copy URL, anon, service role keys into envs.  
4) Ensure RLS enabled on tables; add policies matching the schema.

### OpenAI
Create a key at platform.openai.com and set `ALLOQULY_AI_API_KEY`. Without it, AI remodel + grading routes return errors.

## Deployment (Vercel)
1) Push repo to GitHub.  
2) Import in Vercel; add env vars above to all environments.  
3) Deploy.  
4) In Supabase Auth → URL config: set Site URL + Redirects to your Vercel domain.  
5) Smoke test: login → remodel → save assignment → generate join code → student joins → grade submission.

## Testing & checks
- `npm run lint`
- Manual flows: auth, remodel + save, class code generation, student join, submission + grading, dashboards in light/dark, mobile viewport.
- Verify OpenAI and Supabase keys present in Vercel; confirm RLS blocks cross-user access.

## Production readiness (short checklist)
- Env vars set in Vercel; `.env.local` ignored by git.
- Supabase schema + RLS deployed; Google OAuth configured.
- OpenAI key funded; AI remodel + grading endpoints require it.
- Vercel build passes; no console errors on smoke test.
- Optional: enable Vercel Analytics; add Sentry/monitoring; set custom domain and update Supabase URLs.

## Notes on AI + onboarding
- Remodeling: `/api/remodel` (profile-aware JSON output; requires `ALLOQULY_AI_API_KEY`).  
- Grading: `/api/grade` (score + rubric + next steps; requires `ALLOQULY_AI_API_KEY`).  
- Student join: teachers generate codes (`/api/join-class` GET); students join with code/email/name (POST). Backed by Supabase tables (`classroom_codes`, `classes`, `students`, `class_students`)—ensure the schema is applied.

## License
MIT

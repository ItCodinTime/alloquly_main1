# Alloquy · Neuroinclusive Assignment Studio

Production-ready Next.js platform for AI-enhanced classrooms. Teachers remodel assignments, manage join codes, and grade with OpenAI while students join securely, submit work, and monitor progress.

## Features
- 🔐 **Supabase Auth + Google OAuth** with mandatory onboarding before dashboard access
- 🧑‍🏫 **Teacher workspace**: class management, Google Classroom–style join codes, email invites, AI assignment builder, AI grading, insights
- 🧑‍🎓 **Student workspace**: join via code or invite, view assignments, submit work, track grades + accommodations
- 🤖 **OpenAI integrations** (`/api/remodel`, `/api/grade`) with FERPA-aligned prompts and redaction
- 🗄️ **Supabase Postgres schema + RLS** covering profiles, classes, classroom codes, invitations, assignments, submissions, insights
- 🛡️ **Privacy defaults**: client uses anon key only, server routes use service role, no PII logged beyond IDs
- 🗑️ **Data rights tooling**: built-in export + deletion endpoints (`/api/profile/export`, `/api/profile/delete`) surfaced in dashboards

## Quick Start
```bash
git clone https://github.com/your-org/alloquly_main1.git
cd alloquly_main1
npm install
cp .env.example .env.local   # create and fill values (see below)
npm run dev
# open http://localhost:3000
```

### Environment variables
Set in `.env.local` and on Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=            # optional fallback for admin client
ALLOQULY_AI_API_KEY=     # OpenAI key (gpt-4o-mini compatible)
```

### Supabase setup
1. Create a Supabase project and enable the Google provider under **Authentication → Providers** with your OAuth client ID/secret.
2. Open the Supabase SQL editor, paste the contents of `supabase/schema.sql`, and run it. This creates all tables plus RLS policies described in the product spec.
3. Copy the project URL, anon key, and service-role key into the env vars above.

### OpenAI
Generate an API key at [platform.openai.com](https://platform.openai.com/), add billing, and set `ALLOQULY_AI_API_KEY`. Models are called from server routes only; no keys are exposed to the browser.

## Project structure
```
app/                     # Next.js App Router routes
  (teacher)/teacher/...  # teacher dashboard + classes
  (student)/student/...  # student dashboard
  api/                   # Supabase + OpenAI endpoints
components/              # shared + feature components
lib/                     # Supabase clients (server/admin)
supabase/schema.sql      # canonical database + RLS
```

## Security & privacy
- Row-level security restricts teachers to their own classes/assignments and students to their submissions.
- Classroom join codes are short-lived, regenerated via `/api/classes/[id]/code`, and email invites are issued via Supabase Auth admin APIs.
- OpenAI calls strip explicit identifiers and only send assignment/submission text. Feedback is persisted back into the `submissions` table with IDs only.
- Users can download or erase their data at any time from the dashboard privacy controls, handled via Supabase service-role routes.
- Middleware enforces: unauthenticated → `/auth/login`; authenticated but not onboarded → `/onboarding`; onboarded students → `/student/dashboard`; onboarded teachers → `/teacher/dashboard`.

## Deployment
Deploy on Vercel with `npm run build`. Provide the same env vars in the Vercel dashboard, ensure Supabase URL/keys match, and you’ll have a fully hosted, FERPA-aligned classroom platform.

# Alloquly - Neuroinclusive Assignment Studio

> 🎓 A production-ready Next.js application that helps educators create and adapt assignments for students with diverse learning needs (ADHD, Autism, dyslexia, etc.)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/alloquly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## Features

- 🔐 **Secure Authentication** - Google OAuth via Supabase Auth
- 🤖 **AI-Powered Remodeling** - OpenAI integration for assignment adaptation
- 👥 **Student Management** - Track students, accommodations, and progress
- 📊 **Real-time Insights** - Monitor focus, regulation, and learning patterns
- 🎨 **iOS-Inspired Dark UI** - Sleek, accessible interface optimized for all devices
- 🔒 **Privacy-First** - All data stays in your Vercel deployment

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/alloquly)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd alloquly_main1
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add authorized redirect URL: `https://your-domain.vercel.app/auth/callback`

### 3. Get OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add credits to your account

### 4. Configure Environment Variables

Create `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
ALLOQULY_AI_API_KEY=your-openai-api-key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Deploy via CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy!

### Required Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOQULY_AI_API_KEY`

## Project Structure

```
alloquly_main1/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── assignments/      # Assignment management
│   ├── students/         # Student roster
│   ├── insights/         # Analytics dashboard
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utilities and clients
├── supabase/            # Database schema
└── public/              # Static assets
```

## Key Features Explained

### Assignment Remodeling
- Upload assignments via text or file
- Select learner profiles (ADHD, Autism, Dyslexia, Custom)
- AI generates adapted versions with accommodations
- Save to database for reuse

### Student Management
- Add students with Gmail addresses
- Assign support plans
- Track real-time status
- Generate secure invite links

### AI Insights
- Monitor focus capacity
- Track reading load
- Detect regulation signals
- Export compliance reports

## Security & Privacy

- OAuth 2.0 authentication
- Row-level security in Supabase
- No student data stored on devices
- All AI processing on Vercel edge
- Audit logging available

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **Language**: TypeScript

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT

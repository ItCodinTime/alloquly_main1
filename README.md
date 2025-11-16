# Alloquly - Neuroinclusive Assignment Studio

> 🎓 A production-ready Next.js application that helps educators create and adapt assignments for students with diverse learning needs (ADHD, Autism, dyslexia, etc.)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/alloquly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## Table of Contents
- [Features](#features)
- [Quick Start](#quick-start)
- [Deployment Guide](#deployment-guide)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Troubleshooting](#troubleshooting)
- [Security & Privacy](#security--privacy)
- [License](#license)

## Features

- 🔐 **Secure Authentication** - Google OAuth via Supabase Auth
- 🤖 **AI-Powered Remodeling** - OpenAI integration for assignment adaptation
- 👥 **Student Management** - Track students, accommodations, and progress
- 📊 **Real-time Insights** - Monitor focus, regulation, and learning patterns
- 🎨 **iOS-Inspired Dark UI** - Sleek, accessible interface optimized for all devices
- 🔒 **Privacy-First** - All data stays in your Vercel deployment

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd alloquly_main1
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
ALLOQULY_AI_API_KEY=your-openai-api-key
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment Guide

### Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- OpenAI account with API access

### Step 1: Set Up Supabase

#### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com/)
2. Click "New Project"
3. Choose organization and set:
   - Project name: `alloquly`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

#### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables created: Go to **Table Editor** and see `assignments`, `students`, `submissions`, `insights`

#### 1.3 Configure Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle "Enable Sign in with Google"
4. Get Google OAuth Credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable **Google+ API**
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Configure consent screen if prompted
   - Application type: **Web application**
   - Add authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
   - Paste into Supabase Google provider settings
   - Save

#### 1.4 Get Supabase API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` `public` key
   - `service_role` `secret` key

### Step 2: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create new secret key"
5. Name it "Alloquly"
6. Copy the key (starts with `sk-`)
7. **Important**: Add credits to your account (Billing → Add payment method)

### Step 3: Deploy to Vercel

#### Option 1: Deploy via GitHub

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Alloquly production ready"
   git remote add origin https://github.com/yourusername/alloquly.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com/)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js

#### Option 2: Deploy via CLI

```bash
npm install -g vercel
vercel
```

#### Configure Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
ALLOQULY_AI_API_KEY=sk-...
```

**Important**: Add these to all environments (Production, Preview, Development)

#### Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. You'll get a URL like `https://alloquly-xxx.vercel.app`

### Step 4: Update Supabase Redirect URLs

1. Go back to Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

### Step 5: Test Your Deployment

#### Test Authentication
1. Visit your Vercel URL
2. Click "Login" in header
3. Click "Continue with Google"
4. Sign in with Google account
5. Should redirect to `/assignments`

#### Test AI Remodeling
1. Go to Assignments page
2. Paste sample assignment text
3. Select a learner profile
4. Click "Generate neuroinclusive version"
5. Should see AI-generated accommodations

#### Test Database
1. Click "Save to Supabase"
2. Go to Supabase dashboard → Table Editor → `assignments`
3. Should see your saved assignment

## Environment Setup

### Required Environment Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `ALLOQULY_AI_API_KEY` | OpenAI API key | platform.openai.com → API Keys |

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables
3. Never commit `.env.local` to version control
4. Run `npm run dev` to start development server

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
├── supabase/             # Database schema
├── public/               # Static assets
├── .env.example          # Environment variables template
└── vercel.json           # Vercel configuration
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **Language**: TypeScript

## Troubleshooting

### Vercel Deployment Failing

**Common Issues:**

1. **Missing Environment Variables**
   - Verify all 4 environment variables are set in Vercel
   - Check for extra spaces or quotes
   - Ensure they're added to all environments

2. **Build Errors**
   - Check Node.js version (should be 18+)
   - Run `npm run build` locally first
   - Check Vercel build logs for specific errors

3. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check that database schema has been run
   - Ensure RLS policies are enabled

### Authentication Not Working

- Check Supabase redirect URLs match your domain exactly
- Verify Google OAuth credentials are correct
- Check browser console for errors
- Ensure cookies are enabled

### AI Generation Failing

- Verify `ALLOQULY_AI_API_KEY` is set correctly in Vercel
- Check OpenAI account has credits
- Look at Vercel function logs for errors
- Test with mock data (works without API key)

### Database Errors

- Verify all environment variables are set
- Check Supabase SQL Editor for schema errors
- Ensure RLS policies are enabled
- Check Vercel function logs

## Security & Privacy

### Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ `.env.local` in `.gitignore`
- ✅ Supabase RLS policies enabled
- ✅ Google OAuth configured correctly
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Service role key only used server-side

### Privacy Features

- OAuth 2.0 authentication
- Row-level security in Supabase
- No student data stored on devices
- All AI processing on Vercel edge
- Audit logging available
- All data stays in your deployment

## Monitoring & Maintenance

### View Logs

- **Vercel**: Project → Deployments → Click deployment → Functions tab
- **Supabase**: Project → Logs → Select log type

### Monitor Usage

- **OpenAI**: platform.openai.com → Usage
- **Supabase**: Dashboard → Reports
- **Vercel**: Project → Analytics

### Update Environment Variables

1. Vercel project → Settings → Environment Variables
2. Edit variable
3. Redeploy for changes to take effect

## Custom Domain (Optional)

1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with new domain

## Support

For issues or questions:

1. Check Vercel function logs
2. Check Supabase logs
3. Review browser console errors
4. Verify all environment variables
5. Test each feature individually
6. Open an issue on GitHub

## License

MIT License - see [LICENSE](LICENSE) file for details

---

**Congratulations!** 🎉 Your Alloquly instance is now ready to deploy. Follow the deployment guide above to get started.

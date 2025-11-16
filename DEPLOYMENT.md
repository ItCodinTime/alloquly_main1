# Alloquly Deployment Guide

Complete step-by-step guide to deploy Alloquly to Vercel with full functionality.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- OpenAI account with API access

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set:
   - Project name: `alloquly`
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify tables created: Go to **Table Editor** and see `assignments`, `students`, `submissions`, `insights`

### 1.3 Configure Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle "Enable Sign in with Google"
4. You'll need Google OAuth credentials:

#### Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Application type: **Web application**
7. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
8. Copy **Client ID** and **Client Secret**
9. Paste into Supabase Google provider settings
10. Save

### 1.4 Get Supabase API Keys

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   - Project URL: `https://xxxxx.supabase.co`
   - `anon` `public` key
   - `service_role` `secret` key

## Step 2: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create new secret key"
5. Name it "Alloquly"
6. Copy the key (starts with `sk-`)
7. **Important**: Add credits to your account (Billing → Add payment method)

## Step 3: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Alloquly production ready"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/alloquly.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 4.2 Configure Environment Variables

Before deploying, click "Environment Variables" and add:

```bash
# Supabase (use values from Step 1.4)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI (use value from Step 2)
ALLOQULY_AI_API_KEY=sk-...
```

**Important**: 
- Add these to all environments (Production, Preview, Development)
- Double-check no extra spaces or quotes

### 4.3 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. You'll get a URL like `https://alloquly-xxx.vercel.app`

## Step 5: Update Supabase Redirect URLs

1. Go back to Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## Step 6: Test Your Deployment

### 6.1 Test Authentication

1. Visit your Vercel URL
2. Click "Login" in header
3. Click "Continue with Google"
4. Sign in with Google account
5. Should redirect to `/assignments`

### 6.2 Test AI Remodeling

1. Go to Assignments page
2. Paste sample assignment text
3. Select a learner profile
4. Click "Generate neuroinclusive version"
5. Should see AI-generated accommodations

### 6.3 Test Database

1. Click "Save to Supabase"
2. Go to Supabase dashboard → Table Editor → `assignments`
3. Should see your saved assignment

### 6.4 Test Student Management

1. Go to Students page
2. Add a student with Gmail
3. Check Supabase → `students` table
4. Should see the student record

## Step 7: Custom Domain (Optional)

1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with new domain

## Troubleshooting

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

### Build Failures

- Check Node.js version (should be 18+)
- Verify all dependencies installed
- Look at Vercel build logs
- Try `npm run build` locally first

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

## Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ `.env.local` in `.gitignore`
- ✅ Supabase RLS policies enabled
- ✅ Google OAuth configured correctly
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Service role key only used server-side

## Performance Optimization

- Enable Vercel Analytics for monitoring
- Use Vercel Edge Functions for faster response
- Enable Supabase connection pooling
- Monitor OpenAI token usage

## Support

If you encounter issues:

1. Check Vercel function logs
2. Check Supabase logs
3. Review browser console errors
4. Verify all environment variables
5. Test each feature individually

## Next Steps

- Add custom domain
- Set up monitoring alerts
- Configure backup strategy
- Add team members in Vercel
- Customize branding and content

---

**Congratulations!** 🎉 Your Alloquly instance is now live and ready for educators to use.

# Alloquly Quick Start Guide

Get Alloquly running in 10 minutes.

## 🚀 Fastest Path to Production

### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/alloquly)

Click the button above and follow these steps:

1. **Import Repository**
   - Vercel will clone the repo to your GitHub
   - Click "Create" to continue

2. **Add Environment Variables** (Don't deploy yet!)
   - Click "Environment Variables"
   - Add these 4 variables (get values from steps below):
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     ALLOQULY_AI_API_KEY
     ```

### 2. Get Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for project creation
3. Go to **SQL Editor** → New Query
4. Copy/paste contents of `supabase/schema.sql` → Run
5. Go to **Settings** → **API**
6. Copy these values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Get OpenAI API Key (1 minute)

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key → `ALLOQULY_AI_API_KEY`
4. Add payment method in Billing (required for API to work)

### 4. Configure Google OAuth (3 minutes)

1. In Supabase: **Authentication** → **Providers** → **Google**
2. Toggle "Enable"
3. Go to [console.cloud.google.com](https://console.cloud.google.com)
4. Create project → Enable Google+ API
5. **Credentials** → **Create OAuth 2.0 Client ID**
6. Add redirect URI: `https://[your-supabase-ref].supabase.co/auth/v1/callback`
7. Copy Client ID & Secret to Supabase
8. Save

### 5. Deploy!

1. Back in Vercel, paste all 4 environment variables
2. Click "Deploy"
3. Wait 2-3 minutes
4. Get your URL: `https://your-app.vercel.app`

### 6. Final Configuration (1 minute)

1. In Supabase: **Authentication** → **URL Configuration**
2. Add Site URL: `https://your-app.vercel.app`
3. Add Redirect URL: `https://your-app.vercel.app/auth/callback`
4. Save

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Click "Login"
3. Sign in with Google
4. Go to Assignments
5. Generate an AI-remodeled assignment
6. Save it
7. Check Supabase → Table Editor → assignments table

**Success!** 🎉 You're live.

## 🔧 Local Development (Optional)

```bash
# Clone
git clone <your-repo>
cd alloquly_main1

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your values

# Run
npm run dev
```

Visit http://localhost:3000

## 📚 Next Steps

- [ ] Add custom domain in Vercel
- [ ] Invite team members
- [ ] Customize branding
- [ ] Set up monitoring
- [ ] Read full [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 Troubleshooting

**Login not working?**
- Check Supabase redirect URLs match your domain exactly
- Verify Google OAuth credentials

**AI not generating?**
- Check OpenAI API key in Vercel env vars
- Verify OpenAI account has credits
- Check Vercel function logs

**Database errors?**
- Verify schema.sql ran successfully
- Check all env vars are set
- Look at Supabase logs

## 💡 Pro Tips

- Use Vercel preview deployments for testing
- Monitor OpenAI usage to control costs
- Enable Supabase connection pooling for better performance
- Set up Vercel Analytics for insights

## 📖 Full Documentation

- [Complete Deployment Guide](./DEPLOYMENT.md)
- [Testing Checklist](./TESTING.md)
- [README](./README.md)

---

**Need help?** Open an issue on GitHub or check the logs in Vercel/Supabase.

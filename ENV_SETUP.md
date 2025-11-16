# Environment Variables Setup Guide

Complete guide to configuring all environment variables for Alloquly.

## Required Environment Variables

### 1. NEXT_PUBLIC_SUPABASE_URL

**What it is**: Your Supabase project URL  
**Where to get it**: Supabase Dashboard → Settings → API → Project URL  
**Format**: `https://xxxxxxxxxxxxx.supabase.co`  
**Used for**: Client-side and server-side Supabase connections

**Example**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

**What it is**: Your Supabase anonymous/public API key  
**Where to get it**: Supabase Dashboard → Settings → API → anon public  
**Format**: Long JWT token starting with `eyJ`  
**Used for**: Client-side Supabase authentication and queries (respects RLS)

**Example**:
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: This key is safe to expose in client-side code because it respects Row Level Security policies.

### 3. SUPABASE_SERVICE_ROLE_KEY

**What it is**: Your Supabase service role key (admin access)  
**Where to get it**: Supabase Dashboard → Settings → API → service_role secret  
**Format**: Long JWT token starting with `eyJ`  
**Used for**: Server-side admin operations (bypasses RLS)

**Example**:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: ⚠️ NEVER expose this key in client-side code. Only use in API routes and server components.

### 4. ALLOQULY_AI_API_KEY

**What it is**: Your OpenAI API key  
**Where to get it**: OpenAI Platform → API Keys → Create new secret key  
**Format**: Starts with `sk-`  
**Used for**: AI-powered assignment remodeling

**Example**:
```bash
ALLOQULY_AI_API_KEY=sk-proj-abc123def456ghi789...
```

**Security Note**: ⚠️ Keep this secret. Monitor usage to control costs.

## Setup Instructions

### Local Development

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`**:
   ```bash
   # Open in your editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Paste your values**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ALLOQULY_AI_API_KEY=sk-proj-...
   ```

4. **Verify**:
   ```bash
   npm run dev
   ```
   Check http://localhost:3000 - you should see "AI key detected" banner.

### Vercel Deployment

1. **Via Vercel Dashboard**:
   - Go to your project
   - Settings → Environment Variables
   - Add each variable:
     - Name: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://your-project.supabase.co`
     - Environments: ✅ Production ✅ Preview ✅ Development
   - Repeat for all 4 variables

2. **Via Vercel CLI**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # Paste value when prompted
   # Select environments: Production, Preview, Development
   
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add ALLOQULY_AI_API_KEY
   ```

3. **Redeploy** (if already deployed):
   ```bash
   vercel --prod
   ```

## Verification Checklist

### ✅ Supabase Connection
```bash
# Test locally
npm run dev
```
- Visit http://localhost:3000
- Check browser console for Supabase errors
- Try logging in
- Check Supabase Dashboard → Logs for connection attempts

### ✅ OpenAI Integration
- Go to Assignments page
- Generate an AI remodel
- Should see "openai" as source (not "mock")
- Check Vercel function logs for API calls
- Check OpenAI Dashboard → Usage for API calls

### ✅ Authentication
- Click Login
- Should redirect to Google
- After auth, should redirect back
- Check Supabase Dashboard → Authentication → Users

### ✅ Database Operations
- Add a student
- Check Supabase Dashboard → Table Editor → students
- Should see new row with your user_id

## Troubleshooting

### "AI key missing" banner shows

**Problem**: `ALLOQULY_AI_API_KEY` not set or incorrect

**Solutions**:
1. Check spelling of variable name (exact match required)
2. Verify key starts with `sk-`
3. Check key is valid in OpenAI dashboard
4. Restart dev server: `npm run dev`
5. In Vercel: redeploy after adding variable

### "Supabase URL missing" error

**Problem**: `NEXT_PUBLIC_SUPABASE_URL` not set

**Solutions**:
1. Check variable name has `NEXT_PUBLIC_` prefix
2. Verify URL format: `https://xxxxx.supabase.co`
3. No trailing slash in URL
4. Restart dev server

### Authentication not working

**Problem**: Supabase keys incorrect or OAuth not configured

**Solutions**:
1. Verify both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. Check keys are from same Supabase project
3. Verify Google OAuth configured in Supabase
4. Check redirect URLs match your domain

### Database operations failing

**Problem**: RLS policies or service role key issue

**Solutions**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
2. Check RLS policies enabled in Supabase
3. Verify schema.sql ran successfully
4. Check Supabase logs for specific errors

### AI generation returns mock data

**Problem**: OpenAI API key invalid or no credits

**Solutions**:
1. Verify `ALLOQULY_AI_API_KEY` is correct
2. Check OpenAI account has credits (Billing)
3. Verify API key is active (not revoked)
4. Check Vercel function logs for specific error
5. Check OpenAI Dashboard → Usage for rate limits

## Security Best Practices

### ✅ DO:
- Store all keys in environment variables
- Use different keys for development and production
- Rotate keys periodically
- Monitor API usage
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore`
- Use Vercel's encrypted environment variables

### ❌ DON'T:
- Commit `.env.local` to git
- Share keys in Slack/email
- Use production keys in development
- Expose service role key in client code
- Hard-code keys in source code
- Share screenshots with visible keys

## Key Rotation

If you need to rotate keys:

### Supabase Keys
1. Can't rotate - tied to project
2. Create new project if compromised
3. Migrate data to new project

### OpenAI Key
1. OpenAI Dashboard → API Keys
2. Revoke old key
3. Create new key
4. Update in Vercel immediately
5. Redeploy

### Google OAuth
1. Google Cloud Console → Credentials
2. Create new OAuth client
3. Update in Supabase
4. Old credentials stop working immediately

## Cost Monitoring

### OpenAI Costs
- Monitor: platform.openai.com → Usage
- Set limits: platform.openai.com → Billing → Usage limits
- Typical cost: ~$0.01 per assignment remodel
- Budget: Set monthly limit

### Supabase Costs
- Free tier: 500MB database, 2GB bandwidth
- Monitor: Supabase Dashboard → Reports
- Upgrade if needed: Supabase Dashboard → Billing

### Vercel Costs
- Free tier: 100GB bandwidth, 100 hours compute
- Monitor: Vercel Dashboard → Usage
- Upgrade if needed: Vercel Dashboard → Settings → Billing

## Environment-Specific Configuration

### Development
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=dev-service-key
ALLOQULY_AI_API_KEY=sk-dev-key
```

### Staging (Vercel Preview)
- Use same keys as production OR
- Use separate Supabase project for staging
- Use separate OpenAI key with lower limits

### Production
- Use production Supabase project
- Use production OpenAI key
- Monitor usage closely
- Set up alerts

## Quick Reference

| Variable | Prefix | Where Used | Secret? |
|----------|--------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Client + Server | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client + Server | No* |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | Server Only | ✅ Yes |
| `ALLOQULY_AI_API_KEY` | ❌ | Server Only | ✅ Yes |

*Safe to expose because RLS protects data

## Support

Need help with environment variables?

1. Check Vercel function logs
2. Check Supabase logs
3. Check browser console
4. Review this guide
5. Open GitHub issue

---

**Last Updated**: 2024  
**Version**: 1.0

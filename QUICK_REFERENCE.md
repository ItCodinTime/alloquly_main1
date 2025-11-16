# Alloquly Quick Reference Card

## 🚀 Deploy in 3 Commands

```bash
# 1. Deploy to Vercel
vercel

# 2. Add environment variables (in Vercel dashboard)
# See ENV_SETUP.md for values

# 3. Configure Supabase
# Run schema.sql, enable Google OAuth, add redirect URLs
```

## 🔑 Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ALLOQULY_AI_API_KEY=sk-proj-...
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Database schema - run in Supabase SQL Editor |
| `.env.example` | Template for environment variables |
| `middleware.ts` | Route protection |
| `app/api/remodel/route.ts` | AI generation endpoint |
| `app/auth/login/page.tsx` | Login page |

## 🔗 Important URLs

### Development
- Local: `http://localhost:3000`
- Login: `http://localhost:3000/auth/login`

### Production
- Your app: `https://your-app.vercel.app`
- Supabase: `https://app.supabase.com`
- Vercel: `https://vercel.com/dashboard`
- OpenAI: `https://platform.openai.com`

## 📚 Documentation

| Guide | When to Use |
|-------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | First time setup (10 min) |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Detailed deployment steps |
| [ENV_SETUP.md](./ENV_SETUP.md) | Environment variable help |
| [TESTING.md](./TESTING.md) | Before going live |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Launch day |

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Test production build
npm run lint             # Check for errors

# Deployment
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
vercel env add           # Add environment variable
vercel logs              # View function logs

# Database
# Run in Supabase SQL Editor
# Copy/paste from supabase/schema.sql
```

## 🔍 Troubleshooting Quick Fixes

### Login not working
```bash
# Check Supabase redirect URLs
# Should be: https://your-app.vercel.app/auth/callback
```

### AI not generating
```bash
# Check OpenAI key in Vercel
vercel env ls

# Check OpenAI credits
# Visit: platform.openai.com/usage
```

### Database errors
```bash
# Verify schema ran
# Check Supabase → Table Editor → assignments, students tables exist

# Check RLS enabled
# Supabase → Authentication → Policies
```

## 📊 Monitoring

### Check Logs
```bash
# Vercel function logs
vercel logs --follow

# Or in dashboard:
# Vercel → Project → Deployments → Functions
```

### Check Usage
- **OpenAI**: platform.openai.com → Usage
- **Supabase**: Dashboard → Reports
- **Vercel**: Dashboard → Analytics

## 🔐 Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS enabled
- [ ] Google OAuth configured
- [ ] Service role key only used server-side

## 🎯 Feature Checklist

- [x] Authentication (Google OAuth)
- [x] AI generation (OpenAI)
- [x] Database (Supabase)
- [x] Student management
- [x] Assignment remodeling
- [x] Insights dashboard
- [x] Responsive UI
- [x] Dark theme

## 📞 Get Help

1. Check relevant guide in docs/
2. Review Vercel function logs
3. Check Supabase logs
4. Check browser console
5. Open GitHub issue

## 💡 Pro Tips

- Use Vercel preview deployments for testing
- Set OpenAI usage limits to control costs
- Enable Supabase connection pooling
- Monitor error rates in Vercel
- Keep dependencies updated

## 🎓 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel

## 📈 Success Metrics

- **Uptime**: 99.9%+
- **Page Load**: < 2s
- **AI Response**: < 10s
- **Error Rate**: < 1%

## 🔄 Update Checklist

When updating:
- [ ] Test locally first
- [ ] Check for breaking changes
- [ ] Update dependencies
- [ ] Run build test
- [ ] Deploy to preview
- [ ] Test preview
- [ ] Deploy to production
- [ ] Monitor logs

---

**Quick Links**:
- [Full README](./README.md)
- [Quick Start](./QUICKSTART.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Summary](./SUMMARY.md)

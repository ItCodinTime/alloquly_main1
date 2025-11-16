# Alloquly Testing Checklist

Complete testing guide to ensure everything works before going live.

## Pre-Deployment Tests (Local)

### 1. Environment Setup
- [ ] `.env.local` file created with all required variables
- [ ] All environment variables have valid values
- [ ] No syntax errors in `.env.local`

### 2. Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings (critical ones)

### 3. Local Development
```bash
npm run dev
```
- [ ] Server starts on http://localhost:3000
- [ ] No console errors on page load
- [ ] All pages render correctly

## Authentication Tests

### Google OAuth Flow
- [ ] Click "Login" button
- [ ] Redirects to Google sign-in
- [ ] Can select Google account
- [ ] Redirects back to app after auth
- [ ] User sees "Logout" button after login
- [ ] User email/name displayed (if implemented)
- [ ] Logout button works
- [ ] After logout, redirects to home page

### Protected Routes
- [ ] Cannot access `/assignments` without login
- [ ] Cannot access `/students` without login
- [ ] Cannot access `/insights` without login
- [ ] Redirects to login page when accessing protected routes
- [ ] After login, redirects back to intended page

## Assignment Features

### Create Assignment
- [ ] Can paste text into assignment field
- [ ] Character counter updates correctly
- [ ] Can select different learner profiles
- [ ] Profile description updates when selected
- [ ] "Generate" button disabled when text too short
- [ ] "Generate" button shows loading state

### AI Remodeling
- [ ] Click "Generate neuroinclusive version"
- [ ] Loading indicator appears
- [ ] AI response appears within 10 seconds
- [ ] Response includes summary
- [ ] Response includes accommodations (3-5 items)
- [ ] Response includes missions (3-4 items)
- [ ] Source shows "openai" (not "mock")

### Save Assignment
- [ ] "Save to Supabase" button enabled after generation
- [ ] Click save button
- [ ] Success message appears
- [ ] Assignment appears in Supabase dashboard
- [ ] Assignment has correct user_id

### File Upload (if implemented)
- [ ] Can click "Attach file" button
- [ ] File picker opens
- [ ] Can select .pdf, .doc, .docx, .txt files
- [ ] File name displays after selection

## Student Management

### Add Student
- [ ] Can enter student name
- [ ] Can enter Gmail address
- [ ] Can select support plan
- [ ] Form validation works (requires Gmail)
- [ ] Click "Add student"
- [ ] Student appears in list immediately
- [ ] Student saved to Supabase
- [ ] Student has correct user_id

### Student List
- [ ] All students display correctly
- [ ] Student names visible
- [ ] Email addresses visible
- [ ] Profile types visible
- [ ] Status badges visible with correct colors

### Update Student Status
- [ ] Click on student card
- [ ] Status cycles through options
- [ ] Status updates in UI immediately
- [ ] Status updates in Supabase
- [ ] Loading state shows during update

### Invite Link
- [ ] Invite link generates
- [ ] Link is unique
- [ ] Link updates when roster changes

## Insights Dashboard

### Metrics Display
- [ ] Focus capacity metric shows
- [ ] Reading load metric shows
- [ ] Regulation signals metric shows
- [ ] All metrics have values and deltas

### Time Range Toggle
- [ ] Can switch between Today/Week/Month
- [ ] Metrics update when range changes
- [ ] Correct data shows for each range

### Compliance Section
- [ ] IEP alignment status shows
- [ ] FERPA logging status shows
- [ ] Family summaries status shows

## UI/UX Tests

### Responsive Design
- [ ] Mobile view (375px width)
- [ ] Tablet view (768px width)
- [ ] Desktop view (1440px width)
- [ ] All buttons accessible on mobile
- [ ] Text readable on all screen sizes
- [ ] No horizontal scrolling

### Dark Theme
- [ ] All text readable against dark background
- [ ] Sufficient contrast ratios
- [ ] Borders visible but subtle
- [ ] Hover states work on all interactive elements

### Animations
- [ ] Smooth transitions on button hovers
- [ ] Page transitions smooth
- [ ] Loading spinners animate correctly
- [ ] No janky animations

### Accessibility
- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Buttons have clear labels
- [ ] Form inputs have labels
- [ ] Color not sole indicator of status

## Performance Tests

### Page Load
- [ ] Home page loads < 2 seconds
- [ ] Assignments page loads < 2 seconds
- [ ] Students page loads < 2 seconds
- [ ] Insights page loads < 2 seconds

### API Response Times
- [ ] AI remodel completes < 10 seconds
- [ ] Student save completes < 2 seconds
- [ ] Assignment save completes < 2 seconds
- [ ] Data fetch completes < 1 second

### Network
- [ ] Works on slow 3G connection
- [ ] Handles network errors gracefully
- [ ] Shows appropriate error messages

## Error Handling

### API Errors
- [ ] Shows error when OpenAI API fails
- [ ] Falls back to mock data when API unavailable
- [ ] Shows error when Supabase unavailable
- [ ] Error messages are user-friendly

### Form Validation
- [ ] Shows error for invalid email
- [ ] Shows error for missing required fields
- [ ] Validation messages clear and helpful

### Edge Cases
- [ ] Handles very long assignment text
- [ ] Handles special characters in text
- [ ] Handles rapid button clicks
- [ ] Handles concurrent requests

## Security Tests

### Authentication
- [ ] Cannot access API without auth
- [ ] Cannot view other users' data
- [ ] Session expires appropriately
- [ ] Logout clears session

### Data Privacy
- [ ] User can only see their own assignments
- [ ] User can only see their own students
- [ ] No PII exposed in URLs
- [ ] No sensitive data in console logs

### API Security
- [ ] API keys not exposed in client
- [ ] CORS configured correctly
- [ ] Rate limiting works (if implemented)

## Post-Deployment Tests (Vercel)

### Deployment
- [ ] Build succeeds on Vercel
- [ ] No build errors or warnings
- [ ] Environment variables set correctly
- [ ] All routes accessible

### Production URLs
- [ ] Home page loads: `https://your-app.vercel.app`
- [ ] Login works: `https://your-app.vercel.app/auth/login`
- [ ] Callback works: `https://your-app.vercel.app/auth/callback`
- [ ] All pages accessible after login

### Supabase Integration
- [ ] Auth callback URL configured correctly
- [ ] Can authenticate via production URL
- [ ] Database operations work
- [ ] RLS policies enforced

### OpenAI Integration
- [ ] AI generation works in production
- [ ] API key recognized
- [ ] Responses return successfully
- [ ] Error handling works

### Monitoring
- [ ] Check Vercel function logs
- [ ] Check Supabase logs
- [ ] No unexpected errors
- [ ] Response times acceptable

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Firefox Mobile

## Final Checks

- [ ] All features work end-to-end
- [ ] No console errors in production
- [ ] Analytics tracking works (if implemented)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate valid
- [ ] Favicon displays correctly
- [ ] Meta tags correct for SEO
- [ ] Social sharing preview looks good

## Sign-Off

- [ ] All critical tests passed
- [ ] All blockers resolved
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured

---

**Testing completed by**: _______________  
**Date**: _______________  
**Deployment URL**: _______________  
**Status**: ⬜ Ready for Production | ⬜ Needs Fixes

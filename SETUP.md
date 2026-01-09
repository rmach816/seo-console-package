# Quick Setup Guide

## Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works)
- GitHub account (for deployment)

## Step-by-Step Setup

### 1. Supabase Setup (5 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose organization, name your project
   - Set a database password (save it!)
   - Select a region close to you
   - Wait for project to be ready (~2 minutes)

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy:
     - `Project URL` (e.g., `https://xxxxx.supabase.co`)
     - `anon` `public` key

3. **Run Database Migrations**
   
   **Option A: Using Supabase Dashboard (Easiest)**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run
   - Copy contents of `supabase/migrations/002_seo_records_schema.sql`
   - Paste and run
   
   **Option B: Using Supabase CLI**
   ```bash
   npm install -g supabase
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

### 2. Local Development Setup

1. **Clone/Download the Project**
   ```bash
   git clone https://github.com/rmach816/seo-console-package.git
   cd seo-console-package
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open http://localhost:3000

5. **Test the Application**
   - Sign up for an account
   - Go to dashboard
   - Create an SEO record
   - Test validation features

### 3. GitHub Setup

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SEO Console Package"
   ```

2. **Connect to GitHub**
   ```bash
   git remote add origin https://github.com/rmach816/seo-console-package.git
   git branch -M main
   git push -u origin main
   ```

### 4. Deploy to Vercel (Recommended)

1. **Import to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import `rmach816/seo-console-package`

2. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - Deploy

3. **Update Supabase Auth Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Redirect URLs":
     - `https://your-app.vercel.app/auth/callback`
   - Set "Site URL" to: `https://your-app.vercel.app`
   - Save

4. **Test Deployment**
   - Visit your Vercel URL
   - Sign up/login should work
   - Test all features

## Verification Checklist

After deployment, verify:

- [ ] Can sign up for new account
- [ ] Can log in with existing account
- [ ] Dashboard loads and shows SEO records list
- [ ] Can create new SEO record
- [ ] Can edit existing SEO record
- [ ] Validation dashboard works
- [ ] Image preview works
- [ ] Example pages show correct metadata

## Troubleshooting

**"Invalid API key" error**
- Double-check environment variables in Vercel
- Ensure no extra spaces in values
- Redeploy after adding env vars

**"Redirect URL mismatch"**
- Check Supabase auth settings
- Ensure Vercel URL is added to redirect URLs
- Use exact URL format (with https://)

**Database errors**
- Verify migrations ran successfully
- Check Supabase project is active
- Review Supabase logs for errors

## Next Steps

- Customize the landing page (`app/page.tsx`)
- Add your branding/logo
- Configure custom domain (optional)
- Set up error monitoring (Sentry, etc.)
- Add analytics (optional)

## Support

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

# Deployment Guide

## Pre-Deployment Checklist

### ✅ Project Status
- [x] All tests passing (`npm run verify`)
- [x] Build successful (`npm run build`)
- [x] TypeScript checks passing
- [x] ESLint warnings resolved

## Setup Steps

### 1. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI (if not already installed)
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```
   
   Or manually run the SQL migrations:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seo_records_schema.sql`

3. **Generate TypeScript Types** (optional, already included)
   ```bash
   npx supabase gen types typescript --local > types/database.types.ts
   ```

### 2. Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

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

### 4. Deployment Options

#### Option A: Vercel (Recommended for Next.js)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

2. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy

3. **Update Supabase Auth Settings**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Redirect URLs"
   - Add your Vercel domain to "Site URL"

#### Option B: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Import from GitHub

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Add in Netlify dashboard

#### Option C: Self-Hosted

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Use a process manager** (PM2, systemd, etc.)
   ```bash
   npm install -g pm2
   pm2 start npm --name "seo-console" -- start
   ```

### 5. Post-Deployment

1. **Test Authentication**
   - Visit your deployed site
   - Try signing up/logging in
   - Verify redirects work

2. **Test SEO Features**
   - Create an SEO record in the dashboard
   - Test validation features
   - Verify metadata generation

3. **Configure CORS** (if needed)
   - In Supabase Dashboard → Settings → API
   - Add your domain to allowed origins

## Production Checklist

- [ ] Environment variables set in deployment platform
- [ ] Database migrations applied
- [ ] Supabase auth URLs configured
- [ ] CORS settings updated
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Error monitoring set up (optional)
- [ ] Analytics configured (optional)

## Troubleshooting

### Common Issues

1. **Auth redirects not working**
   - Check Supabase redirect URLs include your domain
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct

2. **Database connection errors**
   - Verify environment variables are set
   - Check Supabase project is active
   - Ensure RLS policies are configured

3. **Build failures**
   - Run `npm run verify` locally first
   - Check Node.js version matches deployment platform
   - Review build logs for specific errors

## Support

For issues or questions, check:
- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - Project documentation
- [README.md](./README.md) - Getting started guide

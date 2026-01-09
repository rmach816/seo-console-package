# Standalone App Deployment (No Vercel Required)

Since this is a standalone Next.js application, you can deploy it anywhere that supports Node.js.

## Self-Hosting Options

### Option 1: Run Locally/On Your Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```
   
   Runs on http://localhost:3000 by default

3. **Use a process manager** (recommended for production)
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the app
   pm2 start npm --name "seo-console" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output
};
```

Build and run:
```bash
docker build -t seo-console .
docker run -p 3000:3000 --env-file .env.local seo-console
```

### Option 3: Traditional Hosting (cPanel, DigitalOcean, etc.)

1. **Upload files** to your server
2. **SSH into server**
3. **Install dependencies**: `npm install --production`
4. **Build**: `npm run build`
5. **Start**: `npm start` or use PM2/systemd

### Option 4: Cloud Platforms (No Vercel)

**Railway**
- Connect GitHub repo
- Add environment variables
- Auto-deploys

**Render**
- Connect GitHub repo
- Set build command: `npm run build`
- Set start command: `npm start`

**Fly.io**
- Install flyctl
- `fly launch`
- `fly deploy`

## Environment Setup

Regardless of hosting method, you need:

1. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Supabase Auth Configuration**
   - Add your domain to Supabase → Authentication → URL Configuration
   - Add redirect URL: `https://yourdomain.com/auth/callback`
   - Set site URL: `https://yourdomain.com`

## Port Configuration

By default, Next.js runs on port 3000. To change:

```bash
PORT=5001 npm start
```

Or set in your process manager/hosting platform.

## Why Not Vercel?

You're right - Vercel is optional! It's just convenient for Next.js apps because:
- Zero-config deployment
- Automatic HTTPS
- Edge network
- Free tier

But you can absolutely:
- Self-host on your own server
- Use any Node.js hosting
- Run it locally
- Use Docker containers

The app works the same way regardless of where it's hosted.

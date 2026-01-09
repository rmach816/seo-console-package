# SEO Console Package

A production-ready SEO validation and management system for Next.js applications. Install this package into your existing Next.js project to add SEO metadata management capabilities.

## Installation

```bash
npm install @seo-console/package
```

## Quick Start

### 1. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations from `packages/seo-console/migrations/`:
   - `001_initial_schema.sql` - User profiles
   - `002_seo_records_schema.sql` - SEO records table

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Use in Your Next.js App

#### Add SEO Metadata to Pages

```typescript
// app/blog/[slug]/page.tsx
import { useGenerateMetadata } from "@seo-console/package/hooks";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const metadata = await useGenerateMetadata({
    routePath: `/blog/${params.slug}`,
  });
  return metadata;
}
```

#### Add Admin Components to Your Admin Page

```typescript
// app/admin/seo/page.tsx
"use client";

import { SEORecordList, SEORecordForm } from "@seo-console/package/components";
import { ValidationDashboard } from "@seo-console/package/components";

export default function SEOAdminPage() {
  return (
    <div>
      <h1>SEO Management</h1>
      <SEORecordList />
      <SEORecordForm />
      <ValidationDashboard />
    </div>
  );
}
```

#### Create API Routes

You'll need to create API routes in your Next.js app. See `packages/seo-console/API_ROUTES.md` for details, or copy the examples from `apps/demo/app/api/`.

## Project Structure

This is a monorepo containing:

- `packages/seo-console/` - The installable npm package
- `apps/demo/` - Example Next.js app showing package usage

## Development

### Building the Package

```bash
npm run build:package
```

### Running the Demo

```bash
npm run dev
```

## Documentation

- [Package README](./packages/seo-console/README.md) - Package documentation
- [API Routes Guide](./packages/seo-console/API_ROUTES.md) - Required API routes
- [Demo App](./apps/demo/README.md) - Example usage

## License

MIT

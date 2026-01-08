# SEO Console Package

A production-ready SEO validation and management system for Next.js applications. Install this package into your existing Next.js project to add SEO metadata management capabilities.

## Installation

```bash
npm install @seo-console/package
```

## Quick Start

### 1. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations from `supabase/migrations/`:
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

## API Reference

### Hooks

#### `useGenerateMetadata(options)`

Generates Next.js metadata from SEO records stored in Supabase.

```typescript
import { useGenerateMetadata } from "@seo-console/package/hooks";

const metadata = await useGenerateMetadata({
  routePath: "/about",
  fallback: {
    title: "Default Title",
    description: "Default description"
  }
});
```

### Components

#### `SEORecordList`

Displays a list of all SEO records with edit/delete functionality.

#### `SEORecordForm`

Form for creating and editing SEO records.

#### `ValidationDashboard`

Dashboard showing validation results for all SEO records.

#### `OGImagePreview`

Preview component showing how OG images appear on social platforms.

## Database Schema

The package requires two Supabase tables:
- `profiles` - User profiles (from migration 001)
- `seo_records` - SEO metadata records (from migration 002)

See `supabase/migrations/` for the full schema.

## License

MIT

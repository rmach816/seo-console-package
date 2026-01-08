# SEO Console Package

A production-ready SEO validation and management system for Next.js applications. Install this package into your existing Next.js project to add SEO metadata management capabilities.

## Installation

```bash
npm install @seo-console/package
```

## Quick Start

### 1. Storage Options

The package supports multiple storage backends. **File storage is the default** and requires no database setup.

#### Option A: File Storage (Default - No Database Required)

File storage is the default option. SEO records are stored in a JSON file (`seo-records.json` by default).

No configuration needed! The package will automatically use file storage if no Supabase credentials are provided.

To customize the file path, set an environment variable:

```env
SEO_CONSOLE_STORAGE_PATH=./data/seo-records.json
```

#### Option B: Supabase Storage (Optional)

If you prefer using Supabase as your storage backend:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations from `migrations/`:
   - `001_initial_schema.sql` - User profiles
   - `002_seo_records_schema.sql` - SEO records table
3. Add environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The package will automatically detect Supabase credentials and use Supabase storage instead of file storage.

### 2. Use in Your Next.js App

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

Generates Next.js metadata from SEO records.

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

### Server-Side Functions

The package exports server-side functions for API routes and server components:

```typescript
import { 
  getSEORecords,
  getSEORecordByRoute,
  createSEORecord,
  updateSEORecord,
  deleteSEORecord,
  generateSitemapFromRecords,
  generateRobotsTxt,
  discoverNextJSRoutes,
  extractMetadataFromURL
} from "@seo-console/package/server";
```

## Storage Backends

### File Storage (Default)

- **No database required** - stores data in a JSON file
- **Perfect for small to medium sites** - simple and fast
- **File location**: `seo-records.json` (configurable via `SEO_CONSOLE_STORAGE_PATH`)
- **Automatic**: Works out of the box with no configuration

### Supabase Storage (Optional)

- **Database-backed** - uses Supabase PostgreSQL
- **Better for larger sites** - scalable and supports concurrent access
- **Requires**: Supabase project and migrations
- **Auto-detected**: If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## License

MIT

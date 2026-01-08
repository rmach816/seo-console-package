# SEO Console Package

A production-ready SEO validation and management system for Next.js applications. This package provides a complete admin interface for managing SEO metadata, accessible through a new tab in your admin section.

## Installation

```bash
npm install @seo-console/package
```

## Setup Guide

### Step 1: Configure Storage (Optional)

The package uses **file storage by default** (no database required). SEO records are stored in `seo-records.json`.

To customize the storage location, add to your `.env.local`:

```env
SEO_CONSOLE_STORAGE_PATH=./data/seo-records.json
```

**Optional:** If you prefer Supabase, set these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The package will automatically detect and use Supabase if these are set.

### Step 2: Create API Routes

Create the following API route in your Next.js app:

**`app/api/seo-records/route.ts`:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { 
  getSEORecords, 
  getSEORecordByRoute, 
  createSEORecord, 
  updateSEORecord, 
  deleteSEORecord 
} from "@seo-console/package/server";

// GET - Fetch all SEO records
export async function GET() {
  try {
    const result = await getSEORecords();
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 500 });
    }
    return NextResponse.json({ data: result.data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch records" },
      { status: 500 }
    );
  }
}

// POST - Create a new SEO record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createSEORecord(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 500 });
    }
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create record" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing SEO record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateSEORecord(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 500 });
    }
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update record" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an SEO record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const result = await deleteSEORecord(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete record" },
      { status: 500 }
    );
  }
}
```

### Step 3: Add Admin Pages

Create the admin SEO section in your Next.js app. This will be accessible as a new tab in your admin area.

**Create the directory structure:**

```
app/admin/seo/
  ├── page.tsx          (Main dashboard)
  ├── editor/
  │   └── page.tsx      (SEO record editor)
  ├── reports/
  │   └── page.tsx      (Reports & analytics)
  ├── search/
  │   └── page.tsx      (Search & validation)
  └── settings/
      └── page.tsx      (Settings)
```

**`app/admin/seo/page.tsx` (Main Dashboard):**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SEORecord } from "@seo-console/package";

export default function SEOAdminPage() {
  const router = useRouter();
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seo-records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>SEO Management</h1>
      <nav>
        <a href="/admin/seo">Dashboard</a>
        <a href="/admin/seo/editor">Editor</a>
        <a href="/admin/seo/reports">Reports</a>
        <a href="/admin/seo/search">Search</a>
        <a href="/admin/seo/settings">Settings</a>
      </nav>
      {/* Your SEO dashboard content */}
    </div>
  );
}
```

**`app/admin/seo/editor/page.tsx` (Editor):**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { SEORecord } from "@seo-console/package";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const route = searchParams.get("route");
  const [record, setRecord] = useState<SEORecord | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    canonicalUrl: "",
  });

  // Load and save logic here
  return (
    <div>
      <h1>Edit SEO Record</h1>
      {/* Your editor form */}
    </div>
  );
}
```

> **Note:** For complete implementation examples, see the demo app in the repository. The package provides the data layer and utilities; you'll need to build the UI components or copy from the demo.

### Step 4: Add SEO Metadata to Your Pages

Use the `useGenerateMetadata` hook to automatically generate metadata from your SEO records:

```typescript
// app/blog/[slug]/page.tsx
import { useGenerateMetadata } from "@seo-console/package/hooks";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const metadata = await useGenerateMetadata({
    routePath: `/blog/${params.slug}`,
    fallback: {
      title: "Blog Post",
      description: "Default description"
    }
  });
  return metadata;
}
```

### Step 5: Add to Your Admin Navigation

Add a link to the SEO admin section in your main admin navigation:

```typescript
// app/admin/layout.tsx or your admin navigation component
<nav>
  <Link href="/admin/dashboard">Dashboard</Link>
  <Link href="/admin/seo">SEO</Link> {/* Add this */}
  <Link href="/admin/users">Users</Link>
  {/* ... other admin links */}
</nav>
```

## Quick Start Summary

1. **Install:** `npm install @seo-console/package`
2. **Create API route:** `app/api/seo-records/route.ts` (see Step 2)
3. **Create admin pages:** `app/admin/seo/` directory with pages (see Step 3)
4. **Add to navigation:** Link to `/admin/seo` in your admin menu
5. **Use in pages:** Add `generateMetadata` to your pages (see Step 4)

That's it! The SEO admin interface will be accessible at `/admin/seo` as a new tab in your admin area.

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

### Server-Side Functions

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

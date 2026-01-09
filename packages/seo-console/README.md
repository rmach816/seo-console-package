# SEO Console Package

A production-ready SEO validation and management system for Next.js applications. This package provides a complete admin interface for managing SEO metadata, accessible through a new tab in your admin section.

## Installation

```bash
npm install @seo-console/package
```

**🤖 For AI Coders (Cursor, GitHub Copilot, etc.):**

After installing, **you MUST run the setup script** to generate all necessary files:

```bash
npx @seo-console/package setup
```

This automatically creates:
- ✅ All API routes (`/api/seo-records`, `/api/discover-routes`, `/api/import-from-site`, `/api/auto-setup`)
- ✅ Admin page at `/admin/seo`
- ✅ Everything needed for the package to work

**The setup script will:**
1. Create `app/api/seo-records/route.ts` and `app/api/seo-records/[id]/route.ts`
2. Create `app/api/discover-routes/route.ts`
3. Create `app/api/import-from-site/route.ts`
4. Create `app/api/auto-setup/route.ts` (one-click import of all pages)
5. Create `app/admin/seo/page.tsx` with auto-setup button

**After running setup:**
1. Add a link to `/admin/seo` in your admin navigation
2. Visit `/admin/seo` and click "Auto-Setup" to import all existing pages and SEO
3. Done! Everything works automatically.

## Setup Guide

### Step 1: Configure Storage (Optional)

The package uses **file storage** (no database required). SEO records are stored in `seo-records.json` in your project root.

To customize the storage location, add to your `.env.local`:

```env
SEO_CONSOLE_STORAGE_PATH=./data/seo-records.json
```

That's it! No database setup needed.

### Step 3: Create API Routes (AUTOMATIC if you ran setup script)

**⚠️ If you ran `npx @seo-console/package setup`, skip this step!** The setup script already created these files.

**If you didn't run setup, you MUST create these manually:**

**Create `app/api/seo-records/route.ts`:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package";
import { createSEORecordSchema } from "@seo-console/package/server";

// GET - Fetch all SEO records
export async function GET() {
  try {
    // Get file storage adapter
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    
    // Check if storage is available
    const isAvailable = await storage.isAvailable();
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Storage not available" },
        { status: 500 }
      );
    }
    
    const records = await storage.getRecords();
    return NextResponse.json({ data: records || [] });
  } catch (error) {
    console.error("Error fetching SEO records:", error);
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
    
    // Validate the request body
    const validated = createSEORecordSchema.parse(body);
    
    // Auto-detect storage type
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    
    const record = await storage.createRecord(validated);
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("Error creating SEO record:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
```

**Create `app/api/seo-records/[id]/route.ts`:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package";
import { updateSEORecordSchema } from "@seo-console/package/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get a single SEO record
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    
    const record = await storage.getRecordById(id);
    
    if (!record) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: record });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch record" },
      { status: 500 }
    );
  }
}

// PATCH - Update an SEO record
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validated = updateSEORecordSchema.parse({ ...body, id });
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    
    const record = await storage.updateRecord(validated);
    return NextResponse.json({ data: record });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

// DELETE - Delete an SEO record
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);
    
    await storage.deleteRecord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete record" },
      { status: 500 }
    );
  }
}
```

> **Important:** These API routes use file storage. SEO records are stored in `seo-records.json` in your project root (or the path specified in `SEO_CONSOLE_STORAGE_PATH`).

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

### Step 5: Add SEO Metadata to Your Pages

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

### Step 5: Discover and Import Existing Pages (Optional but Recommended)

**⚠️ IMPORTANT:** The package doesn't automatically detect your existing pages or SEO settings. You need to discover and import them.

**Create `app/api/discover-routes/route.ts` to find all your pages:**

```typescript
import { NextResponse } from "next/server";
import { discoverNextJSRoutes } from "@seo-console/package/server";

export async function POST() {
  try {
    const appDir = process.env.NEXT_PUBLIC_APP_DIR || "app";
    const routes = await discoverNextJSRoutes(appDir);
    return NextResponse.json({ routes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to discover routes" },
      { status: 500 }
    );
  }
}
```

**Create `app/api/import-from-site/route.ts` to import existing SEO metadata:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { detectStorageConfig, createStorageAdapter } from "@seo-console/package";
import { extractMetadataFromURL, metadataToSEORecord } from "@seo-console/package/server";

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, routes } = await request.json();

    if (!baseUrl) {
      return NextResponse.json({ error: "Base URL is required" }, { status: 400 });
    }

    const routesToImport = Array.isArray(routes) && routes.length > 0 ? routes : ["/"];
    const results: Array<{ route: string; success: boolean; error?: string }> = [];
    
    const config = detectStorageConfig();
    const storage = createStorageAdapter(config);

    for (const route of routesToImport) {
      try {
        const url = new URL(route, baseUrl).toString();
        const metadata = await extractMetadataFromURL(url);

        if (Object.keys(metadata).length === 0) {
          results.push({ route, success: false, error: "No metadata found" });
          continue;
        }

        const recordData = metadataToSEORecord(metadata, route, "file-user");
        await storage.createRecord(recordData as { userId: string; routePath: string; [key: string]: unknown });
        results.push({ route, success: true });

        // Rate limiting - wait 200ms between requests
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        results.push({
          route,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import from site" },
      { status: 500 }
    );
  }
}
```

**How to use these routes:**

1. **Discover routes:** Call `POST /api/discover-routes` to get a list of all your pages
2. **Import SEO:** Call `POST /api/import-from-site` with your site's base URL and the routes you want to import

Example:
```typescript
// In your admin UI or a script
const discoverResponse = await fetch("/api/discover-routes", { method: "POST" });
const { routes } = await discoverResponse.json();

const importResponse = await fetch("/api/import-from-site", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    baseUrl: "https://yoursite.com",
    routes: routes.map((r: any) => r.routePath)
  })
});
```

## Quick Start Summary

1. **Install:** `npm install @seo-console/package`
2. **Create API route:** `app/api/seo-records/route.ts` (see Step 2)
3. **Create admin pages:** `app/admin/seo/` directory with pages (see Step 3)
4. **Add to navigation:** Link to `/admin/seo` in your admin menu
5. **Discover & import pages:** Create `app/api/discover-routes/route.ts` and `app/api/import-from-site/route.ts` (see Step 5)
6. **Use in pages:** Add `generateMetadata` to your pages (see Step 4)

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

### Storage Functions

```typescript
import { 
  detectStorageConfig,
  createStorageAdapter
} from "@seo-console/package";

// Get storage adapter (uses file storage)
const config = detectStorageConfig();
const storage = createStorageAdapter(config);

// Use storage methods
const records = await storage.getRecords();
const record = await storage.getRecordByRoute("/about");
await storage.createRecord({ routePath: "/contact", title: "Contact" });
```

### Other Server-Side Functions

```typescript
import { 
  generateSitemapFromRecords,
  generateRobotsTxt,
  discoverNextJSRoutes,
  extractMetadataFromURL
} from "@seo-console/package/server";
```

## Storage

The package uses **file storage** - SEO records are stored in a JSON file (`seo-records.json` by default).

- **No database required** - works out of the box
- **Simple and fast** - perfect for most sites
- **Version controlled** - the JSON file can be committed to git
- **Configurable** - set `SEO_CONSOLE_STORAGE_PATH` to customize the file location

## License

MIT

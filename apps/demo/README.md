# SEO Console Demo App

This is a demo Next.js application showing how to use the `seo-console-package`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. Run database migrations in your Supabase project

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Usage Examples

### Adding SEO Metadata to Pages

```typescript
// app/about/page.tsx
import { useGenerateMetadata } from "seo-console-package/hooks";

export async function generateMetadata() {
  return useGenerateMetadata({
    routePath: "/about",
    fallback: {
      title: "About Us",
      description: "Learn more about our company"
    }
  });
}
```

### Adding Admin Components

```typescript
// app/admin/seo/page.tsx
"use client";
import { SEORecordList, ValidationDashboard } from "seo-console-package/components";

export default function SEOAdmin() {
  return (
    <div>
      <h1>SEO Management</h1>
      <SEORecordList />
      <ValidationDashboard />
    </div>
  );
}
```

## API Routes

The demo includes example API routes in `app/api/` that you can copy to your own project.

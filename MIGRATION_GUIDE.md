# Migration Guide: Restructuring to NPM Package

## Overview

We're restructuring from a standalone Next.js app to an installable npm package that developers can add to their existing Next.js projects.

## What Changes

### Before (Current)
```
seo-console-package/
├── app/              # Full Next.js app
├── components/       # All components
├── lib/             # All library code
└── package.json     # Standalone app
```

### After (Target)
```
seo-console-package/
├── packages/
│   └── seo-console/     # The npm package
│       ├── src/
│       │   ├── components/  # Admin UI components
│       │   ├── hooks/       # useGenerateMetadata hook
│       │   └── lib/        # Core library
│       └── package.json
├── apps/
│   └── demo/              # Example Next.js app
│       └── app/            # Shows how to use the package
└── package.json            # Workspace root
```

## How Users Will Use It

### Installation
```bash
npm install seo-console-package
```

### In Their Next.js App

**1. Add SEO metadata to pages:**
```typescript
// app/about/page.tsx
import { useGenerateMetadata } from "seo-console-package/hooks";

export async function generateMetadata() {
  return useGenerateMetadata({
    routePath: "/about",
    fallback: { title: "About Us" }
  });
}
```

**2. Add admin components to their admin page:**
```typescript
// app/admin/seo/page.tsx
"use client";
import { SEORecordList, ValidationDashboard } from "seo-console-package/components";

export default function SEOAdmin() {
  return (
    <div>
      <SEORecordList />
      <ValidationDashboard />
    </div>
  );
}
```

## Migration Status

This is a work in progress. The structure is being created now.

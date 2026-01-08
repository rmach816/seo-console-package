# API Routes Required

The SEO Console package components expect certain API routes to exist in your Next.js application. You need to create these routes in your `app/api/` directory.

## Required API Routes

### 1. `/api/seo-records` - CRUD Operations

**GET** - Fetch all SEO records
```typescript
// app/api/seo-records/route.ts
import { NextResponse } from "next/server";
import { getAllSEORecords } from "seo-console-package/lib/database/seo-records";

export async function GET() {
  const result = await getAllSEORecords();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ data: result.data });
}
```

**POST** - Create new SEO record
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const result = await createSEORecord(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
```

### 2. `/api/seo-records/[id]` - Individual Record Operations

**GET** - Fetch by ID
**PATCH** - Update record
**DELETE** - Delete record

### 3. `/api/seo-records/[id]/validate` - Validation

**POST** - Trigger validation for a record

### 4. `/api/validate-image` - Image Validation

**POST** - Validate OG image
```typescript
// app/api/validate-image/route.ts
import { NextResponse } from "next/server";
import { validateOGImage } from "seo-console-package";

export async function POST(request: Request) {
  const { imageUrl, expectedWidth, expectedHeight } = await request.json();
  const result = await validateOGImage(imageUrl, expectedWidth, expectedHeight);
  return NextResponse.json(result);
}
```

## Implementation

See the `apps/demo/` directory for complete API route implementations that you can copy into your project.

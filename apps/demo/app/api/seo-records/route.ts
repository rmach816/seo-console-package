import { NextResponse } from "next/server";
import { getSEORecords, createSEORecord, createSEORecordSchema } from "@seo-console/package/server";

export async function GET() {
  // For demo purposes, return empty array if Supabase is not configured or user is not authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ data: [] });
  }

  const result = await getSEORecords();

  if (!result.success) {
    // If authentication fails, return empty array for demo
    if (result.error?.message?.includes("not authenticated") || result.error?.message?.includes("User not authenticated")) {
      return NextResponse.json({ data: [] });
    }
    return NextResponse.json(
      { error: result.error?.message || "Failed to fetch SEO records" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: result.data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createSEORecordSchema.parse(body);

    const result = await createSEORecord(validated);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Failed to create SEO record" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
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

import { NextResponse } from "next/server";
import { getSEORecords, createSEORecord } from "@/lib/database/seo-records";
import { createSEORecordSchema } from "@/lib/validation/seo-schema";

export async function GET() {
  const result = await getSEORecords();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
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
        { error: result.error.message },
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

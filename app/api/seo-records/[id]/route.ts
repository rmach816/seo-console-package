import { NextResponse } from "next/server";
import {
  getSEORecordById,
  updateSEORecord,
  deleteSEORecord,
} from "@/lib/database/seo-records";
import { updateSEORecordSchema } from "@/lib/validation/seo-schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getSEORecordById(id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.message === "SEO record not found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ data: result.data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSEORecordSchema.parse({ ...body, id });

    const result = await updateSEORecord(validated);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteSEORecord(id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.message },
      { status: result.error.message === "SEO record not found" ? 404 : 500 }
    );
  }

  return NextResponse.json({ success: true });
}

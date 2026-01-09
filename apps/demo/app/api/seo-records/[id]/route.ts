import { NextResponse } from "next/server";
import {
  getSEORecordById,
  updateSEORecord,
  deleteSEORecord,
  updateSEORecordSchema,
} from "@seo-console/package/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getSEORecordById(id);

  if (!result.success) {
    const errorMessage = result.error?.message || "Failed to fetch SEO record";
    const status = errorMessage.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status }
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
      const errorMessage = result.error?.message || "Failed to update SEO record";
      const status = errorMessage.includes("not found") ? 404 : 400;
      return NextResponse.json(
        { error: errorMessage },
        { status }
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteSEORecord(id);

  if (!result.success) {
    const errorMessage = result.error?.message || "Failed to delete SEO record";
    const status = errorMessage.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }

  return NextResponse.json({ success: true });
}

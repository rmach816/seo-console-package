import { NextResponse } from "next/server";
import { updateSEORecord } from "@/lib/database/seo-records";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      validationStatus,
      validationErrors,
      lastValidatedAt,
    } = body as {
      validationStatus?: "pending" | "valid" | "invalid" | "warning";
      validationErrors?: Record<string, unknown>;
      lastValidatedAt?: string;
    };

    const result = await updateSEORecord({
      id,
      validationStatus,
      validationErrors,
      lastValidatedAt: lastValidatedAt ? new Date(lastValidatedAt) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 }
    );
  }
}

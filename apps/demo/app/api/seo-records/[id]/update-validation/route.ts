import { NextResponse } from "next/server";
import { getSEORecordById, updateSEORecord } from "@seo-console/package/server";
import type { ValidationResult } from "@seo-console/package/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { validation } = body as { validation: ValidationResult };

    const recordResult = await getSEORecordById(id);

    if (!recordResult.success) {
      const errorMessage = recordResult.error?.message || "SEO record not found";
      const status = errorMessage.includes("not found") ? 404 : 500;
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }

    const updateResult = await updateSEORecord({
      id,
      validationErrors: validation as unknown as Record<string, unknown>,
      validationStatus: validation.issues.length > 0 ? "invalid" : "valid",
      lastValidatedAt: new Date(),
    });

    if (!updateResult.success) {
      return NextResponse.json(
        { error: updateResult.error?.message || "Failed to update validation" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: updateResult.data });
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

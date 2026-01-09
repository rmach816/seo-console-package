import { NextResponse } from "next/server";
import { getSEORecordById, validateURL } from "@seo-console/package/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recordResult = await getSEORecordById(id);

    if (!recordResult.success) {
      return NextResponse.json(
        { error: recordResult.error?.message || "SEO record not found" },
        { status: 404 }
      );
    }

    const record = recordResult.data;
    if (!record) {
      return NextResponse.json(
        { error: "SEO record not found" },
        { status: 404 }
      );
    }
    
    // Build the full URL from the route path
    const baseUrl = request.headers.get("origin") || "";
    const fullUrl = `${baseUrl}${record.routePath}`;
    
    // Use validateURL which fetches and validates the HTML
    const validationResult = await validateURL(fullUrl, record);

    return NextResponse.json({
      data: {
        recordId: record.id,
        validation: validationResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 500 }
    );
  }
}

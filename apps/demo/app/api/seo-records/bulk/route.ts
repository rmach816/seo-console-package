import { NextResponse } from "next/server";
import { createSEORecord, createSEORecordSchema } from "@seo-console/package/server";

export async function POST(request: Request) {
  try {
    const { routes } = await request.json();

    if (!Array.isArray(routes)) {
      return NextResponse.json({ error: "Routes must be an array" }, { status: 400 });
    }

    const results = [];

    for (const routeData of routes) {
      try {
        const validated = createSEORecordSchema.parse(routeData);
        const result = await createSEORecord(validated);

        if (result.success) {
          results.push({ success: true, data: result.data });
        } else {
          results.push({ success: false, error: result.error?.message });
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Validation failed",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error creating bulk records:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create records" },
      { status: 500 }
    );
  }
}

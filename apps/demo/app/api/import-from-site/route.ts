import { NextResponse } from "next/server";
import { extractMetadataFromURL, metadataToSEORecord, createSEORecord } from "@seo-console/package/server";

export async function POST(request: Request) {
  try {
    const { baseUrl, routes } = await request.json();

    if (!baseUrl) {
      return NextResponse.json({ error: "Base URL is required" }, { status: 400 });
    }

    const routesToImport = Array.isArray(routes) && routes.length > 0 ? routes : ["/"];
    const results: Array<{ route: string; success: boolean; error?: string }> = [];

    for (const route of routesToImport) {
      try {
        const url = new URL(route, baseUrl).toString();
        const metadata = await extractMetadataFromURL(url);

        if (Object.keys(metadata).length === 0) {
          results.push({ route, success: false, error: "No metadata found" });
          continue;
        }

        const recordData = metadataToSEORecord(metadata, route);
        const result = await createSEORecord(recordData);

        if (result.success) {
          results.push({ route, success: true });
        } else {
          results.push({ route, success: false, error: result.error?.message || "Failed to create record" });
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        results.push({
          route,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error importing from site:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import from site" },
      { status: 500 }
    );
  }
}

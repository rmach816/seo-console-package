import { NextResponse } from "next/server";
import { getSEORecords, generateSitemapFromRecords } from "@seo-console/package/server";

export async function POST() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const result = await getSEORecords();

    if (!result.success) {
      return NextResponse.json({ error: "Failed to fetch SEO records" }, { status: 500 });
    }

    const records = result.data || [];
    const sitemap = generateSitemapFromRecords(records, baseUrl);

    // The sitemap is already served at /sitemap.xml via the route handler
    // This endpoint just confirms generation

    return NextResponse.json({
      success: true,
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      entryCount: records.filter((r) => r.canonicalUrl).length,
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}

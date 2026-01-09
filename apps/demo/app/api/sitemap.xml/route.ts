import { NextResponse } from "next/server";
import { getSEORecords, generateSitemapFromRecords } from "@seo-console/package/server";

export async function GET() {
  try {
    // Get base URL from environment or request
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    // Fetch all SEO records
    const result = await getSEORecords();

    if (!result.success) {
      return new NextResponse("Failed to generate sitemap", { status: 500 });
    }

    const records = result.data || [];

    // Generate sitemap XML
    const sitemap = generateSitemapFromRecords(records, baseUrl);

    // Return as XML
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

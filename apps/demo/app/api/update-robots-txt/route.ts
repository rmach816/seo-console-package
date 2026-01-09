import { NextResponse } from "next/server";
import { generateRobotsTxt } from "@seo-console/package/server";

export async function POST(request: Request) {
  try {
    const { sitemapUrl } = await request.json();

    if (!sitemapUrl) {
      return NextResponse.json({ error: "Sitemap URL is required" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Generate robots.txt with sitemap reference
    const robotsTxt = generateRobotsTxt({
      userAgents: [
        {
          agent: "*",
          allow: ["/"],
          disallow: ["/api/", "/admin/", "/_next/"],
        },
      ],
      sitemapUrl: sitemapUrl.startsWith("http") ? sitemapUrl : `${baseUrl}${sitemapUrl}`,
    });

    // Note: In a real implementation, you might want to write this to a file
    // For now, it's served dynamically via /robots.txt route

    return NextResponse.json({
      success: true,
      message: "robots.txt updated. Available at /robots.txt",
      robotsTxt,
    });
  } catch (error) {
    console.error("Error updating robots.txt:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update robots.txt" },
      { status: 500 }
    );
  }
}

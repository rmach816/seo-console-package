import { NextResponse } from "next/server";
import { generateRobotsTxt } from "@seo-console/package/server";

export async function GET() {
  try {
    // Get base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt({
      userAgents: [
        {
          agent: "*",
          allow: ["/"],
          disallow: ["/api/", "/admin/", "/_next/"],
        },
      ],
      sitemapUrl,
    });

    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    return new NextResponse("Error generating robots.txt", { status: 500 });
  }
}

/**
 * Sitemap Generator
 * Generates sitemap.xml from SEO records
 * Only includes routes with canonical URLs
 */

import type { SEORecord } from "./validation/seo-schema";

export interface SitemapEntry {
  loc: string; // Canonical URL
  lastmod?: string; // ISO date string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number; // 0.0 to 1.0
}

export interface SitemapOptions {
  baseUrl: string;
  entries: SitemapEntry[];
}

/**
 * Generate sitemap.xml content
 */
export function generateSitemapXML(options: SitemapOptions): string {
  const { baseUrl, entries } = options;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    const loc = entry.loc.startsWith("http") ? entry.loc : new URL(entry.loc, baseUrl).toString();
    return `  <url>
    <loc>${escapeXML(loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}${entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : ""}${entry.priority !== undefined ? `\n    <priority>${entry.priority}</priority>` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return xml;
}

/**
 * Convert SEO records to sitemap entries
 * Only includes records with canonical URLs
 */
export function seoRecordsToSitemapEntries(
  records: SEORecord[],
  baseUrl: string
): SitemapEntry[] {
  return records
    .filter((record) => {
      // Only include records with canonical URLs
      return record.canonicalUrl && record.canonicalUrl.trim() !== "";
    })
    .map((record) => {
      const entry: SitemapEntry = {
        loc: record.canonicalUrl!,
      };

      // Add lastmod if available
      if (record.modifiedTime) {
        entry.lastmod = record.modifiedTime.toISOString().split("T")[0];
      } else if (record.lastValidatedAt) {
        entry.lastmod = record.lastValidatedAt.toISOString().split("T")[0];
      }

      // Set default changefreq and priority based on route
      if (record.routePath === "/") {
        entry.changefreq = "daily";
        entry.priority = 1.0;
      } else if (record.routePath.includes("/blog/") || record.routePath.includes("/posts/")) {
        entry.changefreq = "weekly";
        entry.priority = 0.8;
      } else {
        entry.changefreq = "monthly";
        entry.priority = 0.6;
      }

      return entry;
    })
    .sort((a, b) => {
      // Sort by priority (highest first), then by URL
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return a.loc.localeCompare(b.loc);
    });
}

/**
 * Generate sitemap from SEO records
 */
export function generateSitemapFromRecords(
  records: SEORecord[],
  baseUrl: string
): string {
  const entries = seoRecordsToSitemapEntries(records, baseUrl);
  return generateSitemapXML({ baseUrl, entries });
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validate sitemap entry
 */
export function validateSitemapEntry(entry: SitemapEntry): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry.loc) {
    errors.push("Location (loc) is required");
  } else {
    try {
      new URL(entry.loc);
    } catch {
      errors.push("Location must be a valid URL");
    }
  }

  if (entry.priority !== undefined) {
    if (entry.priority < 0 || entry.priority > 1) {
      errors.push("Priority must be between 0.0 and 1.0");
    }
  }

  if (entry.lastmod) {
    const date = new Date(entry.lastmod);
    if (isNaN(date.getTime())) {
      errors.push("Lastmod must be a valid date (YYYY-MM-DD)");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

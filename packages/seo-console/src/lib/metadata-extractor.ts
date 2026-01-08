/**
 * Metadata Extractor
 * Extracts SEO metadata from HTML pages or Next.js metadata exports
 */

import * as cheerio from "cheerio";
import type { SEORecord } from "../lib/validation/seo-schema";

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogType?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  robots?: string;
  keywords?: string[];
}

/**
 * Extract metadata from HTML string
 */
export function extractMetadataFromHTML(html: string, baseUrl?: string): ExtractedMetadata {
  const $ = cheerio.load(html);
  const metadata: ExtractedMetadata = {};

  // Basic metadata
  metadata.title = $("title").text() || undefined;
  metadata.description = $('meta[name="description"]').attr("content") || undefined;
  metadata.robots = $('meta[name="robots"]').attr("content") || undefined;
  
  const keywords = $('meta[name="keywords"]').attr("content");
  if (keywords) {
    metadata.keywords = keywords.split(",").map((k) => k.trim());
  }

  // Open Graph
  metadata.ogTitle = $('meta[property="og:title"]').attr("content") || undefined;
  metadata.ogDescription = $('meta[property="og:description"]').attr("content") || undefined;
  metadata.ogImageUrl = $('meta[property="og:image"]').attr("content") || undefined;
  metadata.ogType = $('meta[property="og:type"]').attr("content") || undefined;
  metadata.ogUrl = $('meta[property="og:url"]').attr("content") || undefined;

  // Canonical URL
  metadata.canonicalUrl = $('link[rel="canonical"]').attr("href") || undefined;

  // Make URLs absolute if baseUrl provided
  if (baseUrl) {
    if (metadata.ogImageUrl && !metadata.ogImageUrl.startsWith("http")) {
      metadata.ogImageUrl = new URL(metadata.ogImageUrl, baseUrl).toString();
    }
    if (metadata.canonicalUrl && !metadata.canonicalUrl.startsWith("http")) {
      metadata.canonicalUrl = new URL(metadata.canonicalUrl, baseUrl).toString();
    }
  }

  return metadata;
}

/**
 * Extract metadata from a live URL
 */
export async function extractMetadataFromURL(url: string): Promise<ExtractedMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SEO-Console/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    return extractMetadataFromHTML(html, url);
  } catch (error) {
    console.error(`Error extracting metadata from ${url}:`, error);
    return {};
  }
}

/**
 * Convert extracted metadata to SEO record format
 */
export function metadataToSEORecord(
  metadata: ExtractedMetadata,
  routePath: string,
  userId: string = "extracted"
): Partial<SEORecord> {
  return {
    userId,
    routePath,
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ogTitle: metadata.ogTitle,
    ogDescription: metadata.ogDescription,
    ogImageUrl: metadata.ogImageUrl,
    ogType: metadata.ogType as SEORecord["ogType"],
    ogUrl: metadata.ogUrl,
    canonicalUrl: metadata.canonicalUrl,
    robots: metadata.robots as SEORecord["robots"],
    validationStatus: "pending",
  };
}

/**
 * Crawl a site and extract metadata from all pages
 */
export async function crawlSiteForSEO(
  baseUrl: string,
  routes: string[]
): Promise<Map<string, ExtractedMetadata>> {
  const results = new Map<string, ExtractedMetadata>();

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();
    try {
      const metadata = await extractMetadataFromURL(url);
      results.set(route, metadata);
      
      // Rate limiting - wait 100ms between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to crawl ${url}:`, error);
    }
  }

  return results;
}

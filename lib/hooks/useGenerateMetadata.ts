import type { Metadata } from "next";
import { getSEORecordByRoute } from "@/lib/database/seo-records";

export interface GenerateMetadataOptions {
  routePath?: string;
  fallback?: Partial<Metadata>;
}

/**
 * Generate Next.js metadata from SEO records
 * 
 * @param options - Configuration options
 * @param options.routePath - The route path to look up (defaults to current route)
 * @param options.fallback - Fallback metadata if no SEO record is found
 * @returns Next.js Metadata object
 * 
 * @example
 * ```ts
 * export async function generateMetadata(): Promise<Metadata> {
 *   return useGenerateMetadata({
 *     routePath: "/about",
 *     fallback: {
 *       title: "About Us",
 *       description: "Learn more about our company"
 *     }
 *   });
 * }
 * ```
 */
export async function useGenerateMetadata(
  options: GenerateMetadataOptions = {} as GenerateMetadataOptions
): Promise<Metadata> {
  const { routePath, fallback = {} as Partial<Metadata> } = options;

  // If no route path provided, return fallback only
  if (!routePath) {
    return {
      title: fallback.title,
      description: fallback.description,
      ...fallback,
    };
  }

  // Fetch SEO record from database
  const result = await getSEORecordByRoute(routePath);

  if (!result.success || !result.data) {
    // Return fallback if record not found or error occurred
    return {
      title: fallback.title,
      description: fallback.description,
      ...fallback,
    };
  }

  const record = result.data;
  const metadata: Partial<Metadata> = {};

  // Basic metadata
  if (record.title) {
    metadata.title = record.title;
  }
  if (record.description) {
    metadata.description = record.description;
  }
  if (record.keywords && record.keywords.length > 0) {
    metadata.keywords = record.keywords;
  }
  if (record.author) {
    metadata.authors = [{ name: record.author }];
  }

  // Open Graph metadata
  if (
    record.ogTitle ||
    record.ogDescription ||
    record.ogImageUrl ||
    record.ogType
  ) {
    // Next.js only supports specific OG types
    const supportedOGTypes = ["website", "article", "book", "profile"] as const;
    const ogType = record.ogType && supportedOGTypes.includes(record.ogType as typeof supportedOGTypes[number])
      ? (record.ogType as typeof supportedOGTypes[number])
      : "website";

    const openGraph: NonNullable<Metadata["openGraph"]> = {
      type: ogType,
      title: record.ogTitle || record.title || undefined,
      description: record.ogDescription || record.description || undefined,
      url: record.ogUrl || undefined,
      siteName: record.ogSiteName || undefined,
    };

    if (record.ogImageUrl) {
      openGraph.images = [
        {
          url: record.ogImageUrl,
          width: record.ogImageWidth || undefined,
          height: record.ogImageHeight || undefined,
          alt: record.ogTitle || record.title || undefined,
        },
      ];
    }

    // For article type, add published/modified times
    if (ogType === "article") {
      const articleOpenGraph = {
        ...openGraph,
        ...(record.publishedTime && {
          publishedTime: record.publishedTime.toISOString(),
        }),
        ...(record.modifiedTime && {
          modifiedTime: record.modifiedTime.toISOString(),
        }),
      } as Metadata["openGraph"];
      metadata.openGraph = articleOpenGraph;
    } else {
      metadata.openGraph = openGraph;
    }
  }

  // Twitter Card metadata
  if (
    record.twitterCard ||
    record.twitterTitle ||
    record.twitterDescription ||
    record.twitterImageUrl
  ) {
    metadata.twitter = {
      card: record.twitterCard || "summary",
      title: record.twitterTitle || record.ogTitle || record.title || undefined,
      description:
        record.twitterDescription ||
        record.ogDescription ||
        record.description ||
        undefined,
      images: record.twitterImageUrl
        ? [record.twitterImageUrl]
        : undefined,
      site: record.twitterSite || undefined,
      creator: record.twitterCreator || undefined,
    };
  }

  // Canonical URL
  if (record.canonicalUrl) {
    metadata.alternates = {
      canonical: record.canonicalUrl,
    };
  }

  // Robots
  if (record.robots) {
    metadata.robots = record.robots as Metadata["robots"];
  }

  // Merge with fallback (fallback takes precedence for missing values)
  return {
    ...fallback,
    ...metadata,
    // Ensure title and description from record override fallback if present
    title: record.title || fallback.title,
    description: record.description || fallback.description,
    // Merge openGraph if both exist
    openGraph: fallback.openGraph
      ? { ...metadata.openGraph, ...fallback.openGraph }
      : metadata.openGraph,
    // Merge twitter if both exist
    twitter: fallback.twitter
      ? { ...metadata.twitter, ...fallback.twitter }
      : metadata.twitter,
  };
}

/**
 * Helper to get route path from Next.js params
 * Useful for dynamic routes
 * 
 * @example
 * ```ts
 * export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
 *   const routePath = getRoutePathFromParams(params, "/blog/[slug]");
 *   return useGenerateMetadata({ routePath });
 * }
 * ```
 */
export function getRoutePathFromParams(
  params: Record<string, string | string[]>,
  pattern: string
): string {
  let routePath = pattern;

  // Replace [param] and [...param] patterns with actual values
  for (const [key, value] of Object.entries(params)) {
    const paramValue = Array.isArray(value) ? value.join("/") : value;
    routePath = routePath.replace(`[${key}]`, paramValue);
    routePath = routePath.replace(`[...${key}]`, paramValue);
  }

  return routePath;
}

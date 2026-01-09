/**
 * Server-side only exports
 * These can be safely imported in API routes and server components
 */

// Note: Database functions (getSEORecords, etc.) are no longer exported
// Use storage adapters from the main package instead:
// import { detectStorageConfig, createStorageAdapter } from "@seo-console/package";

// Export validation schemas
export { createSEORecordSchema, updateSEORecordSchema } from "./lib/validation/seo-schema";

// Export validation utilities
export { validateOGImage } from "./lib/validation/image-validator";
export { validateHTML, validateURL } from "./lib/validation/html-validator";

// Export types
export type { SEORecord, CreateSEORecord, UpdateSEORecord } from "./lib/validation/seo-schema";
export type { ValidationResult, ValidationIssue } from "./lib/validation/html-validator";
export type { ImageValidationResult } from "./lib/validation/image-validator";

// Export Result type for error handling
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// Export hooks (can be used in server components)
export * from "./hooks";

// Export sitemap and robots generators (server-side)
export { generateSitemapXML, generateSitemapFromRecords, seoRecordsToSitemapEntries, validateSitemapEntry } from "./lib/sitemap-generator";
export type { SitemapEntry, SitemapOptions } from "./lib/sitemap-generator";
export { generateRobotsTxt, updateRobotsTxtWithSitemap, extractSitemapFromRobotsTxt } from "./lib/robots-generator";
export type { RobotsTxtOptions } from "./lib/robots-generator";

// Export metadata extractor (server-side)
export { extractMetadataFromURL, crawlSiteForSEO, metadataToSEORecord, extractMetadataFromHTML } from "./lib/metadata-extractor";
export type { ExtractedMetadata } from "./lib/metadata-extractor";

// Export route discovery (server-side)
export { discoverNextJSRoutes, generateExamplePaths } from "./lib/route-discovery";
export type { DiscoveredRoute } from "./lib/route-discovery";

// Export crawlability validator (server-side)
export { validateCrawlability, validateRobotsTxt, validatePublicAccess } from "./lib/validation/crawlability-validator";

// Export storage adapters (server-side - FileStorage uses fs)
export { createStorageAdapter } from "./lib/storage/storage-factory";
export { FileStorage } from "./lib/storage/file-storage";

// Export database functions (server-side - Supabase)
export { getSEORecords, getSEORecordById, getSEORecordByRoute, createSEORecord, updateSEORecord, deleteSEORecord } from "./lib/database/seo-records";
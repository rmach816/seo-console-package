/**
 * Server-side only exports
 * These can be safely imported in API routes and server components
 */

// Export database functions
export {
  getSEORecords,
  getSEORecords as getAllSEORecords, // Alias for backward compatibility
  getSEORecordById,
  getSEORecordByRoute,
  createSEORecord,
  updateSEORecord,
  deleteSEORecord,
} from "./lib/database/seo-records";

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
export { generateSitemapXML, generateSitemapFromRecords, seoRecordsToSitemapEntries } from "./lib/sitemap-generator";
export { generateRobotsTxt, updateRobotsTxtWithSitemap } from "./lib/robots-generator";

// Export metadata extractor (server-side)
export { extractMetadataFromURL, crawlSiteForSEO, metadataToSEORecord } from "./lib/metadata-extractor";

// Export route discovery (server-side)
export { discoverNextJSRoutes } from "./lib/route-discovery";

// Export crawlability validator (server-side)
export { validateCrawlability, validateRobotsTxt, validatePublicAccess } from "./lib/validation/crawlability-validator";
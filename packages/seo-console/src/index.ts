/**
 * SEO Console Package
 * 
 * Main entry point for the SEO Console package.
 * CLIENT-SAFE exports only - use @seo-console/package/server for server-side code.
 * Provides SEO validation and management for Next.js applications.
 */

// Export components (client-safe)
export * from "./components";

// Export types (client-safe)
export type { SEORecord, CreateSEORecord, UpdateSEORecord } from "./lib/validation/seo-schema";
export type { ValidationResult, ValidationIssue } from "./lib/validation/html-validator";
export type { ImageValidationResult } from "./lib/validation/image-validator";

// Export validation schemas (client-safe - Zod schemas)
export { createSEORecordSchema, updateSEORecordSchema } from "./lib/validation/seo-schema";

// Export utilities (client-safe)
export { discoverNextJSRoutes, generateExamplePaths } from "./lib/route-discovery";
export type { DiscoveredRoute } from "./lib/route-discovery";
export { extractMetadataFromHTML, extractMetadataFromURL, crawlSiteForSEO, metadataToSEORecord } from "./lib/metadata-extractor";
export type { ExtractedMetadata } from "./lib/metadata-extractor";
export { generateSitemapXML, generateSitemapFromRecords, seoRecordsToSitemapEntries, validateSitemapEntry } from "./lib/sitemap-generator";
export type { SitemapEntry, SitemapOptions } from "./lib/sitemap-generator";
export { generateRobotsTxt, updateRobotsTxtWithSitemap, extractSitemapFromRobotsTxt } from "./lib/robots-generator";
export type { RobotsTxtOptions } from "./lib/robots-generator";

// Export storage adapters (client-safe interfaces)
export type { StorageAdapter, StorageType, StorageConfig } from "./lib/storage/storage-adapter";
export { createStorageAdapter, detectStorageConfig } from "./lib/storage/storage-factory";
export { FileStorage } from "./lib/storage/file-storage";

// NOTE: Server-side functions (validateOGImage, validateHTML, validateURL, database functions, hooks)
// are exported from @seo-console/package/server to prevent client bundle issues
// Hooks like useGenerateMetadata use server-only code and should be imported from ./server

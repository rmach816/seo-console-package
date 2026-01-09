import { z } from "zod";

// Open Graph types
export const ogTypeSchema = z.enum([
  "website",
  "article",
  "product",
  "book",
  "profile",
  "music",
  "video",
]);

// Twitter Card types
export const twitterCardSchema = z.enum([
  "summary",
  "summary_large_image",
  "app",
  "player",
]);

// Validation status
export const validationStatusSchema = z.enum([
  "pending",
  "valid",
  "invalid",
  "warning",
]);

// Base SEO metadata schema
export const seoMetadataSchema = z.object({
  // Basic metadata
  title: z.string().max(60, "Title must be 60 characters or less").optional(),
  description: z
    .string()
    .max(160, "Description must be 160 characters or less")
    .optional(),
  keywords: z.array(z.string()).optional(),

  // Open Graph
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(200).optional(),
  ogImageUrl: z.string().url("Must be a valid URL").optional(),
  ogImageWidth: z.number().int().positive().max(1200).optional(),
  ogImageHeight: z.number().int().positive().max(1200).optional(),
  ogType: ogTypeSchema.optional(),
  ogUrl: z.string().url("Must be a valid URL").optional(),
  ogSiteName: z.string().optional(),

  // Twitter Card
  twitterCard: twitterCardSchema.optional(),
  twitterTitle: z.string().max(70).optional(),
  twitterDescription: z.string().max(200).optional(),
  twitterImageUrl: z.string().url("Must be a valid URL").optional(),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),

  // Additional metadata
  canonicalUrl: z.string().url("Must be a valid URL").optional(),
  robots: z.string().optional(),
  author: z.string().optional(),
  publishedTime: z.coerce.date().optional(),
  modifiedTime: z.coerce.date().optional(),

  // Structured data
  structuredData: z.record(z.unknown()).optional(),
});

// Full SEO record schema (for database operations)
export const seoRecordSchema = seoMetadataSchema.extend({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  routePath: z
    .string()
    .min(1, "Route path is required")
    .regex(/^\/.*/, "Route path must start with /"),
  validationStatus: validationStatusSchema.optional(),
  lastValidatedAt: z.coerce.date().optional(),
  validationErrors: z.record(z.unknown()).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for creating a new SEO record
export const createSEORecordSchema = seoRecordSchema.omit({
  id: true,
  validationStatus: true,
  lastValidatedAt: true,
  validationErrors: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an SEO record
export const updateSEORecordSchema = seoRecordSchema
  .partial()
  .required({ id: true })
  .omit({
    userId: true,
    createdAt: true,
  });

// Type exports
export type OGType = z.infer<typeof ogTypeSchema>;
export type TwitterCard = z.infer<typeof twitterCardSchema>;
export type ValidationStatus = z.infer<typeof validationStatusSchema>;
export type SEOMetadata = z.infer<typeof seoMetadataSchema>;
export type SEORecord = z.infer<typeof seoRecordSchema>;
export type CreateSEORecord = z.infer<typeof createSEORecordSchema>;
export type UpdateSEORecord = z.infer<typeof updateSEORecordSchema>;

/**
 * Storage Adapter Interface
 * Allows SEO Console to work with different storage backends
 */

import type { CreateSEORecord, UpdateSEORecord, SEORecord } from "../../lib/validation/seo-schema";

export interface StorageAdapter {
  /**
   * Get all SEO records
   */
  getRecords(): Promise<SEORecord[]>;

  /**
   * Get a single SEO record by ID
   */
  getRecordById(id: string): Promise<SEORecord | null>;

  /**
   * Get SEO record by route path
   */
  getRecordByRoute(routePath: string): Promise<SEORecord | null>;

  /**
   * Create a new SEO record
   */
  createRecord(record: CreateSEORecord): Promise<SEORecord>;

  /**
   * Update an existing SEO record
   */
  updateRecord(record: UpdateSEORecord): Promise<SEORecord>;

  /**
   * Delete an SEO record
   */
  deleteRecord(id: string): Promise<void>;

  /**
   * Check if storage is available/configured
   */
  isAvailable(): Promise<boolean>;
}

export type StorageType = "file" | "memory";

export interface StorageConfig {
  type?: StorageType; // Optional, defaults to "file"
  // File storage config
  filePath?: string;
}

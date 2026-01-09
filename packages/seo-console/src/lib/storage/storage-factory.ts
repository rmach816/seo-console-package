/**
 * Storage Factory
 * Creates file-based storage adapter
 */

import type { StorageAdapter, StorageConfig } from "./storage-adapter";
import { FileStorage } from "./file-storage";

export function createStorageAdapter(config?: StorageConfig): StorageAdapter {
  const filePath = config?.filePath || process.env.SEO_CONSOLE_STORAGE_PATH || "seo-records.json";
  return new FileStorage(filePath);
}

/**
 * Auto-detect storage config from environment
 */
export function detectStorageConfig(): StorageConfig {
  return {
    type: "file",
    filePath: process.env.SEO_CONSOLE_STORAGE_PATH || "seo-records.json",
  };
}

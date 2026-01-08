/**
 * Storage Factory
 * Creates the appropriate storage adapter based on configuration
 */

import type { StorageAdapter, StorageConfig } from "./storage-adapter";
import { FileStorage } from "./file-storage";
import { SupabaseStorage } from "./supabase-storage";

export function createStorageAdapter(config: StorageConfig): StorageAdapter {
  switch (config.type) {
    case "file":
      return new FileStorage(config.filePath || "seo-records.json");
    
    case "supabase":
      if (!config.supabaseUrl || !config.supabaseKey) {
        throw new Error("Supabase URL and key are required for Supabase storage");
      }
      return new SupabaseStorage(config.supabaseUrl, config.supabaseKey);
    
    case "memory":
      // For testing - stores in memory only
      return new FileStorage(":memory:");
    
    default:
      throw new Error(`Unsupported storage type: ${config.type}`);
  }
}

/**
 * Auto-detect storage type from environment
 */
export function detectStorageConfig(): StorageConfig {
  // Check for Supabase config
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      type: "supabase",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  // Check for file storage config
  if (process.env.SEO_CONSOLE_STORAGE_PATH) {
    return {
      type: "file",
      filePath: process.env.SEO_CONSOLE_STORAGE_PATH,
    };
  }

  // Default to file storage
  return {
    type: "file",
    filePath: "seo-records.json",
  };
}

/**
 * Supabase Storage Adapter
 * Wraps the existing Supabase database functions
 */

import type { StorageAdapter } from "./storage-adapter";
import type { CreateSEORecord, UpdateSEORecord, SEORecord } from "../../lib/validation/seo-schema";
import {
  getSEORecords,
  getSEORecordById,
  getSEORecordByRoute,
  createSEORecord,
  updateSEORecord,
  deleteSEORecord,
} from "../database/seo-records";

export class SupabaseStorage implements StorageAdapter {
  constructor(
    private supabaseUrl: string,
    private supabaseKey: string
  ) {
    // Set environment variables for database functions
    if (typeof process !== "undefined") {
      process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseKey;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const result = await getSEORecords();
      return result.success;
    } catch {
      return false;
    }
  }

  async getRecords(): Promise<SEORecord[]> {
    const result = await getSEORecords();
    if (!result.success) {
      throw new Error(result.error?.message || "Failed to get records");
    }
    return result.data;
  }

  async getRecordById(id: string): Promise<SEORecord | null> {
    const result = await getSEORecordById(id);
    if (!result.success) {
      if (result.error?.message?.includes("not found")) {
        return null;
      }
      throw new Error(result.error?.message || "Failed to get record");
    }
    return result.data || null;
  }

  async getRecordByRoute(routePath: string): Promise<SEORecord | null> {
    const result = await getSEORecordByRoute(routePath);
    if (!result.success) {
      if (result.error?.message?.includes("not found")) {
        return null;
      }
      throw new Error(result.error?.message || "Failed to get record");
    }
    return result.data || null;
  }

  async createRecord(record: CreateSEORecord): Promise<SEORecord> {
    const result = await createSEORecord(record);
    if (!result.success) {
      throw new Error(result.error?.message || "Failed to create record");
    }
    return result.data;
  }

  async updateRecord(record: UpdateSEORecord): Promise<SEORecord> {
    const result = await updateSEORecord(record);
    if (!result.success) {
      throw new Error(result.error?.message || "Failed to update record");
    }
    return result.data;
  }

  async deleteRecord(id: string): Promise<void> {
    const result = await deleteSEORecord(id);
    if (!result.success) {
      throw new Error(result.error?.message || "Failed to delete record");
    }
  }
}

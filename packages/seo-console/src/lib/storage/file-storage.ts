/**
 * File-based storage adapter
 * Stores SEO records in a JSON file
 * No database required!
 */

import { promises as fs } from "fs";
import { join } from "path";
import type { StorageAdapter } from "./storage-adapter";
import type { CreateSEORecord, UpdateSEORecord, SEORecord } from "../../lib/validation/seo-schema";

export class FileStorage implements StorageAdapter {
  private filePath: string;
  private records: SEORecord[] = [];
  private initialized = false;

  constructor(filePath: string = "seo-records.json") {
    this.filePath = filePath;
  }

  private async ensureInitialized() {
    if (this.initialized) return;

    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.records = JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // File doesn't exist, start with empty array
        this.records = [];
        await this.save();
      } else {
        throw error;
      }
    }
    this.initialized = true;
  }

  private async save() {
    await fs.writeFile(this.filePath, JSON.stringify(this.records, null, 2), "utf-8");
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if we can write to the directory
      const dir = this.filePath.includes("/") ? this.filePath.substring(0, this.filePath.lastIndexOf("/")) : ".";
      await fs.access(dir);
      return true;
    } catch {
      return false;
    }
  }

  async getRecords(): Promise<SEORecord[]> {
    await this.ensureInitialized();
    return [...this.records];
  }

  async getRecordById(id: string): Promise<SEORecord | null> {
    await this.ensureInitialized();
    return this.records.find((r) => r.id === id) || null;
  }

  async getRecordByRoute(routePath: string): Promise<SEORecord | null> {
    await this.ensureInitialized();
    return this.records.find((r) => r.routePath === routePath) || null;
  }

  async createRecord(record: CreateSEORecord): Promise<SEORecord> {
    await this.ensureInitialized();
    
    const newRecord: SEORecord = {
      id: typeof crypto !== "undefined" && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: "file-user", // File storage doesn't need user IDs
      routePath: record.routePath,
      title: record.title,
      description: record.description,
      keywords: record.keywords,
      ogTitle: record.ogTitle,
      ogDescription: record.ogDescription,
      ogImageUrl: record.ogImageUrl,
      ogImageWidth: record.ogImageWidth,
      ogImageHeight: record.ogImageHeight,
      ogType: record.ogType,
      ogUrl: record.ogUrl,
      ogSiteName: record.ogSiteName,
      twitterCard: record.twitterCard,
      twitterTitle: record.twitterTitle,
      twitterDescription: record.twitterDescription,
      twitterImageUrl: record.twitterImageUrl,
      twitterSite: record.twitterSite,
      twitterCreator: record.twitterCreator,
      canonicalUrl: record.canonicalUrl,
      robots: record.robots,
      author: record.author,
      publishedTime: record.publishedTime,
      modifiedTime: record.modifiedTime,
      structuredData: record.structuredData,
      validationStatus: "pending",
      lastValidatedAt: undefined,
      validationErrors: undefined,
    };

    this.records.push(newRecord);
    await this.save();
    return newRecord;
  }

  async updateRecord(record: UpdateSEORecord): Promise<SEORecord> {
    await this.ensureInitialized();
    
    const index = this.records.findIndex((r) => r.id === record.id);
    if (index === -1) {
      throw new Error(`SEO record with id ${record.id} not found`);
    }

    const updated: SEORecord = {
      ...this.records[index],
      ...record,
    };

    this.records[index] = updated;
    await this.save();
    return updated;
  }

  async deleteRecord(id: string): Promise<void> {
    await this.ensureInitialized();
    
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`SEO record with id ${id} not found`);
    }

    this.records.splice(index, 1);
    await this.save();
  }
}

import { createClient } from "../supabase/server";
import type { Database } from "../../types/database.types";
import type {
  CreateSEORecord,
  UpdateSEORecord,
  SEORecord,
} from "../validation/seo-schema";

type SEORecordRow = Database["public"]["Tables"]["seo_records"]["Row"];
type SEORecordInsert = Database["public"]["Tables"]["seo_records"]["Insert"];
type SEORecordUpdate = Database["public"]["Tables"]["seo_records"]["Update"];

// Transform database row to SEORecord type
function transformRowToSEORecord(row: SEORecordRow): SEORecord {
  return {
    id: row.id,
    userId: row.user_id,
    routePath: row.route_path,
    title: row.title ?? undefined,
    description: row.description ?? undefined,
    keywords: row.keywords ?? undefined,
    ogTitle: row.og_title ?? undefined,
    ogDescription: row.og_description ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    ogImageWidth: row.og_image_width ?? undefined,
    ogImageHeight: row.og_image_height ?? undefined,
    ogType: (row.og_type as SEORecord["ogType"]) ?? undefined,
    ogUrl: row.og_url ?? undefined,
    ogSiteName: row.og_site_name ?? undefined,
    twitterCard: (row.twitter_card as SEORecord["twitterCard"]) ?? undefined,
    twitterTitle: row.twitter_title ?? undefined,
    twitterDescription: row.twitter_description ?? undefined,
    twitterImageUrl: row.twitter_image_url ?? undefined,
    twitterSite: row.twitter_site ?? undefined,
    twitterCreator: row.twitter_creator ?? undefined,
    canonicalUrl: row.canonical_url ?? undefined,
    robots: row.robots ?? undefined,
    author: row.author ?? undefined,
    publishedTime: row.published_time
      ? new Date(row.published_time)
      : undefined,
    modifiedTime: row.modified_time
      ? new Date(row.modified_time)
      : undefined,
    structuredData: row.structured_data
      ? (row.structured_data as unknown as Record<string, unknown>)
      : undefined,
    validationStatus: (row.validation_status as SEORecord["validationStatus"]) ?? undefined,
    lastValidatedAt: row.last_validated_at
      ? new Date(row.last_validated_at)
      : undefined,
    validationErrors: row.validation_errors
      ? (row.validation_errors as unknown as Record<string, unknown>)
      : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Transform SEORecord to database insert format
function transformToInsert(
  record: CreateSEORecord
): Omit<SEORecordInsert, "id" | "created_at" | "updated_at"> {
  return {
    user_id: record.userId,
    route_path: record.routePath,
    title: record.title ?? null,
    description: record.description ?? null,
    keywords: record.keywords ?? null,
    og_title: record.ogTitle ?? null,
    og_description: record.ogDescription ?? null,
    og_image_url: record.ogImageUrl ?? null,
    og_image_width: record.ogImageWidth ?? null,
    og_image_height: record.ogImageHeight ?? null,
    og_type: record.ogType ?? null,
    og_url: record.ogUrl ?? null,
    og_site_name: record.ogSiteName ?? null,
    twitter_card: record.twitterCard ?? null,
    twitter_title: record.twitterTitle ?? null,
    twitter_description: record.twitterDescription ?? null,
    twitter_image_url: record.twitterImageUrl ?? null,
    twitter_site: record.twitterSite ?? null,
    twitter_creator: record.twitterCreator ?? null,
    canonical_url: record.canonicalUrl ?? null,
    robots: record.robots ?? null,
    author: record.author ?? null,
    published_time: record.publishedTime?.toISOString() ?? null,
    modified_time: record.modifiedTime?.toISOString() ?? null,
    structured_data: (record.structuredData as unknown as Database["public"]["Tables"]["seo_records"]["Row"]["structured_data"]) ?? null,
  };
}

// Transform SEORecord to database update format
function transformToUpdate(
  record: Omit<UpdateSEORecord, "id">
): Omit<SEORecordUpdate, "updated_at"> {
  const update: Partial<SEORecordUpdate> = {};

  if (record.routePath !== undefined) update.route_path = record.routePath;
  if (record.title !== undefined) update.title = record.title ?? null;
  if (record.description !== undefined)
    update.description = record.description ?? null;
  if (record.keywords !== undefined) update.keywords = record.keywords ?? null;
  if (record.ogTitle !== undefined) update.og_title = record.ogTitle ?? null;
  if (record.ogDescription !== undefined)
    update.og_description = record.ogDescription ?? null;
  if (record.ogImageUrl !== undefined)
    update.og_image_url = record.ogImageUrl ?? null;
  if (record.ogImageWidth !== undefined)
    update.og_image_width = record.ogImageWidth ?? null;
  if (record.ogImageHeight !== undefined)
    update.og_image_height = record.ogImageHeight ?? null;
  if (record.ogType !== undefined) update.og_type = record.ogType ?? null;
  if (record.ogUrl !== undefined) update.og_url = record.ogUrl ?? null;
  if (record.ogSiteName !== undefined)
    update.og_site_name = record.ogSiteName ?? null;
  if (record.twitterCard !== undefined)
    update.twitter_card = record.twitterCard ?? null;
  if (record.twitterTitle !== undefined)
    update.twitter_title = record.twitterTitle ?? null;
  if (record.twitterDescription !== undefined)
    update.twitter_description = record.twitterDescription ?? null;
  if (record.twitterImageUrl !== undefined)
    update.twitter_image_url = record.twitterImageUrl ?? null;
  if (record.twitterSite !== undefined)
    update.twitter_site = record.twitterSite ?? null;
  if (record.twitterCreator !== undefined)
    update.twitter_creator = record.twitterCreator ?? null;
  if (record.canonicalUrl !== undefined)
    update.canonical_url = record.canonicalUrl ?? null;
  if (record.robots !== undefined) update.robots = record.robots ?? null;
  if (record.author !== undefined) update.author = record.author ?? null;
  if (record.publishedTime !== undefined)
    update.published_time = record.publishedTime?.toISOString() ?? null;
  if (record.modifiedTime !== undefined)
    update.modified_time = record.modifiedTime?.toISOString() ?? null;
  if (record.structuredData !== undefined)
    update.structured_data = (record.structuredData as unknown as Database["public"]["Tables"]["seo_records"]["Row"]["structured_data"]) ?? null;
  if (record.validationStatus !== undefined)
    update.validation_status = record.validationStatus ?? null;
  if (record.lastValidatedAt !== undefined)
    update.last_validated_at = record.lastValidatedAt?.toISOString() ?? null;
  if (record.validationErrors !== undefined)
    update.validation_errors = (record.validationErrors as unknown as Database["public"]["Tables"]["seo_records"]["Row"]["validation_errors"]) ?? null;

  return update;
}

// Result type for operations
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Get all SEO records for the current user
 */
export async function getSEORecords(): Promise<Result<SEORecord[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const { data, error } = await supabase
      .from("seo_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error };
    }

    const records = (data || []).map(transformRowToSEORecord);
    return { success: true, data: records };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Get a single SEO record by ID
 */
export async function getSEORecordById(
  id: string
): Promise<Result<SEORecord>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const { data, error } = await supabase
      .from("seo_records")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return { success: false, error };
    }

    if (!data) {
      return {
        success: false,
        error: new Error("SEO record not found"),
      };
    }

    return { success: true, data: transformRowToSEORecord(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Get SEO record by route path
 */
export async function getSEORecordByRoute(
  routePath: string
): Promise<Result<SEORecord | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const { data, error } = await supabase
      .from("seo_records")
      .select("*")
      .eq("route_path", routePath)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return { success: false, error };
    }

    if (!data) {
      return { success: true, data: null };
    }

    return { success: true, data: transformRowToSEORecord(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Create a new SEO record
 */
export async function createSEORecord(
  record: CreateSEORecord
): Promise<Result<SEORecord>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const insertData = transformToInsert({ ...record, userId: user.id });

    const { data, error } = await supabase
      .from("seo_records")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: transformRowToSEORecord(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Update an existing SEO record
 */
export async function updateSEORecord(
  record: UpdateSEORecord
): Promise<Result<SEORecord>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const { id, ...updateData } = record;
    const transformedUpdate = transformToUpdate(updateData);

    const { data, error } = await supabase
      .from("seo_records")
      .update(transformedUpdate)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error };
    }

    if (!data) {
      return {
        success: false,
        error: new Error("SEO record not found"),
      };
    }

    return { success: true, data: transformRowToSEORecord(data) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

/**
 * Delete an SEO record
 */
export async function deleteSEORecord(id: string): Promise<Result<void>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: new Error("User not authenticated"),
      };
    }

    const { error } = await supabase
      .from("seo_records")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}

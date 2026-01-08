// Generated database types
// Run: npx supabase gen types typescript --local > types/database.types.ts
// to generate actual types from your database

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      seo_records: {
        Row: {
          id: string;
          user_id: string;
          route_path: string;
          title: string | null;
          description: string | null;
          keywords: string[] | null;
          og_title: string | null;
          og_description: string | null;
          og_image_url: string | null;
          og_image_width: number | null;
          og_image_height: number | null;
          og_type: string | null;
          og_url: string | null;
          og_site_name: string | null;
          twitter_card: string | null;
          twitter_title: string | null;
          twitter_description: string | null;
          twitter_image_url: string | null;
          twitter_site: string | null;
          twitter_creator: string | null;
          canonical_url: string | null;
          robots: string | null;
          author: string | null;
          published_time: string | null;
          modified_time: string | null;
          structured_data: Json | null;
          validation_status: string | null;
          last_validated_at: string | null;
          validation_errors: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          route_path: string;
          title?: string | null;
          description?: string | null;
          keywords?: string[] | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          og_image_width?: number | null;
          og_image_height?: number | null;
          og_type?: string | null;
          og_url?: string | null;
          og_site_name?: string | null;
          twitter_card?: string | null;
          twitter_title?: string | null;
          twitter_description?: string | null;
          twitter_image_url?: string | null;
          twitter_site?: string | null;
          twitter_creator?: string | null;
          canonical_url?: string | null;
          robots?: string | null;
          author?: string | null;
          published_time?: string | null;
          modified_time?: string | null;
          structured_data?: Json | null;
          validation_status?: string | null;
          last_validated_at?: string | null;
          validation_errors?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          route_path?: string;
          title?: string | null;
          description?: string | null;
          keywords?: string[] | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          og_image_width?: number | null;
          og_image_height?: number | null;
          og_type?: string | null;
          og_url?: string | null;
          og_site_name?: string | null;
          twitter_card?: string | null;
          twitter_title?: string | null;
          twitter_description?: string | null;
          twitter_image_url?: string | null;
          twitter_site?: string | null;
          twitter_creator?: string | null;
          canonical_url?: string | null;
          robots?: string | null;
          author?: string | null;
          published_time?: string | null;
          modified_time?: string | null;
          structured_data?: Json | null;
          validation_status?: string | null;
          last_validated_at?: string | null;
          validation_errors?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

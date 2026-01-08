-- SEO Records schema
-- Phase 1.1: Database setup for SEO validation package

-- SEO records table
CREATE TABLE IF NOT EXISTS public.seo_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  route_path TEXT NOT NULL,
  
  -- Basic metadata
  title TEXT,
  description TEXT,
  keywords TEXT[],
  
  -- Open Graph metadata
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  og_image_width INTEGER,
  og_image_height INTEGER,
  og_type TEXT DEFAULT 'website',
  og_url TEXT,
  og_site_name TEXT,
  
  -- Twitter Card metadata
  twitter_card TEXT DEFAULT 'summary',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image_url TEXT,
  twitter_site TEXT,
  twitter_creator TEXT,
  
  -- Additional metadata
  canonical_url TEXT,
  robots TEXT,
  author TEXT,
  published_time TIMESTAMPTZ,
  modified_time TIMESTAMPTZ,
  
  -- Structured data (JSON-LD)
  structured_data JSONB,
  
  -- Validation status
  validation_status TEXT DEFAULT 'pending',
  last_validated_at TIMESTAMPTZ,
  validation_errors JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_route UNIQUE (user_id, route_path),
  CONSTRAINT valid_og_type CHECK (og_type IN ('website', 'article', 'product', 'book', 'profile', 'music', 'video')),
  CONSTRAINT valid_twitter_card CHECK (twitter_card IN ('summary', 'summary_large_image', 'app', 'player')),
  CONSTRAINT valid_validation_status CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning'))
);

-- Enable Row Level Security
ALTER TABLE public.seo_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own SEO records"
  ON public.seo_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SEO records"
  ON public.seo_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SEO records"
  ON public.seo_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SEO records"
  ON public.seo_records FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_seo_records_user_id ON public.seo_records(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_records_route_path ON public.seo_records(route_path);
CREATE INDEX IF NOT EXISTS idx_seo_records_validation_status ON public.seo_records(validation_status);
CREATE INDEX IF NOT EXISTS idx_seo_records_created_at ON public.seo_records(created_at DESC);

-- Apply updated_at trigger
CREATE TRIGGER update_seo_records_updated_at
  BEFORE UPDATE ON public.seo_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

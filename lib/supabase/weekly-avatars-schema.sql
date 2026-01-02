-- Weekly Avatars Schema
-- Run this in Supabase SQL Editor

-- Create the weekly_avatars table
CREATE TABLE IF NOT EXISTS weekly_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_date DATE NOT NULL UNIQUE, -- The Monday of the week this avatar represents
  image_url TEXT NOT NULL, -- Cloudinary URL for the generated image
  headlines JSONB NOT NULL, -- Array of headline objects { title, source, url }
  generated_prompt TEXT NOT NULL, -- The AI-generated prompt used for image generation
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'success', 'failed')),
  error_message TEXT, -- Error message if generation failed
  is_paused BOOLEAN DEFAULT FALSE, -- Manual override to pause generation (for sensitive events)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient date lookups
CREATE INDEX IF NOT EXISTS idx_weekly_avatars_week_date ON weekly_avatars(week_date DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_avatars_status ON weekly_avatars(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_weekly_avatars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS weekly_avatars_updated_at ON weekly_avatars;
CREATE TRIGGER weekly_avatars_updated_at
  BEFORE UPDATE ON weekly_avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_avatars_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE weekly_avatars ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (avatars are public content)
CREATE POLICY "Allow public read access" ON weekly_avatars
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert/update/delete
CREATE POLICY "Service role full access" ON weekly_avatars
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

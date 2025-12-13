-- Migration to add cover image support to playlists
-- Run this in your Supabase SQL editor

-- Add cover_image_url column to playlists table
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

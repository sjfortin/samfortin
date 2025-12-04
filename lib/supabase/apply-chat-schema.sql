-- Migration to add chat message support to playlists
-- Run this in your Supabase SQL editor

-- Add conversation support columns to playlists table
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS conversation_id UUID;
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS is_temporary BOOLEAN DEFAULT false;

-- Create playlist_messages table for chat history
CREATE TABLE IF NOT EXISTS playlist_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  playlist_snapshot JSONB, -- Stores the playlist state at this message
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_playlist_messages_playlist_id ON playlist_messages(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_messages_created_at ON playlist_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE playlist_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view messages for their own playlists" ON playlist_messages;
DROP POLICY IF EXISTS "Users can create messages for their own playlists" ON playlist_messages;

-- Create policies for playlist_messages
-- Users can view messages for their own playlists
CREATE POLICY "Users can view messages for their own playlists"
  ON playlist_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_messages.playlist_id
      AND playlists.clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

-- Users can insert messages for their own playlists
CREATE POLICY "Users can create messages for their own playlists"
  ON playlist_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_messages.playlist_id
      AND playlists.clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

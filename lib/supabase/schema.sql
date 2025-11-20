-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT,
  playlist_length TEXT,
  spotify_playlist_id TEXT,
  spotify_playlist_url TEXT,
  tracks_added INTEGER DEFAULT 0,
  tracks_not_found JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  artist TEXT NOT NULL,
  found_on_spotify BOOLEAN DEFAULT true,
  spotify_uri TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_playlists_clerk_user_id ON playlists(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON playlists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);

-- Enable Row Level Security (RLS)
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies for playlists
-- Users can only read their own playlists
CREATE POLICY "Users can view their own playlists"
  ON playlists FOR SELECT
  USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Users can insert their own playlists
CREATE POLICY "Users can create their own playlists"
  ON playlists FOR INSERT
  WITH CHECK (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Users can update their own playlists
CREATE POLICY "Users can update their own playlists"
  ON playlists FOR UPDATE
  USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Users can delete their own playlists
CREATE POLICY "Users can delete their own playlists"
  ON playlists FOR DELETE
  USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Create policies for playlist_tracks
-- Users can view tracks for their own playlists
CREATE POLICY "Users can view tracks for their own playlists"
  ON playlist_tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

-- Users can insert tracks for their own playlists
CREATE POLICY "Users can create tracks for their own playlists"
  ON playlist_tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

# Supabase Database Setup

This guide explains how to set up Supabase to store user playlists.

## Overview

The app uses Supabase to:
- Store generated playlists with metadata (name, description, prompt, etc.)
- Track individual songs in each playlist
- Link playlists to Clerk user IDs
- Record which tracks were found/not found on Spotify
- Store Spotify playlist URLs for easy access

## Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name (e.g., "samfortin-playlists")
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

### 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run the Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the contents of `lib/supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** to execute

This creates:
- `playlists` table - stores playlist metadata
- `playlist_tracks` table - stores individual tracks
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamps

### 5. Install Supabase Client

Run this command in your project:

```bash
npm install @supabase/supabase-js
```

## Database Schema

### `playlists` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `clerk_user_id` | TEXT | Clerk user ID (links to your auth) |
| `name` | TEXT | Playlist name |
| `description` | TEXT | Playlist description |
| `prompt` | TEXT | User's original prompt |
| `playlist_length` | TEXT | Requested length (e.g., "1 hour") |
| `spotify_playlist_id` | TEXT | Spotify playlist ID (after creation) |
| `spotify_playlist_url` | TEXT | Spotify playlist URL |
| `tracks_added` | INTEGER | Number of tracks successfully added |
| `tracks_not_found` | JSONB | Array of tracks not found on Spotify |
| `created_at` | TIMESTAMP | When playlist was generated |
| `updated_at` | TIMESTAMP | Last update time |

### `playlist_tracks` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `playlist_id` | UUID | Foreign key to playlists |
| `name` | TEXT | Track name |
| `artist` | TEXT | Artist name |
| `found_on_spotify` | BOOLEAN | Whether track was found |
| `spotify_uri` | TEXT | Spotify track URI |
| `position` | INTEGER | Track order in playlist |
| `created_at` | TIMESTAMP | When track was added |

## Security (Row Level Security)

The schema includes RLS policies that ensure:
- ✅ Users can only see their own playlists
- ✅ Users can only create playlists for themselves
- ✅ Users can only update/delete their own playlists
- ✅ Users can only see tracks from their own playlists

This is enforced at the database level, so even if someone bypasses your API, they can't access other users' data.

## API Routes

### `POST /api/playlists`
Create a new playlist (called automatically when generating)

### `GET /api/playlists`
Fetch all playlists for the current user

### `PATCH /api/playlists/[id]`
Update playlist after Spotify creation

### `DELETE /api/playlists/[id]`
Delete a playlist

## How It Works

1. **User generates playlist** → Saved to database immediately
2. **User creates in Spotify** → Database updated with Spotify info
3. **Tracks not found** → Marked in database for reference
4. **User views playlists** → Fetched from database with all details

## Testing

1. Generate a playlist in your app
2. Go to Supabase dashboard → **Table Editor**
3. Check the `playlists` and `playlist_tracks` tables
4. You should see your data!

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure you added all three env vars to `.env.local`
- Restart your dev server after adding env vars

**Error: "relation 'playlists' does not exist"**
- Run the schema.sql in Supabase SQL Editor

**Can't see data in Supabase**
- Check RLS policies are enabled
- Make sure you're using the service role key for server-side operations

## Next Steps

- View user's playlist history
- Add playlist sharing functionality
- Export playlists to other formats
- Add playlist analytics

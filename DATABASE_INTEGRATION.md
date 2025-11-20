# Database Integration Summary

## What Was Added

Supabase database integration to store and manage user playlists with Clerk authentication.

## Files Created

### Database Configuration
- **`lib/supabase/client.ts`** - Client-side Supabase client
- **`lib/supabase/server.ts`** - Server-side Supabase client (with service role)
- **`lib/supabase/types.ts`** - TypeScript types for database tables
- **`lib/supabase/schema.sql`** - Database schema with tables, indexes, and RLS policies

### API Routes
- **`app/api/playlists/route.ts`** - GET (fetch playlists) and POST (create playlist)
- **`app/api/playlists/[id]/route.ts`** - PATCH (update) and DELETE (delete playlist)

### Updated Files
- **`app/api/generate-playlist/route.ts`** - Now saves generated playlists to database
- **`app/api/create-spotify-playlist/route.ts`** - Updates database after Spotify creation
- **`components/PlaylistGenerator.tsx`** - Passes playlistId to Spotify creation
- **`.env.example`** - Added Supabase environment variables

### Documentation
- **`SUPABASE_SETUP.md`** - Complete setup guide

## Database Schema

### Tables

**`playlists`**
- Stores playlist metadata (name, description, prompt, etc.)
- Links to Clerk user via `clerk_user_id`
- Tracks Spotify playlist info after creation
- Records which tracks weren't found

**`playlist_tracks`**
- Stores individual tracks for each playlist
- Tracks position, artist, name
- Marks if track was found on Spotify
- Stores Spotify URI if available

### Security

Row Level Security (RLS) ensures:
- Users can only access their own playlists
- All operations are scoped to the authenticated user
- Database-level security (can't be bypassed)

## How It Works

### Flow

1. **User generates playlist**
   ```
   User enters prompt → AI generates playlist → Saved to database
   ```

2. **User creates in Spotify**
   ```
   Playlist sent to Spotify → Database updated with Spotify info
   ```

3. **Tracks not found**
   ```
   Missing tracks marked in database → User notified
   ```

### Data Flow

```
┌─────────────────┐
│  User (Clerk)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generate API   │──────┐
└─────────────────┘      │
                         ▼
                  ┌──────────────┐
                  │   Supabase   │
                  │   Database   │
                  └──────────────┘
                         ▲
┌─────────────────┐      │
│  Spotify API    │──────┘
└─────────────────┘
```

## Setup Required

### 1. Install Package

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get API keys from Settings → API

### 3. Add Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `lib/supabase/schema.sql`
3. Run the query

## API Endpoints

### Create Playlist (Automatic)
```
POST /api/generate-playlist
Body: { prompt, playlistLength }
→ Generates playlist and saves to DB
```

### Fetch User Playlists
```
GET /api/playlists
→ Returns all playlists for authenticated user
```

### Update Playlist
```
PATCH /api/playlists/[id]
Body: { spotify_playlist_id, spotify_playlist_url, tracks_added, tracks_not_found }
→ Updates playlist after Spotify creation
```

### Delete Playlist
```
DELETE /api/playlists/[id]
→ Deletes playlist and all tracks (cascade)
```

## Benefits

✅ **Persistent Storage** - Playlists saved permanently  
✅ **User History** - Users can see all their generated playlists  
✅ **Track Metadata** - Know which songs were found/not found  
✅ **Spotify Links** - Quick access to created playlists  
✅ **Secure** - RLS ensures data isolation  
✅ **Scalable** - Supabase handles millions of rows  

## Next Steps

You can now:
- Build a playlist history page
- Show user statistics (total playlists, tracks, etc.)
- Add playlist sharing features
- Export playlists to other formats
- Add search/filter functionality

## Testing

1. Generate a playlist in your app
2. Check Supabase dashboard → Table Editor
3. See your data in `playlists` and `playlist_tracks` tables
4. Create in Spotify and see the update

## Troubleshooting

**Lint errors about @supabase/supabase-js**
- Run `npm install @supabase/supabase-js`
- Restart your dev server

**Database errors**
- Make sure you ran the schema.sql
- Check environment variables are set
- Verify Supabase project is active

**Can't see data**
- Check you're logged in with Clerk
- Verify RLS policies are enabled
- Check server logs for errors

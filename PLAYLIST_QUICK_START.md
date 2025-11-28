# Playlist Chat Feature - Quick Start Guide

## Setup Steps

### 1. Database Migration (Optional - for chat persistence)
```bash
# Run this SQL in your Supabase SQL editor
# File: /lib/supabase/playlist-chat-schema.sql
```

### 2. Environment Variables
Ensure these are set in your `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 3. Install Dependencies (if needed)
```bash
pnpm install
```

### 4. Run Development Server
```bash
pnpm dev
```

### 5. Test the Feature
Visit: `http://localhost:3000/playlists`

## Key Components

### Main Interface
- **File**: `/components/playlists/PlaylistChatInterface.tsx`
- **Purpose**: Main chat interface for playlist generation
- **Features**: Message history, playlist refinement, genre/era selection

### API Endpoint
- **File**: `/app/api/playlist-chat/route.ts`
- **Purpose**: Handles AI playlist generation with conversation context
- **Method**: POST
- **Body**:
```json
{
  "prompt": "Create a chill indie playlist",
  "playlistLength": "1",
  "genres": ["Indie", "Alternative"],
  "eras": ["2010s", "2020s"],
  "conversationHistory": [],
  "currentPlaylist": null
}
```

## Usage Examples

### Example 1: Initial Playlist
```
User: "Create a workout playlist with high energy songs"
AI: Generates 15-20 high-energy tracks
```

### Example 2: Refinement
```
User: "Make it more focused on hip hop"
AI: Adjusts playlist to include more hip hop tracks
```

### Example 3: With Filters
```
User: "90s rock playlist for a road trip"
Selected Genres: Rock
Selected Eras: 1990s
AI: Generates 90s rock playlist
```

## Common Workflows

### Workflow 1: Quick Generation (Signed In)
1. Enter prompt
2. Optionally select genres/eras
3. Click "Generate"
4. Review playlist in sidebar
5. Save to library or create on Spotify

### Workflow 2: Iterative Refinement
1. Generate initial playlist
2. Review tracks
3. Ask for modifications ("Add more upbeat songs")
4. AI updates playlist
5. Repeat until satisfied
6. Save final version

### Workflow 3: Unauthenticated User
1. Visit `/playlists` → See landing page
2. Sign in
3. Generate playlist
4. Try to save → Works immediately (already signed in)

## Troubleshooting

### Issue: "Failed to generate playlist"
- Check GEMINI_API_KEY is set
- Check API quota/limits
- Check browser console for errors

### Issue: "Failed to create Spotify playlist"
- Ensure user has connected Spotify via Clerk
- Check Spotify OAuth scopes
- Verify token refresh is working

### Issue: Genres/Eras not affecting results
- Check API request includes filters
- Verify AI prompt includes filter context
- Test with more specific genre combinations

### Issue: Sign-in prompt not appearing
- Check Clerk configuration
- Verify `useUser()` hook is working
- Check browser console for auth errors

## File Structure

```
/app
  /playlists
    page.tsx                          # Main page (uses chat interface)
  /api
    /playlist-chat
      route.ts                        # New chat API endpoint
    /create-spotify-playlist
      route.ts                        # Modified to work without auth

/components
  /playlists
    PlaylistChatInterface.tsx         # Main chat UI
    ChatMessage.tsx                   # Message component
    GenreSelector.tsx                 # Genre selection
    EraSelector.tsx                   # Era selection
    PlaylistDetail.tsx                # Modified (no auto-open)
    types.ts                          # Updated types

/lib
  /supabase
    playlist-chat-schema.sql          # Database schema
```

## Next Steps

1. **Test thoroughly** - Try different prompts and refinements
2. **Customize genres** - Add/remove genres in `GenreSelector.tsx`
3. **Adjust AI prompts** - Modify system prompts in `/app/api/playlist-chat/route.ts`
4. **Add analytics** - Track popular genres, eras, and prompts
5. **Implement persistence** - Save conversation history to database

## Tips for Best Results

### Prompt Engineering
- Be specific about mood/vibe
- Mention specific artists as examples
- Describe the use case (workout, study, party, etc.)
- Use the genre/era selectors for better targeting

### Refinement Strategies
- Start broad, then narrow down
- Ask for specific changes ("more upbeat", "slower tempo")
- Reference specific tracks ("more like song X")
- Adjust length incrementally

### User Experience
- Encourage users to iterate
- Show example prompts on empty state
- Provide feedback during generation
- Make it easy to start over

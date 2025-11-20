# Spotify Integration Setup

This document explains how the Spotify integration works with Clerk OAuth.

## Overview

The implementation uses **Clerk's built-in Spotify OAuth** to authenticate users. When users sign in with Spotify via Clerk, the OAuth tokens are automatically managed by Clerk, and we can access them to make Spotify API calls.

## Clerk Configuration

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Configure** → **SSO Connections**
3. Enable **Spotify** as an OAuth provider
4. Add your Spotify Client ID and Client Secret
5. Configure the required scopes:
   - `playlist-modify-public`
   - `playlist-modify-private`
   - `user-read-private`
   - `user-read-email`

**Note**: The implementation uses Clerk's `getUserOauthAccessToken()` method to retrieve the Spotify OAuth token. While this method is marked as deprecated in the Clerk SDK, it's currently the only way to access OAuth provider tokens from the backend.

## Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (or use existing one)
3. Add Clerk's redirect URI (found in your Clerk Spotify OAuth settings)
4. Copy the Client ID and Client Secret to Clerk dashboard

## How It Works

### Token Management
- Users sign in with Spotify through Clerk
- Clerk automatically stores and manages OAuth tokens
- Tokens are automatically refreshed by Clerk
- No custom OAuth flow needed
- No database required

### User Flow
1. User signs in with Spotify via Clerk
2. Clerk handles OAuth and stores tokens
3. User navigates to `/playlists`
4. User generates a playlist with AI
5. Playlist is created in their Spotify account

### API Routes

#### `/api/spotify/status`
Checks if user signed in with Spotify OAuth

#### `/api/generate-playlist`
Generates playlist using Gemini AI

#### `/api/create-spotify-playlist`
Creates playlist in user's Spotify account using Clerk-managed tokens

### Token Management (`lib/spotify/token-manager.ts`)

#### `getSpotifyTokens()`
Gets OAuth tokens from Clerk for the authenticated user

#### `fetchSpotifyWithRefresh()`
Makes Spotify API requests using Clerk-managed tokens

## Features

✅ **Automatic token refresh** - Clerk handles token refresh automatically
✅ **No database required** - Clerk manages OAuth tokens
✅ **No custom OAuth flow** - Uses Clerk's built-in Spotify OAuth
✅ **Clean separation** - Token management is isolated in utility functions
✅ **Error handling** - Proper error handling throughout
✅ **Type safety** - Full TypeScript support

## Testing

1. Configure Spotify OAuth in Clerk Dashboard
2. Start your dev server: `npm run dev`
3. Sign in with Spotify
4. Go to `/playlists`
5. Generate a playlist
6. Create it in Spotify

## Required Spotify Scopes

Configure these in Clerk's Spotify OAuth settings:
- `playlist-modify-public` - Create public playlists
- `playlist-modify-private` - Create private playlists
- `user-read-private` - Read user profile
- `user-read-email` - Read user email

## Security Notes

- OAuth tokens are managed by Clerk (server-side only)
- Tokens are never exposed to the client
- Clerk automatically handles token refresh
- All Spotify API calls are made server-side

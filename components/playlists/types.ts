export interface Track {
  name: string;
  artist: string;
  uri?: string;
}

export interface PlaylistResponse {
  name: string;
  description: string;
  tracks: Track[];
  playlistId?: string; // Database ID
}

export interface PlaylistTrack {
  id: string;
  name: string;
  artist: string;
  found_on_spotify: boolean;
  spotify_uri: string | null;
  position: number;
}

export interface SavedPlaylist {
  id: string;
  clerk_user_id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  playlist_length: string | null;
  spotify_playlist_id: string | null;
  spotify_playlist_url: string | null;
  tracks_added: number;
  tracks_not_found: any;
  created_at: string;
  updated_at: string;
  is_temporary?: boolean;
  conversation_id?: string | null;
  playlist_tracks?: PlaylistTrack[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  playlist?: PlaylistResponse;
  timestamp: Date;
}

export interface PlaylistGenerationOptions {
  genres?: string[];
  eras?: string[];
  playlistLength: string;
}

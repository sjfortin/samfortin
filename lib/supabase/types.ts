export interface Playlist {
  id: string;
  clerk_user_id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  playlist_length: string | null;
  spotify_playlist_id: string | null;
  spotify_playlist_url: string | null;
  tracks_added: number;
  tracks_not_found: TrackNotFound[];
  created_at: string;
  updated_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  name: string;
  artist: string;
  found_on_spotify: boolean;
  spotify_uri: string | null;
  position: number;
  created_at: string;
}

export interface TrackNotFound {
  name: string;
  artist: string;
}

export interface CreatePlaylistInput {
  clerk_user_id: string;
  name: string;
  description: string;
  prompt: string;
  playlist_length: string;
  tracks: {
    name: string;
    artist: string;
  }[];
}

export interface UpdatePlaylistAfterSpotifyCreation {
  spotify_playlist_id: string;
  spotify_playlist_url: string;
  tracks_added: number;
  tracks_not_found: TrackNotFound[];
}

// Christmas Types
export interface ChristmasPerson {
  id: string;
  clerk_user_id: string;
  name: string;
  budget: number;
  created_at: string;
  gifts?: ChristmasGift[];
}

export interface ChristmasGift {
  id: string;
  person_id: string;
  name: string;
  link: string | null;
  cost: number;
  status: 'idea' | 'bought';
  created_at: string;
}

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

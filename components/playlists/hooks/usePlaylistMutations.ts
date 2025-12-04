import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PlaylistResponse } from '../types';

// Fetch all playlists
export function usePlaylists() {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch('/api/playlists');
      if (!response.ok) throw new Error('Failed to fetch playlists');
      return response.json();
    },
  });
}

// Fetch single playlist with chat history
export async function fetchPlaylistWithHistory(playlistId: string) {
  const [playlistResponse, messagesResponse] = await Promise.all([
    fetch(`/api/playlists/${playlistId}`),
    fetch(`/api/playlist-messages?playlistId=${playlistId}`),
  ]);

  if (!playlistResponse.ok || !messagesResponse.ok) {
    throw new Error('Failed to fetch playlist data');
  }

  const { playlist } = await playlistResponse.json();
  const messages = await messagesResponse.json();

  return { playlist, messages };
}

// Generate playlist mutation
interface GeneratePlaylistParams {
  prompt: string;
  playlistLength: string;
  genres: string[];
  eras: string[];
  conversationHistory: Array<{ role: string; content: string }>;
  currentPlaylist: PlaylistResponse | null;
  isModification: boolean;
}

export function useGeneratePlaylist() {
  return useMutation({
    mutationFn: async (params: GeneratePlaylistParams) => {
      const response = await fetch('/api/playlist-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          playlistLength: params.playlistLength,
          genres: params.genres,
          eras: params.eras,
          conversationHistory: params.conversationHistory,
          currentPlaylist: params.isModification ? params.currentPlaylist : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }

      return response.json() as Promise<PlaylistResponse>;
    },
  });
}

// Save playlist mutation
interface SavePlaylistParams {
  name: string;
  description: string;
  prompt: string;
  playlist_length: string;
  tracks: Array<{ name: string; artist: string; uri?: string }>;
}

export function useSavePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SavePlaylistParams) => {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to save playlist');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

// Update playlist tracks mutation
interface UpdatePlaylistTracksParams {
  playlistId: string;
  name?: string;
  description?: string;
  tracks: Array<{ name: string; artist: string; uri?: string }>;
}

export function useUpdatePlaylistTracks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdatePlaylistTracksParams) => {
      const response = await fetch(`/api/playlists/${params.playlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: params.name,
          description: params.description,
          tracks: params.tracks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update playlist tracks');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
    },
  });
}

// Delete playlist mutation
export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
}

// Create Spotify playlist mutation
interface CreateSpotifyPlaylistParams {
  name: string;
  description: string;
  tracks: Array<{ name: string; artist: string; uri?: string }>;
}

export function useCreateSpotifyPlaylist() {
  return useMutation({
    mutationFn: async (params: CreateSpotifyPlaylistParams) => {
      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Spotify playlist');
      }

      return response.json();
    },
  });
}

// Save message to database
export async function saveMessageToDb(
  playlistId: string,
  role: 'user' | 'assistant',
  content: string,
  playlistSnapshot?: any
) {
  try {
    await fetch('/api/playlist-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistId,
        role,
        content,
        playlistSnapshot,
      }),
    });
  } catch (error) {
    console.error('Failed to save message:', error);
    // Don't throw - we don't want to break the UI if message saving fails
  }
}

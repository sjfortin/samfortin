'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { PlaylistResponse, Track } from './types';
import PlaylistForm from './PlaylistForm';
import GeneratedPlaylist from './GeneratedPlaylist';

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [notFoundTracks, setNotFoundTracks] = useState<Track[]>([]);

  const generatePlaylistMutation = useMutation({
    mutationFn: async ({ prompt, playlistLength }: { prompt: string; playlistLength: string }) => {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, playlistLength }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }

      return response.json() as Promise<PlaylistResponse>;
    },
    onSuccess: () => {
      setNotFoundTracks([]);
    },
  });

  const createSpotifyPlaylistMutation = useMutation({
    mutationFn: async (playlist: PlaylistResponse) => {
      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      });

      if (!response.ok) {
        throw new Error('Failed to create Spotify playlist');
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.tracksNotFound && data.tracksNotFound.length > 0) {
        setNotFoundTracks(data.tracksNotFound);
      }
      if (data.playlistUrl) {
        window.open(data.playlistUrl, '_blank');
      }
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlaylistMutation.mutate({ prompt, playlistLength });
  };

  const handleCreateSpotifyPlaylist = () => {
    if (generatePlaylistMutation.data) {
      createSpotifyPlaylistMutation.mutate(generatePlaylistMutation.data);
    }
  };

  return (
    <div className="space-y-8">
      <PlaylistForm
        prompt={prompt}
        setPrompt={setPrompt}
        playlistLength={playlistLength}
        setPlaylistLength={setPlaylistLength}
        loading={generatePlaylistMutation.isPending}
        onSubmit={handleGenerate}
      />

      {(generatePlaylistMutation.error || createSpotifyPlaylistMutation.error) && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            {generatePlaylistMutation.error?.message || createSpotifyPlaylistMutation.error?.message}
          </p>
        </div>
      )}

      {generatePlaylistMutation.data && (
        <GeneratedPlaylist
          playlist={generatePlaylistMutation.data}
          onCreateSpotify={handleCreateSpotifyPlaylist}
          creatingPlaylist={createSpotifyPlaylistMutation.isPending}
          playlistCreated={createSpotifyPlaylistMutation.isSuccess}
          notFoundTracks={notFoundTracks}
        />
      )}
    </div>
  );
}

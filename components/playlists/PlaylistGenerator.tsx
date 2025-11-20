'use client';

import { useState, useEffect } from 'react';
import type { PlaylistResponse, Track } from './types';
import PlaylistForm from './PlaylistForm';
import GeneratedPlaylist from './GeneratedPlaylist';

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<PlaylistResponse | null>(null);
  const [error, setError] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [notFoundTracks, setNotFoundTracks] = useState<Track[]>([]);
  const [playlistCreated, setPlaylistCreated] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedPlaylist(null);
    setNotFoundTracks([]);
    setPlaylistCreated(false);

    try {
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

      const data = await response.json();
      setGeneratedPlaylist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpotifyPlaylist = async () => {
    if (!generatedPlaylist) return;

    setCreatingPlaylist(true);
    setError('');
    setNotFoundTracks([]);
    setPlaylistCreated(false);

    try {
      const response = await fetch('/api/create-spotify-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedPlaylist),
      });

      if (!response.ok) {
        throw new Error('Failed to create Spotify playlist');
      }

      const data = await response.json();

      // Track which songs weren't found
      if (data.tracksNotFound && data.tracksNotFound.length > 0) {
        setNotFoundTracks(data.tracksNotFound);
      }

      setPlaylistCreated(true);

      // Open the playlist in Spotify
      if (data.playlistUrl) {
        window.open(data.playlistUrl, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    } finally {
      setCreatingPlaylist(false);
    }
  };

  return (
    <div className="space-y-8">
      <PlaylistForm
        prompt={prompt}
        setPrompt={setPrompt}
        playlistLength={playlistLength}
        setPlaylistLength={setPlaylistLength}
        loading={loading}
        onSubmit={handleGenerate}
      />

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {generatedPlaylist && (
        <GeneratedPlaylist
          playlist={generatedPlaylist}
          onCreateSpotify={handleCreateSpotifyPlaylist}
          creatingPlaylist={creatingPlaylist}
          playlistCreated={playlistCreated}
          notFoundTracks={notFoundTracks}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Loader2, Music, Sparkles } from 'lucide-react';

interface Track {
  name: string;
  artist: string;
  uri?: string;
}

interface PlaylistResponse {
  name: string;
  description: string;
  tracks: Track[];
}

export default function PlaylistGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<PlaylistResponse | null>(null);
  const [error, setError] = useState('');
  const [playlistLength, setPlaylistLength] = useState('1');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    checkSpotifyConnection();
  }, []);

  const checkSpotifyConnection = async () => {
    try {
      const response = await fetch('/api/spotify/status');
      const data = await response.json();
      setSpotifyConnected(data.connected);
    } catch (err) {
      console.error('Failed to check Spotify connection:', err);
    } finally {
      setCheckingConnection(false);
    }
  };


  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedPlaylist(null);

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
      {!checkingConnection && !spotifyConnected && (
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            Spotify Connection Required
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            To create playlists, please sign in with your Spotify account. Sign out and sign back in using Spotify to enable playlist creation.
          </p>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Describe your playlist
          </label>
          <textarea
            id="prompt"
            rows={4}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
            placeholder="e.g., Upbeat indie rock songs perfect for a road trip, or relaxing jazz for a cozy evening..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <select
            id="playlistLength"
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
            value={playlistLength}
            onChange={(e) => setPlaylistLength(e.target.value)}
            disabled={loading}
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Playlist
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {generatedPlaylist && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {generatedPlaylist.name}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {generatedPlaylist.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Tracks ({generatedPlaylist.tracks.length})
            </h3>
            <div className="space-y-2">
              {generatedPlaylist.tracks.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <Music className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {track.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {track.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCreateSpotifyPlaylist}
              disabled={creatingPlaylist || !spotifyConnected}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creatingPlaylist ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Playlist...
                </>
              ) : (
                <>
                  <Music className="h-4 w-4" />
                  Create in Spotify
                </>
              )}
            </button>
            {!spotifyConnected && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Connect your Spotify account above to create playlists
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

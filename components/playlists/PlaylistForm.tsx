'use client';

import { Loader2, Music2 } from 'lucide-react';

interface PlaylistFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  playlistLength: string;
  setPlaylistLength: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PlaylistForm({
  prompt,
  setPrompt,
  playlistLength,
  setPlaylistLength,
  loading,
  onSubmit,
}: PlaylistFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Describe your playlist
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
          placeholder="e.g., Upbeat indie rock songs perfect for a road trip, or relaxing jazz for a cozy evening..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <select
          id="playlistLength"
          className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white mt-4 max-w-xs"
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
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-transparent px-6 py-3 text-sm font-semibold text-white dark:white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer dark:border-white dark:border"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Music2 className="h-4 w-4" />
            Generate Playlist
          </>
        )}
      </button>
    </form>
  );
}

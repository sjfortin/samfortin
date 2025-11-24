'use client';

import type { Track } from './types';

interface TracksNotFoundWarningProps {
  tracks: Track[];
}

export default function TracksNotFoundWarning({ tracks }: TracksNotFoundWarningProps) {
  if (tracks.length === 0) return null;

  return (
    <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4">
      <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
        {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'} not found on Spotify
      </h4>
      <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-3">
        The following tracks could not be found and were not added to your playlist:
      </p>
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <p key={index} className="text-xs text-yellow-800 dark:text-yellow-300">
            • {track.artist} - {track.name}
          </p>
        ))}
      </div>
    </div>
  );
}

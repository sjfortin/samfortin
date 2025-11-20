'use client';

import { Music } from 'lucide-react';
import type { Track } from './types';

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Tracks ({tracks.length})
      </h3>
      <div className="space-y-2">
        {tracks.map((track, index) => (
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
  );
}

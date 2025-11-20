'use client';

import type { PlaylistResponse, Track } from './types';
import TrackList from './TrackList';
import CreateSpotifyButton from './CreateSpotifyButton';
import TracksNotFoundWarning from './TracksNotFoundWarning';

interface GeneratedPlaylistProps {
  playlist: PlaylistResponse;
  onCreateSpotify: () => void;
  creatingPlaylist: boolean;
  playlistCreated: boolean;
  notFoundTracks: Track[];
}

export default function GeneratedPlaylist({
  playlist,
  onCreateSpotify,
  creatingPlaylist,
  playlistCreated,
  notFoundTracks,
}: GeneratedPlaylistProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {playlist.name}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {playlist.description}
        </p>
      </div>

      <TrackList tracks={playlist.tracks} />

      <div className="space-y-4">
        <CreateSpotifyButton
          onClick={onCreateSpotify}
          disabled={creatingPlaylist || playlistCreated}
          loading={creatingPlaylist}
          created={playlistCreated}
        />
        
        <TracksNotFoundWarning tracks={notFoundTracks} />
      </div>
    </div>
  );
}

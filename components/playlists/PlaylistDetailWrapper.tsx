'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import PlaylistDetail from './PlaylistDetail';
import type { SavedPlaylist } from './types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface PlaylistDetailWrapperProps {
  playlistId: string;
}

export default function PlaylistDetailWrapper({ playlistId }: PlaylistDetailWrapperProps) {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const response = await fetch(`/api/playlists/${playlistId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Playlist not found');
        }
        throw new Error('Failed to fetch playlist');
      }

      const result = await response.json();
      return result.playlist as SavedPlaylist;
    },
  });

  useEffect(() => {
    if (error) {
      router.push('/playlists');
    }
  }, [error, router]);

  return (
    <>
      <SignedOut>
        {/* Redirect handled by middleware or show message */}
        <div className="flex h-screen items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view playlists</p>
        </div>
      </SignedOut>

      <SignedIn>
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-screen items-center justify-center">
            <p className="text-destructive">Failed to load playlist</p>
          </div>
        ) : data ? (
          <PlaylistDetail playlist={data} />
        ) : null}
      </SignedIn>
    </>
  );
}

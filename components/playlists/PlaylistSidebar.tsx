import { Music, Plus } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase/server';
import { SavedPlaylist } from './types';

async function getPlaylists(userId: string): Promise<SavedPlaylist[]> {
  const { data: playlists, error } = await supabaseAdmin
    .from('playlists')
    .select(`
      *,
      playlist_tracks (
        id,
        name,
        artist,
        found_on_spotify,
        spotify_uri,
        position
      )
    `)
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }

  return playlists || [];
}

export default async function PlaylistSidebar() {
  const { userId } = await auth();
  const playlists = userId ? await getPlaylists(userId) : [];

  return (
    <div className="flex flex-col md:h-full md:w-64 md:border-r border-gray-200 p-4">
      <div className="flex justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Music />
          <span>Playlists</span>
        </div>
        <Link href="/playlists" className="text-xs flex items-center gap-1">
          New
          <Plus className="w-3 h-3" />
        </Link>
      </div>
      {userId ? (
        <div>
          {!playlists.length ? (
            <div className="py-4 text-sm text-muted-foreground">
              No playlists yet.
            </div>
          ) : (
            <div>
              <ul>
                {playlists.map((playlist: SavedPlaylist) => (
                  <li key={playlist.id} className="py-2">
                    <Link href={`/playlists/${playlist.id}`} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        {playlist.cover_image_url ? (
                          <Image
                            src={playlist.cover_image_url}
                            alt={playlist.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 text-left min-w-0 text-sm">
                        <span className="font-medium truncate">{playlist.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

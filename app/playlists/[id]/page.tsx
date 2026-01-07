import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PlaylistEditor from '@/components/playlists/PlaylistEditor';
import type { SavedPlaylist } from '@/components/playlists/types';
import { supabaseAdmin } from '@/lib/supabase/server';

async function getPlaylist(playlistId: string, userId: string): Promise<SavedPlaylist | null> {
  try {
    const { data: playlist, error } = await supabaseAdmin
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
      .eq('id', playlistId)
      .eq('clerk_user_id', userId)
      .single();

    if (error || !playlist) {
      console.error('Error fetching playlist:', error);
      return null;
    }

    return playlist as SavedPlaylist;
  } catch (error) {
    console.error('Failed to fetch playlist:', error);
    return null;
  }
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view playlists</p>
      </div>
    );
  }

  const playlist = await getPlaylist(id, userId);

  if (!playlist) {
    redirect('/playlists');
  }

  return <PlaylistEditor savedPlaylist={playlist} />;
}

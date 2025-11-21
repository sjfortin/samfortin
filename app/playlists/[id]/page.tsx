import PlaylistDetailWrapper from '@/components/playlists/PlaylistDetailWrapper';

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PlaylistDetailWrapper playlistId={id} />;
}

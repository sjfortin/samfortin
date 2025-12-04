import PlaylistSidebar from "@/components/playlists/PlaylistSidebar"
import PlaylistHeader from "@/components/playlists/PlaylistHeader";

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <PlaylistHeader />
      <main className="flex flex-col md:flex-row h-full">
        <PlaylistSidebar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}

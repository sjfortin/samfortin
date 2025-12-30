import PlaylistSidebar from "@/components/playlists/PlaylistSidebar"
import PlaylistSidebarWrapper from "@/components/playlists/PlaylistSidebarWrapper"
import Header from "@/components/Header";

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex h-full border-t border-gray-200 dark:border-gray-800 relative">
        <PlaylistSidebarWrapper>
          <PlaylistSidebar />
        </PlaylistSidebarWrapper>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

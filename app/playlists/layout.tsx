import PlaylistSidebar from "@/components/playlists/PlaylistSidebar"
import PlaylistSidebarWrapper from "@/components/playlists/PlaylistSidebarWrapper"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-col md:flex-row h-full border-t border-b border-gray-200 dark:border-gray-800 relative">
        <PlaylistSidebarWrapper>
          <PlaylistSidebar />
        </PlaylistSidebarWrapper>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

import PlaylistSidebar from "@/components/playlists/PlaylistSidebar"
import Header from "@/components/Header";

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-col md:flex-row h-full border-t border-gray-200 dark:border-white">
        <PlaylistSidebar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}

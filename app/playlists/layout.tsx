import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import PlaylistSidebar from "@/components/playlists/PlaylistSidebar"

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PlaylistSidebar />
      <SidebarInset>
        <main>
          <SidebarTrigger variant="ghost" size="icon" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

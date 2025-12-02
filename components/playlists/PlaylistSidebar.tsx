import { Home, Music4 } from 'lucide-react';
import CreatedPlaylists from './CreatedPlaylists';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface PlaylistSidebarProps {
  onSelectPlaylist?: (playlistId: string) => void;
  onDeletePlaylist?: (playlistId: string) => void;
}

export default function PlaylistSidebar({ onSelectPlaylist, onDeletePlaylist }: PlaylistSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Music4 className="w-5 h-5" />
          <span>Your Playlists</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <CreatedPlaylists onSelectPlaylist={onSelectPlaylist} onDeletePlaylist={onDeletePlaylist} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <div className="flex items-center">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
        <SidebarMenuButton asChild>
          <Link href="/">
            <Home />
            <span>Home</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

'use client';

import { Home, Music4, Plus } from 'lucide-react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePlaylists } from './hooks/usePlaylistMutations';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { SavedPlaylist } from './types';
import { Loader2 } from 'lucide-react';

export default function PlaylistSidebar() {
  const { data, isLoading } = usePlaylists();

  const playlists: SavedPlaylist[] = data?.playlists || [];

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader className="px-4">
        <SignedIn>
          <SidebarMenuButton asChild size="lg">
            <UserButton />
          </SidebarMenuButton>
        </SignedIn>
        <SignedOut>
          <SidebarMenuButton asChild size="lg">
            <SignInButton mode="modal" />
          </SidebarMenuButton>
        </SignedOut>
      </SidebarHeader>
      <SignedIn>
        <SidebarContent>
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-center text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : !playlists.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No playlists yet.
            </div>
          ) : (
            <SidebarGroup>
              <SidebarGroupLabel>Playlists</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {playlists.map((playlist: SavedPlaylist) => (
                    <SidebarMenuItem key={playlist.id}>
                      <SidebarMenuButton asChild size="lg">
                        <Link href={`/playlists/${playlist.id}`}>
                          <div className="flex-shrink-0 w-8 h-8 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                          </div>
                          <div className="flex flex-col gap-0.5 text-left min-w-0 text-sm">
                            <span className="font-medium truncate">{playlist.name}</span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </SignedIn>
      <SignedOut>
        <SidebarContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Please sign in to view playlists
          </div>
        </SidebarContent>
      </SignedOut>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href="/">
              <Home />
              <span>Back Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { UpdatePlaylistAfterSpotifyCreation } from "@/lib/supabase/types";

// PATCH - Update playlist after Spotify creation
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdatePlaylistAfterSpotifyCreation = await request.json();
    const { spotify_playlist_id, spotify_playlist_url, tracks_added, tracks_not_found } = body;

    // Update the playlist
    const { data: playlist, error: updateError } = await supabaseAdmin
      .from("playlists")
      .update({
        spotify_playlist_id,
        spotify_playlist_url,
        tracks_added,
        tracks_not_found,
      })
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .select()
      .single();

    if (updateError || !playlist) {
      console.error("Error updating playlist:", updateError);
      return NextResponse.json(
        { error: "Failed to update playlist" },
        { status: 500 }
      );
    }

    // Update tracks that weren't found
    if (tracks_not_found && tracks_not_found.length > 0) {
      for (const notFoundTrack of tracks_not_found) {
        await supabaseAdmin
          .from("playlist_tracks")
          .update({ found_on_spotify: false })
          .eq("playlist_id", id)
          .eq("name", notFoundTrack.name)
          .eq("artist", notFoundTrack.artist);
      }
    }

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error("Error in PATCH /api/playlists/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a playlist
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Delete the playlist (tracks will be cascade deleted)
    const { error } = await supabaseAdmin
      .from("playlists")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", userId);

    if (error) {
      console.error("Error deleting playlist:", error);
      return NextResponse.json(
        { error: "Failed to delete playlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/playlists/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { UpdatePlaylistAfterSpotifyCreation } from "@/lib/supabase/types";
import { fetchSpotifyWithRefresh } from "@/lib/spotify/token-manager";

// GET - Fetch a single playlist by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the playlist with tracks
    const { data: playlist, error } = await supabaseAdmin
      .from("playlists")
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
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .single();

    if (error || !playlist) {
      console.error("Error fetching playlist:", error);
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error("Error in GET /api/playlists/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // First, fetch the playlist to get the Spotify playlist ID
    const { data: playlist, error: fetchError } = await supabaseAdmin
      .from("playlists")
      .select("spotify_playlist_id")
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching playlist:", fetchError);
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    // If the playlist exists on Spotify, unfollow it
    if (playlist?.spotify_playlist_id) {
      try {
        const unfollowResponse = await fetchSpotifyWithRefresh(
          `https://api.spotify.com/v1/playlists/${playlist.spotify_playlist_id}/followers`,
          {
            method: "DELETE",
          }
        );

        if (!unfollowResponse.ok) {
          console.error("Failed to unfollow Spotify playlist:", await unfollowResponse.text());
          // Continue with database deletion even if Spotify deletion fails
        }
      } catch (spotifyError) {
        console.error("Error unfollowing Spotify playlist:", spotifyError);
        // Continue with database deletion even if Spotify deletion fails
      }
    }

    // Delete the playlist from database (tracks will be cascade deleted)
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

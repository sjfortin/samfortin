import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { CreatePlaylistInput } from "@/lib/supabase/types";

// GET - Fetch user's playlists
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch playlists for the user
    const { data: playlists, error } = await supabaseAdmin
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
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching playlists:", error);
      return NextResponse.json(
        { error: "Failed to fetch playlists" },
        { status: 500 }
      );
    }

    return NextResponse.json({ playlists });
  } catch (error) {
    console.error("Error in GET /api/playlists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new playlist
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreatePlaylistInput = await request.json();
    const { name, description, prompt, playlist_length, tracks } = body;

    if (!name || !description || !tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the playlist
    const { data: playlist, error: playlistError } = await supabaseAdmin
      .from("playlists")
      .insert({
        clerk_user_id: userId,
        name,
        description,
        prompt,
        playlist_length,
      })
      .select()
      .single();

    if (playlistError || !playlist) {
      console.error("Error creating playlist:", playlistError);
      return NextResponse.json(
        { error: "Failed to create playlist" },
        { status: 500 }
      );
    }

    // Create the tracks
    const tracksToInsert = tracks.map((track, index) => ({
      playlist_id: playlist.id,
      name: track.name,
      artist: track.artist,
      position: index,
      found_on_spotify: true, // Will be updated when Spotify playlist is created
    }));

    const { error: tracksError } = await supabaseAdmin
      .from("playlist_tracks")
      .insert(tracksToInsert);

    if (tracksError) {
      console.error("Error creating tracks:", tracksError);
      // Don't fail the request, playlist is already created
    }

    revalidatePath('/playlists');
    return NextResponse.json({ playlist });
  } catch (error) {
    console.error("Error in POST /api/playlists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

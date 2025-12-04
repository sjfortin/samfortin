import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { playlistId, role, content, playlistSnapshot } = await request.json();

    if (!playlistId || !role || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role !== 'user' && role !== 'assistant') {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Verify the playlist belongs to the user
    const { data: playlist, error: playlistError } = await supabaseAdmin
      .from('playlists')
      .select('id')
      .eq('id', playlistId)
      .eq('clerk_user_id', userId)
      .single();

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found or unauthorized" },
        { status: 404 }
      );
    }

    // Insert the message
    const { data, error } = await supabaseAdmin
      .from('playlist_messages')
      .insert({
        playlist_id: playlistId,
        role,
        content,
        playlist_snapshot: playlistSnapshot || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving message:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in playlist-messages API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');

    if (!playlistId) {
      return NextResponse.json(
        { error: "Missing playlistId parameter" },
        { status: 400 }
      );
    }

    // Verify the playlist belongs to the user
    const { data: playlist, error: playlistError } = await supabaseAdmin
      .from('playlists')
      .select('id')
      .eq('id', playlistId)
      .eq('clerk_user_id', userId)
      .single();

    if (playlistError || !playlist) {
      return NextResponse.json(
        { error: "Playlist not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get all messages for this playlist
    const { data, error } = await supabaseAdmin
      .from('playlist_messages')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in playlist-messages API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

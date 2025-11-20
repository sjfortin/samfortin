import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, playlistLength } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a music expert and playlist curator. Generate a playlist based on the user's description. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
    {
      "name": "Playlist Name",
      "description": "Brief description of the playlist. Max characters: 100",
      "tracks": [
        {
          "name": "Song Title",
          "artist": "Artist Name"
        }
      ]
    }

    Guidelines:
    - Generate tracks that make up ${playlistLength} of music
    - Include diverse but thematically consistent songs
    - Make the playlist name catchy and relevant
    - Use songs that exist on Spotify
    - Songs do not need to be popular but should fit within the theme of the playlist
    - You are acting as a DJ and mixtape artist and have a vast knowledge of all genres and artists throughout history.
    - The playlist you create will serve as a soundtrack to the user's life and should invoke emotions, nostalgia, and memories.
    - Write a compelling description
    - Ensure all track names and artists are accurate`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nUser request: ${prompt}`,
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    const playlistData = JSON.parse(cleanedResponse);

    // Validate the response structure
    if (
      !playlistData.name ||
      !playlistData.description ||
      !Array.isArray(playlistData.tracks) ||
      playlistData.tracks.length === 0
    ) {
      throw new Error("Invalid playlist structure from AI");
    }

    // Save playlist to database
    const { data: playlist, error: playlistError } = await supabaseAdmin
      .from("playlists")
      .insert({
        clerk_user_id: userId,
        name: playlistData.name,
        description: playlistData.description,
        prompt,
        playlist_length: playlistLength,
      })
      .select()
      .single();

    if (playlistError || !playlist) {
      console.error("Error saving playlist to database:", playlistError);
      // Don't fail the request, just log the error
    }

    // Save tracks to database
    if (playlist) {
      const tracksToInsert = playlistData.tracks.map((track: { name: string; artist: string }, index: number) => ({
        playlist_id: playlist.id,
        name: track.name,
        artist: track.artist,
        position: index,
        found_on_spotify: true,
      }));

      const { error: tracksError } = await supabaseAdmin
        .from("playlist_tracks")
        .insert(tracksToInsert);

      if (tracksError) {
        console.error("Error saving tracks to database:", tracksError);
      }

      // Return playlist data with database ID
      return NextResponse.json({
        ...playlistData,
        playlistId: playlist.id,
      });
    }

    return NextResponse.json(playlistData);
  } catch (error) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      { error: "Failed to generate playlist" },
      { status: 500 }
    );
  }
}

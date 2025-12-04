import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { 
      prompt, 
      playlistLength, 
      genres = [], 
      eras = [],
      conversationHistory = [],
      currentPlaylist = null 
    } = await request.json();

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

    // Build context from conversation history
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n' + 
        conversationHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
    }

    // Build current playlist context
    let playlistContext = '';
    if (currentPlaylist) {
      playlistContext = `\n\nCurrent playlist:
Name: ${currentPlaylist.name}
Description: ${currentPlaylist.description}
Tracks (${currentPlaylist.tracks.length}):
${currentPlaylist.tracks.map((t: any, i: number) => `${i + 1}. ${t.name} by ${t.artist}`).join('\n')}`;
    }

    // Build genre and era context
    let filterContext = '';
    if (genres.length > 0 || eras.length > 0) {
      filterContext = '\n\nUser preferences:';
      if (genres.length > 0) {
        filterContext += `\nGenres: ${genres.join(', ')}`;
      }
      if (eras.length > 0) {
        filterContext += `\nTime periods: ${eras.join(', ')}`;
      }
    }

    const systemPrompt = currentPlaylist 
      ? `You are a music expert and playlist curator. The user has an existing playlist and wants to modify it. 
Based on their request, you should either:
1. Modify the existing playlist (add/remove/replace tracks)
2. Create a completely new playlist if they request something different

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
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
- If modifying, keep the spirit of the original playlist unless explicitly asked to change it
- Generate tracks that make up approximately ${playlistLength} of music
- Include diverse but thematically consistent songs
- Make the playlist name catchy and relevant
- Use songs that exist on Spotify
- Songs do not need to be popular. The most important aspect is that the songs should fit within the theme
- You are acting as a DJ and mixtape artist with vast knowledge of all genres and artists throughout history
- The playlist serves as a soundtrack and should invoke emotions, nostalgia, and memories
- Write a compelling, creative description with a max of 100 characters
- Ensure all track names and artists are accurate${filterContext}${playlistContext}${conversationContext}`
      : `You are a music expert and playlist curator. Generate a playlist based on the user's description. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
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
- Generate tracks that make up approximately ${playlistLength} of music
- Include diverse but thematically consistent songs
- Make the playlist name catchy and relevant
- Use songs that exist on Spotify
- Songs do not need to be popular. The most important aspect is that the songs should fit within the theme
- You are acting as a DJ and mixtape artist with vast knowledge of all genres and artists throughout history
- The playlist serves as a soundtrack and should invoke emotions, nostalgia, and memories
- Write a compelling, creative description with a max of 100 characters
- Ensure all track names and artists are accurate${filterContext}${conversationContext}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
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

    return NextResponse.json({
      ...playlistData,
    });
  } catch (error) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      { error: "Failed to generate playlist" },
      { status: 500 }
    );
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchSpotifyWithRefresh } from "@/lib/spotify/token-manager";

interface Track {
  name: string;
  artist: string;
}

interface PlaylistRequest {
  name: string;
  description: string;
  tracks: Track[];
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, tracks }: PlaylistRequest = await request.json();

    if (!name || !description || !Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json(
        { error: "Invalid playlist data" },
        { status: 400 }
      );
    }

    // Get user's Spotify ID
    const userResponse = await fetchSpotifyWithRefresh("https://api.spotify.com/v1/me");

    if (!userResponse.ok) {
      const error = await userResponse.json();
      return NextResponse.json(
        { error: error.error || "Failed to authenticate with Spotify" },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const spotifyUserId = userData.id;

    // Create the playlist
    const createPlaylistResponse = await fetchSpotifyWithRefresh(
      `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      const error = await createPlaylistResponse.json();
      return NextResponse.json(
        { error: error.error?.message || "Failed to create Spotify playlist" },
        { status: createPlaylistResponse.status }
      );
    }

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;

    // Search for tracks and get their URIs
    const trackUris: string[] = [];
    for (const track of tracks) {
      const searchQuery = encodeURIComponent(`track:${track.name} artist:${track.artist}`);
      const searchResponse = await fetchSpotifyWithRefresh(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.tracks?.items?.[0]?.uri) {
          trackUris.push(searchData.tracks.items[0].uri);
        }
      }
    }

    // Add tracks to the playlist
    if (trackUris.length > 0) {
      await fetchSpotifyWithRefresh(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          body: JSON.stringify({
            uris: trackUris,
          }),
        }
      );
    }

    return NextResponse.json({
      success: true,
      playlistId,
      playlistUrl: playlistData.external_urls?.spotify,
      tracksAdded: trackUris.length,
    });
  } catch (error) {
    console.error("Error creating Spotify playlist:", error);
    return NextResponse.json(
      { error: "Failed to create Spotify playlist" },
      { status: 500 }
    );
  }
}

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { fetchSpotifyWithRefresh } from '@/lib/spotify/token-manager';
import { supabaseAdmin } from '@/lib/supabase/server';
import sharp from 'sharp';

interface UploadCoverRequest {
  spotifyPlaylistId: string;
  dbPlaylistId: string; // Database playlist ID
  base64Image: string; // Raw base64 (PNG from Gemini)
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spotifyPlaylistId, dbPlaylistId, base64Image }: UploadCoverRequest = await request.json();

    if (!spotifyPlaylistId || !dbPlaylistId || !base64Image) {
      return NextResponse.json(
        { error: 'Spotify playlist ID, database playlist ID, and base64 image are required' },
        { status: 400 }
      );
    }

    // Convert PNG to JPEG using sharp
    // Spotify requires: base64-encoded JPEG, max 256KB
    const pngBuffer = Buffer.from(base64Image, 'base64');
    
    // Convert to JPEG, resize to 640x640 (Spotify recommended), and compress
    const jpegBuffer = await sharp(pngBuffer)
      .resize(640, 640, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Check size and reduce quality if needed
    let finalBuffer = jpegBuffer;
    let quality = 80;
    while (finalBuffer.length > 256 * 1024 && quality > 20) {
      quality -= 10;
      finalBuffer = await sharp(pngBuffer)
        .resize(640, 640, { fit: 'cover' })
        .jpeg({ quality })
        .toBuffer();
    }

    const jpegBase64 = finalBuffer.toString('base64');

    // Upload to Spotify
    const uploadResponse = await fetchSpotifyWithRefresh(
      `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/images`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: jpegBase64,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Spotify upload error:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload cover image to Spotify' },
        { status: uploadResponse.status }
      );
    }

    // Fetch the playlist from Spotify to get the cover image URL
    const playlistResponse = await fetchSpotifyWithRefresh(
      `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}?fields=images`
    );

    let coverImageUrl: string | null = null;
    if (playlistResponse.ok) {
      const playlistData = await playlistResponse.json();
      coverImageUrl = playlistData.images?.[0]?.url || null;
    }

    // Save the cover image URL to the database
    if (coverImageUrl) {
      await supabaseAdmin
        .from('playlists')
        .update({ cover_image_url: coverImageUrl })
        .eq('id', dbPlaylistId)
        .eq('clerk_user_id', userId);
    }

    return NextResponse.json({ success: true, coverImageUrl });
  } catch (error) {
    console.error('Error uploading playlist cover:', error);
    return NextResponse.json(
      { error: 'Failed to upload cover image' },
      { status: 500 }
    );
  }
}

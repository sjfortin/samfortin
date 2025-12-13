import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

interface GenerateCoverRequest {
  playlistName: string;
  playlistDescription: string;
  tracks: Array<{ name: string; artist: string }>;
}

export async function POST(req: Request) {
  try {
    const { playlistName, playlistDescription, tracks }: GenerateCoverRequest = await req.json();

    if (!playlistName) {
      return NextResponse.json(
        { error: 'Playlist name is required' },
        { status: 400 }
      );
    }

    // Build a context from the tracks
    const trackContext = tracks
      .slice(0, 10) // Use first 10 tracks for context
      .map((t) => `"${t.name}" by ${t.artist}`)
      .join(', ');

    // Craft a prompt for playlist cover art
    const prompt = `Create a visually striking album cover art for a music playlist.

PLAYLIST DETAILS:
- Name: "${playlistName}"
- Description: "${playlistDescription || 'A curated music playlist'}"
- Sample tracks: ${trackContext || 'Various artists and genres'}

ART STYLE - MOEBIUS (Jean Giraud):
- Clean, precise linework with fine hatching and crosshatching
- Surreal, dreamlike quality with vast open spaces
- Distinctive use of color: soft pastels, ethereal blues, warm desert tones
- Intricate detail work combined with minimalist compositions
- Otherworldly, contemplative atmosphere
- European comic book aesthetic (bande dessinée)
- Should work well as a square thumbnail

CRITICAL REQUIREMENTS:
- NO TEXT whatsoever in the image - no words, letters, numbers, titles, or any written content
- The image must be purely visual - only imagery, colors, shapes, and artistic elements
- Create an image that captures the essence and mood of the playlist
- Square aspect ratio (1:1)

Generate a beautiful, professional playlist cover that captures the musical essence and mood of this collection.`;

    const result = await generateText({
      model: google('gemini-2.5-flash-image'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      prompt,
    });

    // Find the generated image in the files array
    const imageFile = result.files?.find((file) => file.mediaType.startsWith('image/'));

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image was generated. Please try again.' },
        { status: 500 }
      );
    }

    const base64Data = imageFile.base64;

    return NextResponse.json({
      imageData: `data:image/png;base64,${base64Data}`,
      base64: base64Data, // Raw base64 for Spotify upload
    });
  } catch (error) {
    console.error('Playlist cover generation error:', error);

    if (error instanceof Error) {
      if (error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'The content could not be visualized due to safety guidelines. Try again.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate cover image. Please try again.' },
      { status: 500 }
    );
  }
}

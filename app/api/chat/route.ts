import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Create Google provider with custom API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the schema separately to avoid deep type instantiation
const playlistSchema = z.object({
  name: z.string().describe('A catchy, relevant playlist name'),
  description: z.string().describe('Brief description of the playlist, max 100 characters'),
  tracks: z.array(
    z.object({
      name: z.string().describe('The song title'),
      artist: z.string().describe('The artist name'),
    })
  ).describe('Array of tracks for the playlist'),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { messages, playlistLength = '1', currentPlaylist } = body as {
    messages: UIMessage[];
    playlistLength?: string;
    currentPlaylist?: {
      name: string;
      description: string;
      tracks: Array<{ name: string; artist: string }>;
    } | null;
  };

  // Build current playlist context for the system prompt
  let playlistContext = '';
  if (currentPlaylist) {
    playlistContext = `\n\nCurrent playlist:
Name: ${currentPlaylist.name}
Description: ${currentPlaylist.description}
Tracks (${currentPlaylist.tracks.length}):
${currentPlaylist.tracks.map((t, i) => `${i + 1}. ${t.name} by ${t.artist}`).join('\n')}`;
  }

  const systemPrompt = `You are a music expert and playlist curator. You help users create and modify playlists.

Guidelines:
- Generate tracks that make up approximately ${playlistLength} hour(s) of music
- Include diverse but thematically consistent songs
- Make the playlist name catchy and relevant
- Use songs that exist on Spotify
- Songs do not need to be popular. The most important aspect is that the songs should fit within the theme
- You are acting as a DJ and mixtape artist with vast knowledge of all genres and artists throughout history
- The playlist serves as a soundtrack and should invoke emotions, nostalgia, and memories
- Write a compelling, creative description with a max of 100 characters
- Ensure all track names and artists are accurate
- If modifying an existing playlist, keep the spirit of the original unless explicitly asked to change it
- ALWAYS use the generatePlaylist tool to return the playlist - never return raw JSON${playlistContext}`;

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      generatePlaylist: tool({
        description: 'Generate or modify a playlist based on the user request. Always use this tool to return playlist results.',
        inputSchema: playlistSchema,
        execute: async (params) => params,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

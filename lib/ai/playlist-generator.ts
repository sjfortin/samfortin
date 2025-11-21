import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AIModel = "gemini" | "openai" | "claude";

export interface PlaylistData {
  name: string;
  description: string;
  tracks: Array<{
    name: string;
    artist: string;
  }>;
}

interface GeneratePlaylistParams {
  prompt: string;
  playlistLength: string;
  model: AIModel;
  genres?: string[];
  decades?: string[];
}

interface ModelError extends Error {
  status?: number;
  code?: string;
}

const SYSTEM_PROMPT = (
  playlistLength: string,
  genres?: string[],
  decades?: string[]
) => {
  let prompt = `You are a music expert and playlist curator. Generate a playlist based on the user's description. Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
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
- Songs do not need to be popular. The most important aspect is that the songs should fit within the theme of the playlist
- You are acting as a DJ and mixtape artist and have a vast knowledge of all genres and artists throughout history.
- The playlist you create will serve as a soundtrack to the user's life and should invoke emotions, nostalgia, and memories.
- Write a compelling, creative description that has a max of 100 characters
- Ensure all track names and artists are accurate`;

  if (genres && genres.length > 0) {
    prompt += `\n- Focus on these genres: ${genres.join(", ")}`;
  }

  if (decades && decades.length > 0) {
    prompt += `\n- Include songs primarily from these decades: ${decades.join(", ")}`;
  }

  return prompt;
};

async function generateWithGemini(
  prompt: string,
  playlistLength: string,
  genres?: string[],
  decades?: string[]
): Promise<PlaylistData> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  const genAI = new GoogleGenAI({ apiKey });

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SYSTEM_PROMPT(playlistLength, genres, decades)}\n\nUser request: ${prompt}`,
  });

  const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Clean up the response - remove markdown code blocks if present
  let cleanedResponse = responseText.trim();
  if (cleanedResponse.startsWith("```json")) {
    cleanedResponse = cleanedResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
  } else if (cleanedResponse.startsWith("```")) {
    cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
  }

  return JSON.parse(cleanedResponse);
}

async function generateWithOpenAI(
  prompt: string,
  playlistLength: string,
  genres?: string[],
  decades?: string[]
): Promise<PlaylistData> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT(playlistLength, genres, decades),
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "";
  return JSON.parse(responseText);
}

async function generateWithClaude(
  prompt: string,
  playlistLength: string,
  genres?: string[],
  decades?: string[]
): Promise<PlaylistData> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API key not configured");
  }

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${SYSTEM_PROMPT(playlistLength, genres, decades)}\n\nUser request: ${prompt}`,
      },
    ],
  });

  const responseText =
    message.content[0]?.type === "text" ? message.content[0].text : "";

  // Clean up the response - remove markdown code blocks if present
  let cleanedResponse = responseText.trim();
  if (cleanedResponse.startsWith("```json")) {
    cleanedResponse = cleanedResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
  } else if (cleanedResponse.startsWith("```")) {
    cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
  }

  return JSON.parse(cleanedResponse);
}

function isRateLimitError(error: ModelError): boolean {
  // Check for 429 status code
  if (error.status === 429) return true;

  // Check for rate limit error codes
  const rateLimitCodes = [
    "rate_limit_exceeded",
    "quota_exceeded",
    "insufficient_quota",
    "RATE_LIMIT_EXCEEDED",
  ];

  if (error.code && rateLimitCodes.includes(error.code)) return true;

  // Check error message for rate limit indicators
  const message = error.message?.toLowerCase() || "";
  return (
    message.includes("rate limit") ||
    message.includes("quota") ||
    message.includes("429")
  );
}

export async function generatePlaylist({
  prompt,
  playlistLength,
  model,
  genres = [],
  decades = [],
}: GeneratePlaylistParams): Promise<PlaylistData> {
  const modelOrder: AIModel[] = [model];

  // Add fallback models
  if (model !== "openai") modelOrder.push("openai");
  if (model !== "claude") modelOrder.push("claude");
  if (model !== "gemini") modelOrder.push("gemini");

  let lastError: Error | null = null;

  for (const currentModel of modelOrder) {
    try {
      let playlistData: PlaylistData;

      switch (currentModel) {
        case "gemini":
          playlistData = await generateWithGemini(prompt, playlistLength, genres, decades);
          break;
        case "openai":
          playlistData = await generateWithOpenAI(prompt, playlistLength, genres, decades);
          break;
        case "claude":
          playlistData = await generateWithClaude(prompt, playlistLength, genres, decades);
          break;
        default:
          throw new Error(`Unknown model: ${currentModel}`);
      }

      // Validate the response structure
      if (
        !playlistData.name ||
        !playlistData.description ||
        !Array.isArray(playlistData.tracks) ||
        playlistData.tracks.length === 0
      ) {
        throw new Error("Invalid playlist structure from AI");
      }

      // Success! Return the playlist data
      return playlistData;
    } catch (error) {
      const modelError = error as ModelError;
      lastError = modelError;

      console.error(`Error with ${currentModel}:`, modelError.message);

      // If it's a rate limit error, try the next model
      if (isRateLimitError(modelError)) {
        console.log(
          `Rate limit hit for ${currentModel}, trying next model...`
        );
        continue;
      }

      // If it's not a rate limit error and this is the primary model, try fallback
      if (currentModel === model) {
        console.log(
          `Error with primary model ${currentModel}, trying fallback...`
        );
        continue;
      }

      // If we're already on a fallback model and it's not a rate limit, throw
      throw modelError;
    }
  }

  // If we've exhausted all models, throw the last error
  throw lastError || new Error("Failed to generate playlist with any model");
}

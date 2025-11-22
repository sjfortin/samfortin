import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generatePlaylist, type AIModel } from "@/lib/ai/playlist-generator";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      prompt, 
      playlistLength, 
      model = "gemini",
      genres = [],
      decades = []
    } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    // Validate model
    const validModels: AIModel[] = ["gemini", "openai", "claude"];
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: "Invalid model specified" },
        { status: 400 }
      );
    }

    // Validate genres and decades are arrays
    if (!Array.isArray(genres) || !Array.isArray(decades)) {
      return NextResponse.json(
        { error: "Invalid filters" },
        { status: 400 }
      );
    }

    const playlistData = await generatePlaylist({
      prompt,
      playlistLength,
      model,
      genres,
      decades,
    });

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

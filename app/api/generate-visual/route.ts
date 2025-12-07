import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { text, style = 'illustration' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Craft a rich prompt for visual interpretation
    const prompt = `Create a beautiful, evocative ${style} that visually interprets this literary passage. 
Capture the mood, atmosphere, and imagery suggested by the text. 
Be artistic and imaginative in your interpretation.

Passage: "${text.slice(0, 500)}"`;

    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
      },
      prompt,
    });

    // Find the generated image in the files array
    const imageFile = result.files?.find(file => file.mediaType.startsWith('image/'));
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image was generated. Please try again.' },
        { status: 500 }
      );
    }

    const base64Data = imageFile.base64;

    return NextResponse.json({
      imageData: `data:image/png;base64,${base64Data}`,
      prompt: prompt,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'The content could not be visualized due to safety guidelines. Try selecting different text.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}

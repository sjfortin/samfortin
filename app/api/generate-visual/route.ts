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

    const bookName = 'A Christmas Carol';
    const author = 'Charles Dickens';

    // Craft a rich prompt for visual interpretation
    const prompt = `Create a beautiful illustration in the distinctive style of Moebius (Jean Giraud) that visually interprets this literary passage from "${bookName}" by ${author}.

ART STYLE - MOEBIUS:
- Clean, precise linework with fine hatching and crosshatching
- Surreal, dreamlike quality with vast open spaces
- Distinctive use of color: soft pastels, ethereal blues, warm desert tones
- Intricate detail work combined with minimalist compositions
- Otherworldly, contemplative atmosphere
- European comic book aesthetic (bande dessinée)

CRITICAL REQUIREMENTS:
- NO TEXT whatsoever in the image - no words, letters, numbers, captions, titles, labels, or any written content
- NO quotes or passages from the book visible in the image
- The image must be purely visual - only imagery, colors, shapes, and artistic elements
- This is a companion illustration, not a text overlay

ARTISTIC DIRECTION:
- Capture the mood, atmosphere, and emotional essence of the passage
- Be imaginative and evocative in your visual interpretation
- Focus on the imagery, setting, characters, or feelings suggested by the text

Passage to interpret: "${text.slice(0, 500)}"`;


    const result = await generateText({
      model: google('gemini-2.5-flash-image'),
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

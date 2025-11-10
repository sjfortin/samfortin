import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';

export const runtime = 'nodejs';
export const maxDuration = 60; // Maximum execution time in seconds

interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  imageSize?: '1K' | '2K' | '4K';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ImageGenerationRequest = await request.json();
    const { prompt, aspectRatio = '16:9', imageSize = '1K' } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: API key not found' },
        { status: 500 }
      );
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({
      apiKey,
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
      imageConfig: {
        aspectRatio,
        imageSize,
      },
    };

    const model = 'gemini-2.5-flash-image';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    // Generate image
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    const images: Array<{ data: string; mimeType: string; extension: string }> = [];
    let textResponse = '';

    // Process the stream
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }

      // Check for image data
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const mimeType = inlineData.mimeType || 'image/png';
        const fileExtension = mime.getExtension(mimeType) || 'png';
        const base64Data = inlineData.data || '';

        images.push({
          data: base64Data,
          mimeType,
          extension: fileExtension,
        });
      } else if (chunk.text) {
        // Collect any text response
        textResponse += chunk.text;
      }
    }

    // Return the generated images
    if (images.length === 0) {
      return NextResponse.json(
        { 
          error: 'No images were generated',
          textResponse: textResponse || 'No response from model'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: images.map((img, index) => ({
        id: index,
        data: img.data,
        mimeType: img.mimeType,
        extension: img.extension,
      })),
      textResponse: textResponse || null,
      prompt,
      config: {
        aspectRatio,
        imageSize,
      },
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check if the API is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/generate-image',
    method: 'POST',
    description: 'Generate images using Gemini AI',
    requiredFields: {
      prompt: 'string (required)',
    },
    optionalFields: {
      aspectRatio: '1:1 | 16:9 | 9:16 | 4:3 | 3:4 (default: 16:9)',
      imageSize: '1K | 2K | 4K (default: 1K)',
    },
  });
}

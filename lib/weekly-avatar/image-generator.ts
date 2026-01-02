import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { buildMoebiusPrompt } from './prompt-generator';

/**
 * Generates a Moebius-style avatar image using Gemini
 * Returns base64 image data
 */
export async function generateAvatarImage(visualConcept: string): Promise<{
  base64: string;
  mimeType: string;
}> {
  const prompt = buildMoebiusPrompt(visualConcept);

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
    throw new Error('No image was generated');
  }

  return {
    base64: imageFile.base64,
    mimeType: imageFile.mediaType,
  };
}

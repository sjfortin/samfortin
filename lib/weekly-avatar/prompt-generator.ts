import { Headline } from './types';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Uses an LLM to synthesize news headlines into a cohesive visual description
 * for the weekly avatar image generation
 */
export async function generateImagePrompt(headlines: Headline[]): Promise<string> {
  const headlineText = headlines
    .map((h, i) => `${i + 1}. "${h.title}" (${h.source})`)
    .join('\n');

  const systemPrompt = `You are a creative director who transforms news headlines into abstract visual concepts for artwork. Your goal is to capture the mood and essence of current events without literal depictions.

RULES:
- Focus on mood, atmosphere, and abstract symbolism
- Suggest clothing, props, colors, and environmental elements that reflect the week's themes
- NEVER include text, words, or letters in the visual description
- Keep descriptions abstract and artistic, avoiding direct depictions of violence or tragedy
- If headlines are negative, translate them into contemplative or resilient imagery
- The output should be a single cohesive scene description`;

  const userPrompt = `Based on these current news headlines, create a visual concept for an avatar image:

${headlineText}

Describe a scene that captures the overall mood and themes of this week's news. Focus on:
- The character's expression and posture
- Clothing and accessories that subtly reference themes
- Background environment and atmosphere
- Color palette that reflects the mood
- Any symbolic props or elements

Keep the description to 2-3 sentences that can be used as an image generation prompt.`;

  try {
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error('Error generating prompt:', error);
    // Fallback to a neutral prompt
    return 'A contemplative figure in casual modern clothing, standing in a serene urban environment with soft natural lighting, expressing quiet optimism and resilience.';
  }
}

/**
 * Builds the complete Moebius-style image generation prompt
 */
export function buildMoebiusPrompt(visualConcept: string): string {
  return `Create a portrait avatar image in the distinctive style of Moebius (Jean Giraud).

VISUAL CONCEPT:
${visualConcept}

CHARACTER REFERENCE:
The character should be based on the person shown in the reference image - maintain their likeness, facial features, and general appearance while adapting their expression and clothing to match the visual concept.

ART STYLE - MOEBIUS (Jean Giraud):
- Clean, precise linework with fine hatching and crosshatching
- Surreal, dreamlike quality with vast open spaces
- Distinctive use of color: soft pastels, ethereal blues, warm desert tones
- Intricate detail work combined with minimalist compositions
- Otherworldly, contemplative atmosphere
- European comic book aesthetic (bande dessinée)

CRITICAL REQUIREMENTS:
- NO TEXT whatsoever in the image - no words, letters, numbers, or any written content
- Square aspect ratio (1:1) suitable for an avatar
- The character should be the focal point
- Maintain visual consistency with previous images in the series
- Professional quality suitable for a website avatar

Generate a beautiful, cohesive image that captures both the Moebius artistic style and the mood of the visual concept.`;
}

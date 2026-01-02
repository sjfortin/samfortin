import { AwsClient } from 'aws4fetch';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'weekly-avatars';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // Your custom domain or R2.dev URL

/**
 * Uploads a base64 image to Cloudflare R2
 * Returns the public URL for the uploaded image
 */
export async function uploadToR2(
  base64Image: string,
  publicId: string
): Promise<string> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_PUBLIC_URL) {
    throw new Error('R2 environment variables not configured');
  }

  const r2 = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  });

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const key = `weekly-avatars/${publicId}.png`;

  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;

  const response = await r2.fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length.toString(),
    },
    body: imageBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('R2 upload error:', errorText);
    throw new Error(`Failed to upload image to R2: ${response.status}`);
  }

  // Return the public URL
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Generates a public ID for the weekly avatar based on the week date
 */
export function generatePublicId(weekDate: string): string {
  return `avatar-${weekDate}`;
}

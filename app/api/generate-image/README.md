# Image Generation API

API endpoint for generating images using Gemini's image creation model.

## Endpoint

`POST /api/generate-image`

## Request Body

```json
{
  "prompt": "A serene mountain landscape at sunset",
  "aspectRatio": "16:9",
  "imageSize": "1K"
}
```

### Parameters

- **prompt** (required): String describing the image you want to generate
- **aspectRatio** (optional): Image aspect ratio
  - Options: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`
  - Default: `16:9`
- **imageSize** (optional): Image resolution
  - Options: `1K`, `2K`, `4K`
  - Default: `1K`

## Response

### Success Response (200)

```json
{
  "success": true,
  "images": [
    {
      "id": 0,
      "data": "base64_encoded_image_data",
      "mimeType": "image/png",
      "extension": "png"
    }
  ],
  "textResponse": null,
  "prompt": "A serene mountain landscape at sunset",
  "config": {
    "aspectRatio": "16:9",
    "imageSize": "1K"
  }
}
```

### Error Response (400/500)

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Usage Examples

### JavaScript/TypeScript (Fetch)

```typescript
async function generateImage(prompt: string) {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspectRatio: '16:9',
      imageSize: '1K',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  const data = await response.json();
  return data;
}

// Usage
const result = await generateImage('A futuristic city at night');
const imageBase64 = result.images[0].data;
const imageSrc = `data:${result.images[0].mimeType};base64,${imageBase64}`;
```

### cURL

```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene mountain landscape at sunset",
    "aspectRatio": "16:9",
    "imageSize": "1K"
  }'
```

### React Component Example

```tsx
'use client';

import { useState } from 'react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio: '16:9',
          imageSize: '1K',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const base64Data = data.images[0].data;
      const mimeType = data.images[0].mimeType;
      setImageUrl(`data:${mimeType};base64,${base64Data}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter image prompt..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && <p>Error: {error}</p>}
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}
```

## Testing the Endpoint

### Check API Status

```bash
curl http://localhost:3000/api/generate-image
```

This will return the API documentation.

## Notes

- Images are returned as base64-encoded data
- The API uses streaming responses from Gemini
- Maximum execution time is 60 seconds
- Make sure your `GEMINI_API_KEY` is set in `.env.local`

## Next Steps

For the cron job implementation (generating 1 image every hour), you can:
1. Use Vercel Cron Jobs (if deploying to Vercel)
2. Use a separate service like GitHub Actions
3. Use a Node.js cron package for self-hosted solutions

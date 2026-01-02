# Weekly Avatar / Time Capsule Feature

A visual time capsule that automatically generates weekly avatar images based on current events, rendered in the style of Moebius.

## Overview

Every Monday at 8:00 AM Central Time (14:00 UTC), a cron job:
1. Fetches top news headlines from NewsAPI
2. Uses Gemini to synthesize headlines into a visual concept
3. Generates a Moebius-style avatar image using Gemini's image generation
4. Uploads the image to Cloudinary
5. Stores the record in Supabase

The homepage displays the current week's avatar (with fallback to the most recent one), and clicking it opens the Time Capsule gallery showing all generated avatars with their inspiring news stories.

## Setup

### 1. Supabase Schema

Run the SQL in `lib/supabase/weekly-avatars-schema.sql` in your Supabase SQL Editor.

### 2. Environment Variables

Add these to your `.env.local` and Vercel environment:

```bash
# NewsAPI - Get a free key at https://newsapi.org/
NEWS_API_KEY=your_newsapi_key

# Cron Secret - Generate a random string for securing the cron endpoint
CRON_SECRET=your_random_secret_string

# Cloudflare R2 Storage
# Get these from Cloudflare Dashboard > R2 > Manage R2 API Tokens
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=weekly-avatars
R2_PUBLIC_URL=https://your-bucket.your-domain.com  # or https://pub-xxx.r2.dev
```

#### R2 Setup Steps:
1. Go to Cloudflare Dashboard > R2
2. Create a bucket named `weekly-avatars`
3. Enable public access (Settings > Public Access > Allow Access)
4. Create an API token with Object Read & Write permissions
5. Copy the Account ID, Access Key ID, and Secret Access Key
6. Set R2_PUBLIC_URL to your custom domain or the R2.dev URL

### 3. Vercel Cron

The `vercel.json` configures a daily cron job at 14:00 UTC (8:00 AM Central):

```json
{
  "crons": [
    {
      "path": "/api/weekly-avatar/generate",
      "schedule": "0 14 * * *"
    }
  ]
}
```

The endpoint checks if it's Monday before generating - on other days it returns early. This works on the **Hobby plan** which only supports daily crons.

## API Endpoints

### Generate Avatar (Cron/Manual)
```
POST /api/weekly-avatar/generate
Authorization: Bearer {CRON_SECRET}
```

### Get Current Avatar
```
GET /api/weekly-avatar/current
```
Returns the current week's avatar or the most recent successful one.

### Get All Avatars
```
GET /api/weekly-avatar/all
```
Returns all successful avatars for the gallery.

## Manual Testing

To manually trigger avatar generation:

```bash
curl -X POST http://localhost:3000/api/weekly-avatar/generate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## File Structure

```
lib/weekly-avatar/
├── types.ts              # TypeScript interfaces
├── news-service.ts       # NewsAPI integration
├── prompt-generator.ts   # LLM prompt synthesis
├── image-generator.ts    # Gemini image generation
├── cloudinary-service.ts # Image upload to Cloudinary
└── avatar-service.ts     # Main orchestration service

app/api/weekly-avatar/
├── generate/route.ts     # Cron endpoint
├── current/route.ts      # Current avatar endpoint
└── all/route.ts          # Gallery endpoint

app/(site)/time-capsule/
└── page.tsx              # Gallery page

components/
├── WeeklyAvatar.tsx      # Homepage avatar component
└── TimeCapsuleGallery.tsx # Gallery component
```

## Safety & Edge Cases

- **Slow News Day**: Falls back to peaceful/neutral headlines if NewsAPI returns no results
- **Sensitive Events**: Set `is_paused = true` in the database to pause generation
- **Content Filtering**: Gemini's built-in safety filters prevent inappropriate imagery
- **Fallback Image**: If no avatar exists, the original `/images/moebius-sam.png` is shown

## Year-End Video (Future)

The schema stores all data needed for a year-end video compilation:
- All images are stored in R2 with consistent naming
- Headlines and prompts are preserved for context
- A future script can retrieve images by date range and stitch them into a video

## Cost Considerations

- **NewsAPI**: Free tier allows 100 requests/day
- **Gemini**: Pay-per-use for image generation
- **Cloudflare R2**: Free tier includes 10GB storage and 10M requests/month
- **Vercel Cron**: Included with Pro plan

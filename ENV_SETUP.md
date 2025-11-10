# Environment Setup for Image Generation API

## Required Environment Variables

Add the following to your `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Important Notes

- Never commit your `.env.local` file to version control
- The API key should be kept secret
- Make sure `.env.local` is in your `.gitignore` file

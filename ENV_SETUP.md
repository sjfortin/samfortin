# Environment Setup

## Required Environment Variables

Add the following to your `.env.local` file:

```bash
# AI Model API Keys (at least one required for playlist generation)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Spotify Integration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Getting Your API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Playlist Generation with Multiple Models

The playlist generator supports three AI models:
- **Gemini** (Google's Gemini 2.5 Flash)
- **ChatGPT** (OpenAI's GPT-4o)
- **Claude** (Anthropic's Claude Sonnet 4)

### Automatic Fallback
If the selected model returns a 429 rate limit error, the system will automatically try the other configured models in order. This ensures uninterrupted service even when one provider hits rate limits.

### Model Selection
You only need to configure API keys for the models you want to use. The UI will allow selection of any model, but if an API key is missing, it will fall back to the next available model.

## Important Notes

- Never commit your `.env.local` file to version control
- All API keys should be kept secret
- Make sure `.env.local` is in your `.gitignore` file
- At least one AI model API key is required for playlist generation to work

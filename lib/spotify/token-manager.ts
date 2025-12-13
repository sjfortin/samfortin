import { auth, clerkClient } from "@clerk/nextjs/server";

interface SpotifyTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Gets Spotify tokens from Clerk's OAuth connection using getUserOauthAccessToken
 */
export async function getSpotifyTokens(): Promise<SpotifyTokens | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const client = await clerkClient();
    
    // Get OAuth access token for Spotify
    // Note: This method is marked as deprecated but is the only way to access OAuth tokens
    const oauthTokens = await client.users.getUserOauthAccessToken(userId, "spotify");

    if (!oauthTokens || !oauthTokens.data || oauthTokens.data.length === 0) {
      console.log('No Spotify OAuth tokens found');
      return null;
    }

    const token = oauthTokens.data[0].token;

    if (!token) {
      console.log('No access token in OAuth response');
      return null;
    }

    return {
      accessToken: token,
      refreshToken: "", // Clerk manages this internally
      expiresAt: 0, // Clerk handles expiration
    };
  } catch (error) {
    console.error('Error getting Spotify tokens:', error);
    return null;
  }
}


/**
 * Makes a request to Spotify API using Clerk-managed tokens
 */
export async function fetchSpotifyWithRefresh(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const tokens = await getSpotifyTokens();

  if (!tokens) {
    return new Response(
      JSON.stringify({ error: "Not authenticated with Spotify. Please sign in with Spotify." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Make request with Clerk-managed token
  // Allow custom Content-Type headers (needed for image uploads)
  const headers: Record<string, string> = {
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  // Only set default Content-Type if not provided in init.headers
  const initHeaders = init?.headers as Record<string, string> | undefined;
  if (!initHeaders?.["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...initHeaders,
      ...headers,
    },
  });

  return response;
}


import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ connected: false });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if user has Spotify in their external accounts
    const hasSpotify = user.externalAccounts?.some(
      (account) => account.provider === "oauth_spotify"
    );

    return NextResponse.json({ connected: !!hasSpotify });
  } catch (error) {
    console.error("Error checking Spotify connection:", error);
    return NextResponse.json({ connected: false });
  }
}

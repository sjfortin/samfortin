import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaylistGenerator from "@/components/playlists/PlaylistGenerator";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Heading } from "@/components/ui/Heading";
import { Subheading } from "@/components/ui/Subheading";

export default async function PlaylistsPage() {

  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <Heading>
              AI Playlist Generator
            </Heading>
            <Subheading>
              Create personalized Spotify playlists powered by AI. Describe the vibe, mood, or theme you're looking for and save it to Spotify!
            </Subheading>
          </div>
          <div className="mt-8">
            <SignedOut>
              <div className="flex flex-col items-center justify-center space-y-2 text-center gap-4">
                <p className="mt-8 text-pretty text-lg font-medium text-black sm:text-xl/8 lg:max-w-none dark:text-gray-400">Sign in and connect your Spotify account to create playlists</p>
                <SignInButton>
                  <button className="cursor-pointer px-4 py-2 rounded border border-gray-200 dark:border-gray-800 text-black dark:text-white font-semibold text-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Sign In</button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <PlaylistGenerator />
            </SignedIn>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

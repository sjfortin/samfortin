import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlaylistGenerator from "@/components/PlaylistGenerator";

export default async function PlaylistsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              Playlist Generator
            </h1>
            <p className="mt-8 text-gray-900 dark:text-white sm:text-xl/8">
              Create personalized Spotify playlists powered by AI. Describe the vibe, mood, or theme you're looking for, and we'll generate a custom playlist for you.
            </p>
          </div>
          <div className="mt-16">
            <PlaylistGenerator />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

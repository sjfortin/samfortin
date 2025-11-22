import type { Metadata } from "next";
import PlaylistGenerator from "@/components/playlists/PlaylistGenerator";
import { SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samfortin.com";

export const metadata: Metadata = {
  title: "AI Playlists | Sam Fortin",
  description: "Generate AI-powered Spotify playlists, save favorites, and manage them in one place.",
  alternates: {
    canonical: `${siteUrl}/playlists`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/playlists`,
    title: "AI Playlists by Sam Fortin",
    description: "Generate AI-powered Spotify playlists, save favorites, and manage them in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Playlists by Sam Fortin",
    description: "Generate AI-powered Spotify playlists, save favorites, and manage them in one place.",
  },
};

export default async function PlaylistsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Playlist Generator",
    url: `${siteUrl}/playlists`,
    applicationCategory: "MusicApplication",
    operatingSystem: "Web",
    description:
      "Generate AI-powered Spotify playlists, manage saved lists, and explore personalized music recommendations.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SignedOut>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sam
                </Link>
            </div>
            
            <div className="max-w-2xl space-y-8 z-10">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        AI Playlists
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Create personalized Spotify playlists powered by AI. Describe the vibe, mood, or theme you're looking for and save it to Spotify!
                    </p>
                </div>
                
                <SignInButton mode="modal">
                    <button className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                        Get Started
                    </button>
                </SignInButton>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
        </div>
      </SignedOut>

      <SignedIn>
        <PlaylistGenerator />
      </SignedIn>
    </div>
  );
}

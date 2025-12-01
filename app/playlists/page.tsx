import type { Metadata } from "next";
import PlaylistChatInterface from "@/components/playlists/PlaylistChatInterface";
import { SignedOut, SignedIn, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sjfortin.com";

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
      <PlaylistChatInterface />
    </div>
  );
}

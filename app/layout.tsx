import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/next"
import QueryProvider from "@/components/providers/QueryProvider"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sjfortin.com";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sam Fortin",
    template: "%s | Sam Fortin",
  },
  description: "Sam Fortin, Full Stack Software Engineer",
  keywords: [
    "Sam Fortin",
    "Full Stack Engineer",
    "Blog",
    "AI Playlists",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Sam Fortin | Full Stack Software Engineer",
    siteName: "Sam Fortin",
    description: "Thoughts, tutorials, and insights on web dev, design, tech and more.",
    images: [
      {
        url: `${siteUrl}/images/blog/moebius-server.png`,
        width: 1200,
        height: 630,
        alt: "Sam Fortin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam Fortin | Full Stack Software Engineer",
    description: "Thoughts, tutorials, and insights on web dev, design, tech and more.",
    creator: "@sjfortin",
    images: [`${siteUrl}/images/moebius-server.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaCode.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

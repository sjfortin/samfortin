# Sam Fortin - Personal Website

A modern, full-stack personal website and blog built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Features an AI-powered playlist creator, and MDX-powered blog.

## 🚀 Tech Stack

### Core
- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Clerk** - User authentication and management

### AI & APIs
- **Vercel AI SDK** - AI integration framework
- **Google Generative AI** - AI-powered playlist generation
- **Spotify API** - Playlist creation and music data
- **TanStack Query** - Server state management

### Features & Libraries
- **MDX Blog** - Write blog posts with Markdown + JSX
- **Motion** - Animations
- **next-themes** - Dark mode support
- **Lucide React** - Icons
- **Radix UI** - Accessible UI primitives
- **shadcn/ui** - Components

### Testing
- **Jest** - Unit and component testing
- **Playwright** - End-to-end testing
- **Testing Library** - React component testing

### MDX & Content
- `@next/mdx` - MDX support for Next.js
- `gray-matter` - Frontmatter parsing
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-slug` & `rehype-autolink-headings` - Auto-generated heading anchors

## 📁 Project Structure

```
samfortin/
├── app/
│   ├── (site)/               # Main site routes
│   │   ├── page.tsx          # Home page with animated hero
│   │   ├── about/            # About page with work experience
│   │   ├── blog/             # Blog index and dynamic routes
│   │   └── projects/         # Portfolio projects
│   ├── api/                  # API routes
│   │   ├── chat/             # AI chat endpoints for playlists
│   │   ├── christmas/        # Christmas list CRUD operations
│   │   ├── create-spotify-playlist/ # Spotify integration
│   │   └── weekly-avatar/    # Avatar generation
│   ├── christmas/            # Christmas gift tracker
│   ├── dashboard/            # User dashboard
│   ├── playlists/            # AI playlist creator
│   │   ├── page.tsx          # Playlist listing
│   │   └── [id]/             # Individual playlist view
│   └── layout.tsx            # Root layout
├── components/
│   ├── playlists/            # Playlist creator components
│   │   ├── PlaylistCreator.tsx
│   │   ├── PlaylistDetailView.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── TracksSection.tsx
│   │   └── hooks/            # Custom React hooks
│   ├── projects/             # Project showcase components
│   ├── providers/            # React context providers
│   ├── ui/                   # shadcn/ui components
│   ├── Header.tsx            # Navigation with mobile menu
│   ├── Footer.tsx            # Site footer
│   └── ThemeSwitcher.tsx     # Light/dark/system theme toggle
├── content/
│   └── blog/                 # MDX blog posts
├── lib/
│   ├── spotify/              # Spotify API integration
│   ├── supabase/             # Supabase client and schemas
│   ├── weekly-avatar/        # Avatar generation service
│   ├── blog.ts               # Blog utilities
│   └── utils.ts              # General utilities
├── public/
│   ├── images/               # Static images
│   └── videos/               # Video assets
├── tests/                    # E2E tests (Playwright)
├── __tests__/                # Unit tests (Jest)
└── mdx-components.tsx        # Custom MDX component styles
```

## ✨ Features

### AI Playlist Creator
- ✅ AI-powered playlist generation using Google Generative AI
- ✅ Interactive chat interface for playlist customization
- ✅ Era-based music selection (60s-2020s)
- ✅ Real-time streaming AI responses
- ✅ Direct Spotify playlist creation
- ✅ Track management (add/remove/reorder)
- ✅ Playlist persistence with Supabase
- ✅ User authentication with Clerk
- ✅ Responsive design with mobile support

### Blog System
- ✅ MDX-powered blog with frontmatter support
- ✅ Draft posts (hide while working)
- ✅ Cover images with animations
- ✅ Automatic blog index generation
- ✅ Dynamic routing for posts
- ✅ Syntax highlighting for code blocks
- ✅ GitHub Flavored Markdown support
- ✅ Auto-generated heading anchors

### Design & UX
- ✅ Fully responsive design
- ✅ Dark mode with system preference detection
- ✅ Smooth animations using Motion
- ✅ Modern, clean UI with Tailwind CSS 4
- ✅ Accessible components (Radix UI)
- ✅ Mobile-first approach

### Pages
- **Home** - Animated hero section with Moebius-inspired imagery
- **About** - Work experience and professional background
- **Blog** - MDX-powered blog with cover images
- **Projects** - Portfolio projects showcase
- **Playlists** - AI-powered playlist creator
- **Dashboard** - User dashboard

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended)
- Supabase account (for database features)
- Clerk account (for authentication)
- Spotify Developer account (for playlist creation)
- Google AI API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/sjfortin/samfortin.git
cd samfortin

# Install dependencies
pnpm install

# Set up environment variables
cp .env.sample .env.local
# Edit .env.local with your API keys and credentials

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the site.

### Environment Setup

See the following guides for detailed setup instructions:
- `ENV_SETUP.md` - General environment configuration
- `SUPABASE_SETUP.md` - Database setup and schema
- `SPOTIFY_SETUP.md` - Spotify API integration
- `PLAYLIST_QUICK_START.md` - Playlist feature setup
- `WEEKLY_AVATAR_SETUP.md` - Avatar generation setup

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run Jest unit tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:e2e         # Run Playwright E2E tests
pnpm test:e2e:ui      # Run Playwright with UI
pnpm test:all         # Run all tests
```

## 📝 Writing Blog Posts

Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "My Awesome Post"
date: "2024-11-08"
description: "This is what my post is about"
category: "Tutorial"
author: "Sam Fortin"
draft: false
coverImage: "/images/blog/my-cover.jpg"
---

# My Awesome Post

Your content here with **markdown** formatting!

## Code Example

\`\`\`typescript
const greeting = "Hello, World!"
console.log(greeting)
\`\`\`
```

See `BLOG_SETUP.md` for detailed blog documentation.

## 🎨 Design System

### Fonts
- **Geist** - Primary font family
- **Fira Code** - Monospace font for code

### Colors
- Tailwind CSS default palette
- Custom dark mode color scheme
- Semantic color tokens for consistency

### Components
- Built with shadcn/ui and Radix UI primitives
- Fully accessible and keyboard navigable
- Consistent spacing and typography scale

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.7 | React framework |
| react | 19.2.1 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |
| @supabase/supabase-js | ^2.83.0 | Database client |
| @clerk/nextjs | ^6.36.5 | Authentication |
| @tanstack/react-query | ^5.90.10 | Server state management |
| ai | ^5.0.107 | Vercel AI SDK |
| @ai-sdk/google | ^2.0.44 | Google AI integration |
| motion | ^12.23.24 | Animations |
| next-themes | ^0.4.6 | Theme switching |
| lucide-react | ^0.553.0 | Icon library |
| @next/mdx | ^16.0.1 | MDX support |
| gray-matter | ^4.0.3 | Frontmatter parsing |
| zod | ^3.25.76 | Schema validation |

## � Documentation

Detailed setup and implementation guides are available:

### Setup Guides
- **ENV_SETUP.md** - Environment variables configuration
- **SUPABASE_SETUP.md** - Database setup and schema migrations
- **SPOTIFY_SETUP.md** - Spotify API integration guide
- **BLOG_SETUP.md** - Blog system documentation
- **WEEKLY_AVATAR_SETUP.md** - Avatar generation service

### Feature Documentation
- **PLAYLIST_QUICK_START.md** - Quick start guide for playlist feature
- **PLAYLIST_REFACTOR.md** - Playlist architecture and refactoring notes
- **PLAYLIST_CHAT_UPDATE.md** - Chat interface implementation
- **PLAYLIST_TESTING_GUIDE.md** - Testing strategy for playlists
- **AI_SDK_MIGRATION.md** - AI SDK migration notes
- **DATABASE_INTEGRATION.md** - Database integration patterns
- **CHRISTMAS_SCHEMA.sql** - Christmas tracker database schema

## 🧪 Testing

The project includes comprehensive testing:

### Unit Tests (Jest)
- Component tests in `__tests__/`
- Run with `pnpm test` or `pnpm test:watch`

### E2E Tests (Playwright)
- End-to-end tests in `tests/`
- Tests for homepage, about, blog, and navigation
- Run with `pnpm test:e2e` or `pnpm test:e2e:ui`

## 🚀 Deployment

This site is deployed on [Vercel](https://vercel.com).

```bash
# Build for production
pnpm build

# The output will be in .next/
```

Vercel provides automatic deployments from Git with zero configuration for Next.js applications.

### Environment Variables

Required environment variables for deployment:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk server-side key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SPOTIFY_CLIENT_ID` - Spotify API client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify API client secret
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI API key
- `CRON_SECRET` - Secret for authenticating cron job requests

See `.env.sample` for a complete list.

## ⏰ Cron Jobs

The weekly avatar generation is managed via external cron service for reliability on Hobby plan.

### Setup (Cron-job.org)

1. **Create Account**: Sign up at https://console.cron-job.org/jobs
2. **Configure Job**:
   - **URL**: `/api/weekly-avatar/generate`
   - **Method**: GET
   - **Schedule**: `0 10 * * 1` (every Monday at 10:00 AM)
   - **Headers**: `Authorization: Bearer your-cron-secret-value`
3. **Environment**: Set `CRON_SECRET` environment variable in Vercel
4. **Test**: Use `?force=true` parameter for manual testing

The endpoint only generates avatars on Mondays by default (unless forced).

## 📄 License

This is a personal website. Feel free to use as inspiration, but please don't copy directly.


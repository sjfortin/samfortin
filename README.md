# Sam Fortin - Personal Website

A modern, full-stack personal website and blog built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## 🚀 Tech Stack

### Core
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first styling

### Features & Libraries
- **MDX Blog** - Write blog posts with Markdown + JSX
- **Motion** - Smooth animations and transitions
- **next-themes** - Dark mode support
- **Lucide React** - Modern icon library
- **Headless UI** - Accessible UI components
- **Radix UI** - Dropdown menus and primitives
- **shadcn/ui** - Beautiful, reusable components

### MDX & Content
- `@next/mdx` - MDX support for Next.js
- `gray-matter` - Frontmatter parsing
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-slug` & `rehype-autolink-headings` - Auto-generated heading anchors

## 📁 Project Structure

```
samfortin/
├── app/
│   ├── page.tsx              # Home page with animated hero
│   ├── about/                # About page with work experience
│   ├── blog/                 # Blog index and dynamic routes
│   │   ├── page.tsx          # Blog listing page
│   │   └── [slug]/           # Individual blog posts
│   ├── contact/              # Contact page
│   └── lib/                  # App-level utilities
├── components/
│   ├── Header.tsx            # Navigation with mobile menu
│   ├── Footer.tsx            # Site footer
│   ├── ThemeSwitcher.tsx     # Light/dark/system theme toggle
│   ├── AnimatedBlogImage.tsx # Animated blog cover images
│   ├── AnimatedHomeImage.tsx # Animated home page images
│   ├── AnimatedHomeVideo.tsx # Mobile video component
│   └── ui/                   # shadcn/ui components
├── content/
│   └── blog/                 # MDX blog posts
├── lib/
│   ├── blog.ts               # Blog utilities (getAllPosts, etc.)
│   └── utils.ts              # General utilities
├── public/
│   └── images/               # Static images
└── mdx-components.tsx        # Custom MDX component styles
```

## ✨ Features

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
- ✅ Accessible components (Headless UI, Radix UI)
- ✅ Mobile-first approach

### Pages
- **Home** - Animated hero section with Moebius-inspired imagery
- **About** - Work experience and professional background
- **Blog** - MDX-powered blog with cover images
- **Contact** - Contact information and social links
- **Projects** - Portfolio projects (route configured)

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/sjfortin/samfortin.git
cd samfortin

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the site.

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
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
| next | 16.0.1 | React framework |
| react | 19.2.0 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |
| motion | ^12.23.24 | Animations |
| next-themes | ^0.4.6 | Theme switching |
| @next/mdx | ^16.0.1 | MDX support |
| gray-matter | ^4.0.3 | Frontmatter parsing |

## 🚀 Deployment

This site is deployed on [Vercel](https://vercel.com).

```bash
# Build for production
pnpm build

# The output will be in .next/
```

Vercel provides automatic deployments from Git with zero configuration for Next.js applications.

## 📄 License

This is a personal website. Feel free to use as inspiration, but please don't copy directly.

## 📧 Contact

- **Email**: sam.j.fortin@gmail.com
- **X/Twitter**: [@sjfortin](https://x.com/sjfortin)
- **GitHub**: [sjfortin](https://github.com/sjfortin)

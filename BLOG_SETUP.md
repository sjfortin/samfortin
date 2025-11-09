# MDX Blog Setup Guide

Your blog is now set up to use MDX (Markdown + JSX) for writing blog posts!

## 📦 Required Dependencies

Before running the application, install these packages:

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react @types/mdx remark-gfm remark-frontmatter remark-mdx-frontmatter rehype-slug rehype-autolink-headings gray-matter
```

## 📁 Project Structure

```
samfortin/
├── app/
│   └── blog/
│       ├── page.tsx              # Blog index (lists all posts)
│       └── [slug]/
│           └── page.tsx          # Individual blog post page
├── content/
│   └── blog/
│       ├── README.md             # Blog writing guide
│       ├── getting-started-nextjs.mdx
│       ├── typescript-best-practices.mdx
│       └── web-accessibility.mdx
├── lib/
│   └── blog.ts                   # Blog post utilities
├── mdx-components.tsx            # Custom MDX component styles
└── next.config.ts                # MDX configuration
```

## ✨ Features

- ✅ Write blog posts in Markdown/MDX
- ✅ Frontmatter support for metadata (title, date, description, category, author)
- ✅ Draft posts - hide posts from listing while working on them
- ✅ Cover images - add visual appeal to your posts
- ✅ Automatic blog index generation
- ✅ Dynamic routing for individual posts
- ✅ Syntax highlighting for code blocks
- ✅ Custom styled components (headings, links, lists, etc.)
- ✅ Dark mode support
- ✅ GitHub Flavored Markdown (GFM) support
- ✅ Auto-generated heading anchors

## 📝 Creating a New Blog Post

1. Create a new `.mdx` file in `content/blog/`:

```bash
touch content/blog/my-new-post.mdx
```

2. Add frontmatter and content:

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

```typescript
const greeting = "Hello, World!"
console.log(greeting)
```

You can even use React components!
```

3. The post will automatically appear at `/blog/my-new-post`

## 📝 Draft Posts

Work on posts without publishing them:

```mdx
---
title: "Work in Progress"
draft: true
---
```

- Posts with `draft: true` won't appear in the blog listing
- Still accessible via direct URL for previewing
- Remove or set to `false` when ready to publish

## 🖼️ Cover Images

Add cover images to your posts:

1. Place images in `public/images/blog/`
2. Reference in frontmatter:

```mdx
---
title: "My Post"
coverImage: "/images/blog/my-image.jpg"
---
```

- Images appear at the top of posts and as thumbnails in listings
- Recommended size: 1200x630px (16:9 aspect ratio)
- Supports JPG, PNG, WebP, SVG

## 🎨 Customizing Styles

Edit `mdx-components.tsx` to customize how markdown elements are rendered:

```tsx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="your-custom-classes">{children}</h1>
    ),
    // ... other components
  }
}
```

## 🔧 Configuration

### next.config.ts

The MDX configuration includes:
- Support for `.md` and `.mdx` files
- `remark-gfm` for GitHub Flavored Markdown
- `rehype-slug` for heading IDs
- `rehype-autolink-headings` for clickable headings

### Blog Utilities (lib/blog.ts)

Functions available:
- `getAllPosts()` - Get all blog posts sorted by date
- `getPostBySlug(slug)` - Get a specific post
- `getAllPostSlugs()` - Get all post slugs for static generation

## 🚀 Running the Blog

1. Install dependencies:
```bash
pnpm install
```

2. Start the dev server:
```bash
pnpm dev
```

3. Visit:
   - Blog index: `http://localhost:3000/blog`
   - Individual post: `http://localhost:3000/blog/getting-started-nextjs`

## 📚 Sample Posts

Three sample posts are included:
1. **Getting Started with Next.js 14** - Web Development tutorial
2. **TypeScript Best Practices in 2024** - TypeScript guide
3. **Building Accessible Web Applications** - Accessibility guide

## 🎯 Next Steps

- Install the required dependencies
- Write your first blog post
- Customize the MDX component styles
- Add more remark/rehype plugins as needed
- Consider adding features like:
  - Table of contents
  - Reading time estimation
  - Related posts
  - Tags/categories filtering
  - Search functionality

## 📖 Resources

- [Next.js MDX Documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [MDX Documentation](https://mdxjs.com/)
- [Remark Plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [Rehype Plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)

---

Happy blogging! 🎉

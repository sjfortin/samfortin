# Blog Posts

This directory contains all blog posts written in MDX format.

## Creating a New Blog Post

1. Create a new `.mdx` file in this directory
2. Add frontmatter at the top with metadata
3. Write your content using Markdown and JSX

### Example Post Structure

```mdx
---
title: "Your Post Title"
date: "2024-03-16"
description: "A brief description of your post"
category: "Category Name"
author: "Your Name"
draft: false
coverImage: "/images/blog/my-post-cover.jpg"
---

# Your Post Title

Your content goes here...

## Subheading

More content with **bold** and *italic* text.

- List item 1
- List item 2

```code blocks are supported```
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **date** (required): Publication date in YYYY-MM-DD format
- **description** (required): A brief summary for the blog index
- **category** (required): Category tag for the post
- **author** (optional): Author name (defaults to "Sam Fortin")
- **draft** (optional): Set to `true` to hide the post from the blog listing (defaults to `false`)
- **coverImage** (optional): Path to a cover image for the post (e.g., `/images/blog/cover.jpg`)

## Supported Markdown Features

- Headings (h1-h6)
- Paragraphs
- Lists (ordered and unordered)
- Links
- Images
- Code blocks with syntax highlighting
- Blockquotes
- **Bold** and *italic* text
- Inline `code`

## Using React Components

You can import and use React components in your MDX files:

```mdx
import { MyComponent } from '@/components/MyComponent'

# My Post

<MyComponent prop="value" />
```

## Draft Posts

To work on a post without publishing it to the blog listing, set `draft: true` in the frontmatter:

```mdx
---
title: "Work in Progress"
date: "2024-11-08"
description: "This post is not ready yet"
category: "Tutorial"
draft: true
---
```

Draft posts:
- ✅ Won't appear in the blog index at `/blog`
- ✅ Can still be accessed directly via URL if you know the slug
- ✅ Perfect for previewing posts before publishing
- ✅ Set to `false` or remove the field when ready to publish

## Cover Images

Add visual appeal to your posts with cover images:

```mdx
---
title: "My Visual Post"
coverImage: "/images/blog/my-cover.jpg"
---
```

Cover images:
- Appear at the top of the blog post page
- Show as thumbnails in the blog listing
- Should be placed in the `public/images/blog/` directory
- Use relative paths starting with `/images/blog/`
- Recommended size: 1200x630px (16:9 aspect ratio)
- Supported formats: JPG, PNG, WebP, SVG

## File Naming

Use kebab-case for file names:
- ✅ `my-awesome-post.mdx`
- ❌ `My Awesome Post.mdx`
- ❌ `my_awesome_post.mdx`

The file name becomes the URL slug: `/blog/my-awesome-post`

## Viewing Your Posts

1. Start the dev server: `pnpm dev`
2. Visit `http://localhost:3000/blog` to see all posts
3. Click on a post to view the full content

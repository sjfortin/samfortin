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

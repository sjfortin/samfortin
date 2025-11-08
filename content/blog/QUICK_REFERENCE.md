---
draft: true
---


# Blog Post Quick Reference

## Frontmatter Template

Copy and paste this template for new posts:

```mdx
---
title: "Your Post Title"
date: "2024-11-08"
description: "Brief description for the blog listing"
category: "Category Name"
author: "Sam Fortin"
draft: false
coverImage: "/images/blog/cover.jpg"
---

# Your Post Title

Your content starts here...
```

## Frontmatter Fields

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `title` | ✅ Yes | string | Post title | `"Getting Started with Next.js"` |
| `date` | ✅ Yes | string | Publication date (YYYY-MM-DD) | `"2024-11-08"` |
| `description` | ✅ Yes | string | Brief summary for listings | `"Learn the basics..."` |
| `category` | ✅ Yes | string | Category tag | `"Tutorial"` |
| `author` | ❌ No | string | Author name | `"Sam Fortin"` (default) |
| `draft` | ❌ No | boolean | Hide from blog listing | `true` or `false` (default) |
| `coverImage` | ❌ No | string | Path to cover image | `"/images/blog/cover.jpg"` |

## Common Markdown Syntax

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting
```markdown
**bold text**
*italic text*
`inline code`
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Alt text](/images/my-image.jpg)
```

### Lists
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Code Blocks
````markdown
```typescript
const hello = "world";
console.log(hello);
```
````

### Blockquotes
```markdown
> This is a quote
```

## Draft Posts

Hide a post from the blog listing:

```mdx
---
draft: true
---
```

- Won't appear in `/blog` listing
- Still accessible via direct URL
- Perfect for work-in-progress posts

## Cover Images

### Adding a Cover Image

1. Place image in `public/images/blog/`
2. Add to frontmatter:

```mdx
---
coverImage: "/images/blog/my-cover.jpg"
---
```

### Image Guidelines

- **Recommended size**: 1200x630px (16:9 aspect ratio)
- **Formats**: JPG, PNG, WebP, SVG
- **Optimization**: Use compressed images for faster loading
- **Location**: Always in `public/images/blog/` directory
- **Path**: Always start with `/images/blog/`

## File Naming

✅ **Good**: `my-awesome-post.mdx`  
❌ **Bad**: `My Awesome Post.mdx`  
❌ **Bad**: `my_awesome_post.mdx`

- Use kebab-case (lowercase with hyphens)
- File name becomes the URL slug
- Example: `getting-started.mdx` → `/blog/getting-started`

## Publishing Workflow

1. **Create draft**:
   ```mdx
   ---
   draft: true
   ---
   ```

2. **Preview**: Visit `/blog/your-slug` directly

3. **Publish**: Change to `draft: false` or remove the field

4. **Appears**: Now visible in `/blog` listing

## Tips

- Use descriptive file names (they become URLs)
- Write clear descriptions for better SEO
- Add cover images for visual appeal
- Use draft mode while writing
- Keep categories consistent
- Date format must be YYYY-MM-DD
- Test locally before committing

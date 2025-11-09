import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  author: string;
  content: string;
  draft?: boolean;
  coverImage?: string;
}

export function getAllPosts(): BlogPost[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => {
      // Exclude README files and only include .mdx or .md files
      const isMarkdown = fileName.endsWith('.mdx') || fileName.endsWith('.md');
      const isNotReadme = !fileName.toLowerCase().includes('readme');
      return isMarkdown && isNotReadme;
    })
    .map((fileName) => {
      // Remove ".mdx" or ".md" from file name to get slug
      const slug = fileName.replace(/\.mdx?$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        category: data.category || 'Uncategorized',
        author: data.author || 'Sam Fortin',
        content,
        draft: data.draft || false,
        coverImage: data.coverImage || undefined,
      };
    })
    .filter((post) => !post.draft); // Exclude draft posts

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => {
      const isMarkdown = fileName.endsWith('.mdx') || fileName.endsWith('.md');
      const isNotReadme = !fileName.toLowerCase().includes('readme');
      return isMarkdown && isNotReadme;
    })
    .map((fileName) => fileName.replace(/\.mdx?$/, ''));
}

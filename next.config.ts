import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Configure pageExtensions to include MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['image-cdn-ak.spotifycdn.com'],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here
  options: {
    remarkPlugins: [
      'remark-gfm',
      'remark-frontmatter', // Parse frontmatter
      ['remark-mdx-frontmatter', { name: 'metadata' }], // Remove frontmatter from output
    ],
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings'],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

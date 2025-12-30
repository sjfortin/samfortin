import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import AnimatedImage from '@/components/AnimatedImage';
import { Heading } from '@/components/ui/Heading';
import { Subheading } from '@/components/ui/Subheading';
import { Badge } from '@/components/ui/Badge';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sjfortin.com';

export const metadata: Metadata = {
  title: 'Blog | Sam Fortin',
  description: 'Thoughts, tutorials, and insights on web dev, design, tech and more by Sam Fortin.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/blog`,
    title: 'Sam Fortin Blog',
    description: 'Thoughts, tutorials, and insights on web dev, design, tech and more by Sam Fortin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sam Fortin Blog',
    description: 'Thoughts, tutorials, and insights on web dev, design, tech and more by Sam Fortin.',
  },
};

export default function Blog() {
  const posts = getAllPosts();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: `${siteUrl}/blog`,
    name: 'Sam Fortin Blog',
    description: 'Technical tutorials, engineering stories, and AI playlist experiments.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <Heading>
              Blog
            </Heading>
            <Subheading>
              Thoughts, tutorials, and insights on web dev, design, tech and more.
            </Subheading>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.length === 0 ? (
              <Subheading>
                No blog posts yet. Create your first post in the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">content/blog</code> directory!
              </Subheading>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="flex max-w-xl flex-col items-start group">
                  {post.coverImage && (
                    <AnimatedImage
                      coverImage={post.coverImage}
                      slug={post.slug}
                      title={post.title}
                      imageClassName="p-1 border border-gray-300"
                      grayscaleHover={true}
                    />
                  )}
                  <div className="mt-4 flex flex-row items-center gap-y-2 gap-x-4 text-xs">
                    <time dateTime={post.date} className="text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <Badge>
                      {post.category}
                    </Badge>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-xl font-semibold text-black group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="my-4 text-sm/6 text-gray-600 dark:text-gray-300">
                      {post.description}
                    </p>
                  </div>
                  {/* <div className="relative flex items-center gap-x-4">
                    <div className="size-10 bg-gray-100 dark:bg-black dark:border-gray-500 dark:border flex items-center justify-center">
                      <Image
                        src="/images/moebius-sam.png"
                        alt="Moebius"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="text-sm/6">
                      <p className="font-semibold text-black dark:text-white">
                        {post.author}
                      </p>
                    </div>
                  </div> */}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

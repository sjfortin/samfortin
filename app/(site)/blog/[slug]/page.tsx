import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AnimatedImage from '@/components/AnimatedImage';
import { Badge } from '@/components/ui/Badge';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Sam Fortin`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Dynamically import the MDX file
  const { default: MDXContent } = await import(
    `@/content/blog/${slug}.mdx`
  ).catch(() => {
    notFound();
    return { default: () => null };
  });

  return (
    <>
      <div className="min-h-screen">
        <article className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
          <Link href="/blog" className="flex items-center gap-x-2 mb-8 text-gray-500 dark:text-gray-400 text-xs hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to blog
          </Link>
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full aspect-video mb-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-black dark:border-gray-500 dark:border">
              <AnimatedImage
                coverImage={post.coverImage}
                slug={slug}
                title={post.title}
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-x-4 text-xs mb-4">
              <time
                dateTime={post.date}
                className="text-gray-500 dark:text-gray-400"
              >
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
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
            )}
          </header>

          {/* MDX Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXContent />
          </div>
          <div className="mt-16">
            {/* author */}
            <div className="flex items-center gap-x-4 text-xl mb-4">
              <Image
                src="/images/moebius-sam.png"
                alt="Moebius"
                width={80}
                height={80}
                className="rounded-full"
              />
              <span className="text-gray-500 dark:text-gray-400">
                {post.author}
              </span>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

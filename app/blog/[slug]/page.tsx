import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      <Header />
      <div className="min-h-screen">
        <article className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full aspect-video mb-8 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
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
              <span className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-x-4">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.author}
              </span>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXContent />
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}

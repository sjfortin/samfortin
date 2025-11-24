import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AnimatedImage from '@/components/AnimatedImage';
import { Badge } from '@/components/ui/Badge';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sjfortin.com';

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

  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const ogImage = post.coverImage ? `${siteUrl}${post.coverImage}` : `${siteUrl}/images/moebius-server.png`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
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

  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const ogImage = post.coverImage ? `${siteUrl}${post.coverImage}` : `${siteUrl}/images/moebius-server.png`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen">
        <article className="mx-auto max-w-3xl px-6 py-24 sm:py-32 lg:px-8">
          <Link href="/blog" className="flex items-center gap-x-2 mb-8 text-gray-500 dark:text-gray-400 text-xs hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to blog
          </Link>
          {/* Cover Image */}
          {post.coverImage && (
            <div>
              <AnimatedImage
                coverImage={post.coverImage}
                slug={slug}
                title={post.title}
                imageClassName="p-1 border border-gray-300"
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8 mt-4">
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
                className="p-1 border border-gray-300"
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

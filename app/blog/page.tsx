import Link from 'next/link';
import Image from 'next/image';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from '@/lib/blog';
import AnimatedImage from '@/components/AnimatedImage';

export default function Blog() {
  const posts = getAllPosts();
  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-7xl">
              Blog
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
              Thoughts, tutorials, and insights on web dev, design, tech and more.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No blog posts yet. Create your first post in the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">content/blog</code> directory!
              </p>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="flex max-w-xl flex-col items-start">
                  {post.coverImage && (
                    <AnimatedImage
                      coverImage={post.coverImage}
                      slug={post.slug}
                      title={post.title}
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
                    <span className="relative z-10 rounded-xl bg-gray-100 dark:bg-black dark:border-gray-500 dark:border px-3 py-1 text-xs text-gray-600 dark:text-gray-300 max-w-fit">
                      {post.category}
                    </span>
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
                  <div className="relative flex items-center gap-x-4">
                    <div className="size-10 rounded-full bg-gray-100 dark:bg-black dark:border-gray-500 dark:border flex items-center justify-center">
                      <Image
                        src="/images/moebius-sam.png"
                        alt="Moebius"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="text-sm/6">
                      <p className="font-semibold text-black dark:text-white">
                        {post.author}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

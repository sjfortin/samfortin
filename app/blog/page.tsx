import Header from "@/components/Header";
import Footer from "@/components/Footer";

const posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    href: '#',
    description:
      'Learn how to build modern web applications with Next.js 14, exploring the new App Router, Server Components, and more.',
    date: 'Mar 16, 2024',
    datetime: '2024-03-16',
    category: { title: 'Web Development', href: '#' },
    author: {
      name: 'Sam Fortin',
      role: 'Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: 'TypeScript Best Practices in 2024',
    href: '#',
    description:
      'Discover the latest TypeScript patterns and practices that will help you write more maintainable and type-safe code.',
    date: 'Mar 10, 2024',
    datetime: '2024-03-10',
    category: { title: 'TypeScript', href: '#' },
    author: {
      name: 'Sam Fortin',
      role: 'Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: 'Building Accessible Web Applications',
    href: '#',
    description:
      'A comprehensive guide to making your web applications accessible to everyone, including keyboard navigation and screen reader support.',
    date: 'Feb 28, 2024',
    datetime: '2024-02-28',
    category: { title: 'Accessibility', href: '#' },
    author: {
      name: 'Sam Fortin',
      role: 'Developer',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
];

export default function Blog() {
  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              Blog
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
              Thoughts, tutorials, and insights on web development, design, and technology.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex max-w-xl flex-col items-start">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500 dark:text-gray-400">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-xl font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <img alt="" src={post.author.imageUrl} className="size-10 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div className="text-sm/6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <a href="#">
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{post.author.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

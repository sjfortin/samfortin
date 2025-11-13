import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from other libraries.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customize built-in components
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-7 text-gray-600 dark:text-gray-300 mb-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 underline"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-gray-300 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 text-gray-600 dark:text-gray-300 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-gray-900 dark:text-gray-100">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-700 dark:text-gray-300 my-4">
        {children}
      </blockquote>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded-lg my-4"
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}

import Link from 'next/link'
import Image from "next/image"

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'p5.js experiments', href: 'https://art.samfort.in/', target: '_blank' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/sjfortin',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/samfortin/',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
      ),
    },
    {
      name: 'Email',
      href: 'mailto:sam.j.fortin@gmail.com',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 5-10-5" /></svg>
      ),
    },
    {
      name: 'Spotify',
      href: 'https://open.spotify.com/user/sjfortin?si=d4804399442c455f',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.4762 0.00964792C5.85357 -0.25357 0.271882 4.90135 0.00964546 11.524C-0.253571 18.1466 4.90269 23.7271 11.5241 23.9904C18.1465 24.2536 23.7272 19.0987 23.9904 12.476C24.2525 5.85341 19.0976 0.271689 12.4762 0.00964792ZM17.5412 17.5894C17.392 17.8526 17.1013 17.9842 16.8183 17.9448C16.7318 17.9326 16.6451 17.9042 16.5639 17.8581C14.9779 16.9554 13.2493 16.3676 11.4264 16.1109C9.60353 15.8541 7.77945 15.943 6.00597 16.3741C5.62095 16.4673 5.23378 16.2315 5.14061 15.8465C5.04745 15.4616 5.2832 15.0745 5.66822 14.9811C7.61822 14.5072 9.62334 14.4098 11.6261 14.6916C13.6289 14.9735 15.5285 15.6195 17.2735 16.6122C17.6167 16.8085 17.7376 17.2449 17.5422 17.5894H17.5412ZM19.1184 14.4394C18.8738 14.8913 18.3077 15.0602 17.8558 14.8156C16.0002 13.8119 13.9907 13.1527 11.8838 12.8565C9.77692 12.5606 7.66432 12.6406 5.6035 13.0935C5.4915 13.1176 5.38088 13.1221 5.2734 13.1066C4.89936 13.054 4.57907 12.7755 4.49355 12.3838C4.38273 11.8815 4.70087 11.3847 5.20318 11.2739C7.48112 10.7728 9.81634 10.6839 12.1437 11.0107C14.4701 11.3374 16.6912 12.0659 18.7422 13.1758C19.1951 13.4204 19.363 13.9853 19.1184 14.4382V14.4394ZM20.8667 10.8879C20.6363 11.331 20.1571 11.5603 19.6897 11.4944C19.5636 11.4769 19.4396 11.4373 19.3202 11.3759C17.1595 10.2516 14.832 9.50924 12.4026 9.16795C9.97325 8.82687 7.53055 8.89924 5.14395 9.3841C4.52317 9.51021 3.91868 9.10872 3.79256 8.48912C3.66644 7.86834 4.06794 7.26403 4.68773 7.13792C7.33088 6.60148 10.0335 6.52145 12.7217 6.89883C15.41 7.276 17.9853 8.0986 20.3786 9.3435C20.9401 9.63535 21.1584 10.3273 20.8667 10.8889V10.8879Z" fill="currentColor" />
        </svg>


      ),
    }
  ],
}

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
          {navigation.main.map((item) => {
            if (item.href.startsWith('http')) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {item.name}
                </a>
              )
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-16 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-sm/6 text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Sam Fortin.
        </p>
        <div className="flex justify-center lg:flex-1 text-center mt-5">
          <Link href="/">
            <span className="font-semibold text-base/7 sr-only">Sam Fortin</span>
            <Image
              alt=""
              src="/logo.svg"
              width={100}
              height={24}
              className="h-8 w-auto dark:hidden hover:opacity-80"
            />
            <Image
              alt=""
              src="/logo-white.svg"
              width={100}
              height={24}
              className="h-8 w-auto hidden dark:block hover:opacity-80"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

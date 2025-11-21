import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import AnimatedHomeImage from "@/components/AnimatedHomeImage";
import AnimatedHomeVideo from "@/components/AnimatedHomeVideo";
import { Subheading } from "@/components/ui/Subheading";
import { Heading } from "@/components/ui/Heading";

export default function Home() {
  return (
    <>
      <main>
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[32rem] lg:h-[64rem] w-full stroke-gray-100 dark:stroke-gray-900 [mask-image:radial-gradient(80vw_80vw_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={50}
                height={50}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
          </svg>
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 sm:pt-48 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">


                  <AnimatedHomeImage
                    src="/images/moebius-sam.png"
                    preload={true}
                    width={140}
                    height={140}
                    className="aspect-[1/1] bg-black/5 object-cover shadow-lg rounded-full mb-4"
                    initialY={0}
                    animateY={0}
                    duration={0.6}
                  />
                  <Heading>
                    Sam Fortin
                  </Heading>
                  <h2 className="text-pretty text-xl font-semibold tracking-tight text-black sm:text-3xl dark:text-white">
                    Full Stack Software Engineer
                  </h2>
                  <Subheading>
                    I've spent the last 8+ years building on the web. JavaScript, TypeScript, React and a healthy obsession with clean code, a11y and performance.
                  </Subheading>
                  <p className="hidden lg:block mt-4">
                    <Link href="/blog/moebius" className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 group">Why all the Moebius? <ArrowRightIcon className="w-4 h-4 transition-transform duration-800 group-hover:translate-x-2" /></Link>
                  </p>
                  {/* Add cta to the /playlists feature */}
                  <div className="hidden lg:block mt-4 w-full">
                    <Link
                      href="/playlists"
                      className="group relative flex items-center gap-3 rounded-lg bg-black dark:bg-white px-6 py-4 transition-all hover:scale-105 active:scale-95 w-full justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white dark:text-black">AI Playlists</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Turn your mood into a Spotify playlist</span>
                      </div>
                      <ArrowRightIcon className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </Link>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden lg:flex mt-14 justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-4.png"
                      preload={true}
                      delay={0.1}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg rounded-lg"
                    />
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-5.png"
                      preload={true}
                      delay={0.2}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg rounded-lg"
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-3.png"
                      preload={true}
                      delay={0.3}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg rounded-lg"
                    />
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-6.png"
                      delay={0.4}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg rounded-lg"
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-2.png"
                      delay={0.5}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg rounded-lg"
                    />
                  </div>
                </div>
                {/* Mobile */}
                <div className="lg:hidden mt-8">
                  <AnimatedHomeVideo src="/videos/moebius-home-2.mp4" />
                  <div className="mt-4">
                    <Link href="/blog/moebius" className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">Why all the Moebius? <ArrowRightIcon className="w-4 h-4" /></Link>
                    <div className="mt-4 w-full lg:hidden">
                      <Link
                        href="/playlists"
                        className="group relative flex items-center gap-3 rounded-lg bg-black dark:bg-white px-6 py-4 w-full justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white dark:text-black">AI Playlists</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">Turn your mood into a Spotify playlist</span>
                        </div>
                        <ArrowRightIcon className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

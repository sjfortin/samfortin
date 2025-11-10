import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="relative isolate">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-100 dark:stroke-gray-900 [mask-image:radial-gradient(80vw_80vw_at_center,white,transparent)]"
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

                  <Image
                    preload={true}
                    alt=""
                    src="/images/moebius-sam.png"
                    width={140}
                    height={140}
                    className="aspect-[1/1] bg-gray-900/5 object-cover shadow-lg rounded-full mb-4"
                  />
                  <h1 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-white">
                    Sam Fortin
                  </h1>
                  <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-500 sm:text-3xl dark:text-white">
                    Full Stack Software Engineer
                  </h2>
                  <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 lg:max-w-none dark:text-gray-400">
                    I'm a full stack developer with an eye for design. I'm passionate about creating
                    beautiful and functional websites that provide a great user experience.
                  </p>
                  <p className="hidden lg:block mt-4">
                    <Link href="/blog/moebius" className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 group">The inspiration of Moebius <ArrowRightIcon className="w-4 h-4 transition-transform duration-2000 group-hover:translate-x-100" /></Link>
                  </p>
                </div>
                {/* Desktop */}
                <div className="hidden lg:flex mt-14 justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        preload={true}
                        alt=""
                        src="/images/home/moebius-home-4.png"
                        width={528}
                        height={528}
                        className="aspect-[2/3] w-full bg-gray-900/5 object-cover shadow-lg rounded-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        preload={true}
                        alt=""
                        src="/images/home/moebius-home-5.png"
                        width={528}
                        height={528}
                        className="aspect-[2/3] w-full bg-gray-900/5 object-cover shadow-lg rounded-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
                    </div>
                    <div className="relative">
                      <Image
                        preload={true}
                        alt=""
                        src="/images/home/moebius-home-3.png"
                        width={528}
                        height={528}
                        className="aspect-[2/3] w-full bg-gray-900/5 object-cover shadow-lg rounded-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
                    </div>
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <div className="relative">
                      <Image
                        alt=""
                        src="/images/home/moebius-home-6.png"
                        width={528}
                        height={528}
                        className="aspect-[2/3] w-full bg-gray-900/5 object-cover shadow-lg rounded-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
                    </div>
                    <div className="relative">
                      <Image
                        alt=""
                        src="/images/home/moebius-home-2.png"
                        width={528}
                        height={528}
                        className="aspect-[2/3] w-full bg-gray-900/5 object-cover shadow-lg rounded-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10" />
                    </div>
                  </div>
                </div>
                {/* Mobile */}
                <div className="lg:hidden mt-8">
                  <video autoPlay muted className="w-full">
                    {Math.random() < 0.5 ? (
                      <source src="/videos/moebius-home.mp4" type="video/mp4" />
                    ) : (
                      <source src="/videos/moebius-home-2.mp4" type="video/mp4" />
                    )}
                  </video>
                  <div className="mt-4">
                    <Link href="/blog/moebius" className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">The inspiration of Moebius <ArrowRightIcon className="w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

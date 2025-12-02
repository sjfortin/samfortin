import AnimatedHomeImage from "@/components/AnimatedHomeImage";
import { Subheading } from "@/components/ui/Subheading";
import { Heading } from "@/components/ui/Heading";
import { HomeCTA } from "@/components/HomeCTA";

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
                    width={120}
                    height={120}
                    className="aspect-[1/1] bg-white dark:bg-black object-cover shadow-lg mb-4 p-1 border border-gray-300"
                    initialY={0}
                    animateY={0}
                    duration={0.6}
                  />
                  <Heading>
                    Sam Fortin
                  </Heading>
                  <h2 className="text-pretty text-xl font-semibold tracking-tight text-black sm:text-3xl dark:text-white">
                    Software Engineer
                  </h2>
                  <Subheading>
                    I've spent the last 8+ years building on the web. JavaScript, TypeScript, React and a healthy obsession with clean code, a11y and performance.
                  </Subheading>
                  <div className="hidden lg:block mt-4 w-full">
                    {/* <HomeCTA
                      href={`/blog/moebius`}
                      title="Moebius Influence"
                      description="The influence of Moebius on this site."
                      eyebrow="Blog"
                      variant="secondary"
                    /> */}
                  </div>
                  {/* Add cta to the /playlists feature */}
                  <div className="hidden lg:block mt-4 w-full">
                    <HomeCTA
                      href="/playlists"
                      title="Playlists"
                      description="Turn your mood into a Spotify playlist"
                      variant="secondary"
                      eyebrow="Feature"
                    />
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden lg:flex mt-14 justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-4.png"
                      preload={true}
                      delay={0.1}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                    />
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-5.png"
                      preload={true}
                      delay={0.2}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-3.png"
                      preload={true}
                      delay={0.3}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                    />
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-6.png"
                      delay={0.4}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-2.png"
                      delay={0.5}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                    />
                  </div>
                </div>
                {/* Mobile */}
                <div className="lg:hidden mt-8">
                  {/* <div className="w-full">
                    <AnimatedHomeVideo src="/videos/moebius-home-2.mp4" />
                  </div> */}
                  <div className="mt-4 space-y-4">
                    {/* <HomeCTA
                      href={`/blog/moebius`}
                      title="Moebius Influence"
                      description="The influence of Moebius on this site."
                      eyebrow="Blog"
                      variant="secondary"
                    /> */}
                    <div className="w-full lg:hidden">
                      <HomeCTA
                        href="/playlists"
                        title="Playlists"
                        description="Turn your mood into a Spotify playlist"
                        variant="secondary"
                        eyebrow="Feature"
                      />
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

import AnimatedHomeImage from "@/components/AnimatedHomeImage";
import { Subheading } from "@/components/ui/Subheading";
import { Heading } from "@/components/ui/Heading";
import { HomeCTA } from "@/components/HomeCTA";

export default function Home() {
  return (
    <>
      <main>
        <div className="relative isolate">
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-16">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
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
                      grayscaleScroll={true}
                      grayscaleScrollThreshold={200}
                    />
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-5.png"
                      preload={true}
                      delay={0.2}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                      grayscaleScroll={true}
                      grayscaleScrollThreshold={100}
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-3.png"
                      preload={true}
                      delay={0.3}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                      grayscaleScroll={true}
                      grayscaleScrollThreshold={200}
                    />
                  </div>
                  <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-6.png"
                      delay={0.4}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                      grayscaleScroll={true}
                      grayscaleScrollThreshold={100}
                    />
                    <AnimatedHomeImage
                      src="/images/home/moebius-home-2.png"
                      delay={0.5}
                      className="aspect-[2/3] w-full bg-black/5 object-cover shadow-lg border border-gray-300 p-1"
                      grayscaleScroll={true}
                      grayscaleScrollThreshold={400}
                    />
                  </div>
                </div>
                {/* Mobile */}
                <div className="lg:hidden mt-8">
                  <div className="mt-4 space-y-4">
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

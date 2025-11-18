import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedAboutImage from "@/components/AnimatedAboutImage";

export default function About() {

  const work = [
    {
      company: "Estee Lauder",
      title: "Senior Full Stack Software Engineer",
      date: "October 2024 — October 2025",
    },
    {
      company: "Irish Titan",
      title: "Software Engineer",
      date: "November 2019 — October 2024",
    },
    {
      company: "Optum",
      title: "Software Engineer",
      date: "November 2018 — November 2019",
    },
    {
      company: "OneOme",
      title: "Web Developer",
      date: "November 2017 — November 2018",
    },
    {
      company: "Prime Digital Academy",
      title: "Full Stack Development Bootcamp Student",
      date: "June 2017 — October 2017",
    },
    {
      company: "metroConnections",
      title: "Technology Solutions Designer",
      date: "August 2013 — July 2017",
    },
  ]

  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              About Me
            </h1>
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="w-full md:w-2/3 order-2 md:order-1 gap-4">
                <p className="mt-8 text-gray-900 dark:text-white sm:text-xl/8">
                  I'm a Software Engineer who has been building on the web for 8+ years. I love working with JavaScript, TypeScript and React. I'm all about writing clean code, making things fast, creating great looking websites while ensuring everything is secure and accessible.
                </p>
                <h2 className="mt-8 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Recent Timeline
                </h2>
                <div className="mt-4 space-y-8">
                  {work.map((job) => (
                    <div className="relative" key={job.company}>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.company}
                        </h3>
                        <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {job.title}
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {job.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/3 order-1 md:order-2 mt-4 md:mt-0">
                <AnimatedAboutImage
                  src="/images/sam.jpg"
                  alt="Sam Fortin"
                  width={800}
                  height={1200}
                  className="aspect-[16/9] w-full md:w-auto md:aspect-[9/16] bg-gray-900/5 object-cover shadow-lg rounded-lg shadow-gray-900/5"
                />
              </div>
            </div>
          </div>


        </div>
      </div>
      <Footer />
    </>
  );
}
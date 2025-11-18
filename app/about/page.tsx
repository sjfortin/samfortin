import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      company: "metroConnections",
      title: "Technology Solutions Designer",
      date: "November 2013 — November 2017",
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
            <p className="mt-8 text-gray-900 dark:text-white sm:text-xl/8">
              I'm a Software Engineer who has been building on the web for 8+ years. I love working with JavaScript, TypeScript and React. I'm all about writing clean code, making things fast, creating great looking websites while ensuring everything is secure and accessible.
            </p>
          </div>

          <div className="mx-auto mt-16 lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Work Experience
            </h2>
            <div className="mt-10 space-y-8 lg:max-w-3xl">
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
        </div>
      </div>
      <Footer />
    </>
  );
}
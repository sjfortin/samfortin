import Header from "@/components/Header";
import Footer from "@/components/Footer";

const projects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'A modern web application built with Next.js and TypeScript, featuring real-time collaboration and beautiful UI.',
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS'],
    link: '#',
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'An innovative mobile-first solution that helps users manage their daily tasks with AI-powered suggestions.',
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    link: '#',
  },
  {
    id: 3,
    name: 'Project Gamma',
    description: 'Open-source library for building accessible and performant UI components with minimal configuration.',
    technologies: ['React', 'TypeScript', 'Storybook'],
    link: '#',
  },
  {
    id: 4,
    name: 'Project Delta',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
];

export default function Projects() {
  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              Projects
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
              A collection of my work, experiments, and open-source contributions.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex flex-col items-start rounded-2xl border border-gray-200 p-8 dark:border-gray-800"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="mt-4 text-base/7 text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.link}
                  className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View project <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

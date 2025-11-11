import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  image?: string;
}

const projects: Project[] = [
  {
    name: 'Estee Lauder Companies',
    description: 'Launced a React/Typescript microfrontend application for Estee Lauder Companies that launched on brands such as Clinique and MAC Cosmetics.',
    technologies: ['React', 'TypeScript', 'Elixir'],
    link: '#',
    image: '/images/experience/estee.png',
  },
  {
    name: 'Fast Signs',
    description: 'Open-source library for building accessible and performant UI components with minimal configuration.',
    technologies: ['React', 'TypeScript', 'Storybook'],
    link: '#',
  },
  {
    name: 'Darn Tough Socks',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
  {
    name: 'GED.com',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
  {
    name: '2DSemiConductors',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
  {
    name: 'WindowParts.com',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
  {
    name: 'Optum',
    description: 'Full-stack e-commerce platform with advanced analytics and seamless payment integration.',
    technologies: ['Next.js', 'PostgreSQL', 'Stripe'],
    link: '#',
  },
  {
    name: 'OneOme',
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
          <div className="mx-auto lg:mx-0">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              Projects
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-xl/8">
              Some professional projects I have worked on.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.name}
                className="flex flex-col items-start rounded-2xl border border-gray-200 p-8 dark:border-gray-800"
              >
                <div className="flex-1">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={500}
                      height={500}
                      className="mb-4 rounded-lg object-cover"
                    />
                  )}
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
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.link}
                  className="mt-6 text-sm font-semibold text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
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

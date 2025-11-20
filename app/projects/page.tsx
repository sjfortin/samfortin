import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import Link from 'next/link';
import { ExternalLinkIcon } from "lucide-react";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  links: { name: string; url: string }[];
  image?: string;
  video?: string;
}

const projects: Project[] = [
  {
    name: 'Estee Lauder Companies',
    description: 'Launced a React/Typescript microfrontend application for Estee Lauder Companies that launched on brands such as Clinique and MAC Cosmetics.',
    technologies: ['React', 'TypeScript', 'Mobx', 'Elixir', 'Perl'],
    links: [
      { name: 'Estee Lauder Companies', url: 'https://www.elcompanies.com/en/our-brands' },
      { name: 'Clinique', url: 'https://www.clinique.com/smartrewards' },
      { name: 'MAC Cosmetics', url: 'https://www.maccosmetics.com/mac-lover' },
    ],
    image: '/images/experience/estee.png',
  },
  {
    name: 'TC Farm',
    description: 'Custom React/Next.js application built with BigCommerce as the ecommerce platform to power the ordering, payment, and delivery process.',
    technologies: ['React', 'Next.js', 'BigCommerce', 'AWS DynamoDB', 'Stripe', 'AWS Amplify', 'Tanstack Query', 'Tailwind CSS', 'Zustand'],
    links: [
      { name: 'TC Farm', url: 'https://tc.farm/' },
    ],
    image: '/images/experience/tcfarm.png',
  },
  {
    name: 'Darn Tough Socks',
    description: 'Shopify re-theme and development. PIM integration.',
    technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML'],
    links: [
      { name: 'Darn Tough Socks', url: 'https://darntough.com/' },
    ],
    image: '/images/experience/darntough.png',
  },
  {
    name: 'GED.com',
    description: 'Wordpress multi-site development.',
    technologies: ['Wordpress', 'JavaScript', 'CSS', 'HTML'],
    links: [
      { name: 'GED.com', url: 'https://ged.com/' },
    ],
    image: '/images/experience/ged.svg',
  },
  {
    name: '2DSemiConductors',
    description: 'Periodic table of elements React product search widget for 2DSemiConductors.',
    technologies: ['React', 'Laravel', 'BigCommerce'],
    links: [
      { name: '2DSemiConductors', url: 'https://2dsemiconductors.com/' },
    ],
    image: '/images/experience/2dsemi.png',
  },
  {
    name: 'WindowParts.com',
    description: 'Ecommerce platform migration from Volusion to Shopify with full ecommerce site build. Built an ETL pipeline to migrate data from Volusion to Shopify in Node.js.',
    technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid', 'Node.js'],
    links: [
      { name: 'WindowParts.com', url: 'https://windowparts.com/' },
    ],
    image: '/images/experience/windowparts.png',
  },
  {
    name: 'Random Whiteboarding Video',
    description: 'Random Whiteboarding Video.',
    technologies: [],
    links: [],
    video: '/videos/whiteboarding.mp4',
  },
  {
    name: 'Irish Titan',
    description: 'Marketing website for Irish Titan built with React and Gatsby.',
    technologies: ['React', 'Gatsby', 'Stripe', 'AWS Amplify'],
    links: [
      { name: 'Irish Titan', url: 'https://irishtitan.com/' },
    ],
    image: '/images/experience/irishtitan.png',
  },
  {
    name: 'Tradehome Shoes',
    description: 'Ecommerce website for Tradehome Shoes built with Shopify.',
    technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid'],
    links: [
      { name: 'Tradehome Shoes', url: 'https://tradehome.com/' },
    ],
    image: '/images/experience/tradehome.png',
  },
  {
    name: 'Nordicware',
    description: 'Headless ecommerce website for Nordicware built with BigCommerce and Wordpress.',
    technologies: ['BigCommerce', 'Wordpress', 'JavaScript', 'CSS', 'HTML', 'PHP'],
    links: [
      { name: 'Nordicware', url: 'https://nordicware.com/' },
    ],
    image: '/images/experience/nordicware.png',
  },
  {
    name: 'LaCrosse Technology',
    description: 'Ecommerce website for LaCrosse Technology built with Shopify. Custom integration with LaCrosse Technology mobile app product registration.',
    technologies: ['Shopify', 'JavaScript', 'CSS', 'HTML', 'Liquid', 'Laravel'],
    links: [
      { name: 'LaCrosse Technology', url: 'https://lacrossetechnology.com/' },
    ],
    image: '/images/experience/lacrosse.png',
  },
  {
    name: 'Optum',
    description: 'Software feature development work with the Optum User Experience Design Studio (UXDS).',
    technologies: ['JavaScript', 'AEM', 'Sass and SCSS'],
    links: [
      { name: 'Optum', url: 'https://optum.com/' },
    ],
    image: '/images/experience/optum.svg',
  },
  {
    name: 'OneOme',
    description: 'Pharmacogenomics software development for OneOme.',
    technologies: ['Grav CMS', 'JavaScript', 'CSS', 'HTML', 'Python', 'Flask', 'Braintree Payments'],
    links: [
      { name: 'OneOme', url: 'https://oneome.com/' },
    ],
    image: '/images/experience/oneome.png',
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
              A selection of professional projects I've contributed to throughout my career.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {projects.map((project) => (
              <article
                key={project.name}
                className="flex max-w-xl flex-col items-start"
              >
                {project.video && (
                  <div className="rounded-lg overflow-hidden aspect-ratio-9/16">
                    <video
                      src={project.video}
                      className="object-contain"
                      autoPlay
                      muted
                      loop
                      preload="true"
                    />
                  </div>
                )}

                {!project.video && (
                  <>
                    {project.image && (
                      <AnimatedImage
                        coverImage={project.image}
                        title={project.name}
                        imageClassName="object-contain p-4"
                      />
                    )}
                    <div className="group relative my-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                        {project.name}
                      </h3>
                      <p className="text-sm/6 text-gray-600 dark:text-gray-300 mt-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.links.length > 0 && (
                      <div className="flex flex-col gap-1 mt-4 w-full">
                        {project.links.map((link) => (
                          <Link key={link.url} target="_blank" rel="noopener noreferrer" href={link.url} className="text-xs text-gray-400 dark:text-gray-400 flex align-center gap-1 hover:text-gray-600 dark:hover:text-gray-300">
                            {link.name}
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

              </article>
            ))}
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
}

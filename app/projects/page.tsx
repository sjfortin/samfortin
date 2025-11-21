'use client';

import { useState, useMemo } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedImage from "@/components/AnimatedImage";
import Link from 'next/link';
import { ExternalLinkIcon, X, PlusIcon, MinusIcon } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Subheading } from "@/components/ui/Subheading";
import { Badge } from '@/components/ui/Badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { projects } from "./projectData";

export default function Projects() {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedTechnologies.length === 0) {
      return projects;
    }
    return projects.filter(project =>
      selectedTechnologies.some(tech => project.technologies.includes(tech))
    );
  }, [selectedTechnologies]);

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSelectedTechnologies([]);
  };

  return (
    <>
      <Header />
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto lg:mx-0">
            <Heading>
              Projects
            </Heading>
            <Subheading>
              A selection of professional projects I've contributed to throughout my career.
            </Subheading>
          </div>

          <div className="mt-8">
            <div className="flex-inline mb-4 p-2 border rounded-lg border-gray-200 dark:border-gray-700 w-full">
              <Collapsible className="group">
                <CollapsibleTrigger className="cursor-pointer text-xs font-semibold text-black dark:text-white flex items-center gap-1 w-full">
                  <PlusIcon className="h-4 w-4 group-data-[state=open]:hidden" />
                  <MinusIcon className="h-4 w-4 group-data-[state=closed]:hidden" />
                  Filter by Technology
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {allTechnologies.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechnology(tech)}
                          className={`cursor-pointer relative z-10 inline-flex items-center rounded-xl border px-3 py-1 text-xs transition-colors ${selectedTechnologies.includes(tech)
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-black dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-900'
                            }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <div className="flex items-center gap-4">
              {selectedTechnologies.length > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Showing {filteredProjects.length} of {projects.length} projects
                </p>
              )}
              {selectedTechnologies.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {filteredProjects.map((project) => (
              <article
                key={project.name}
                className="flex max-w-xl flex-col items-start border border-gray-200 dark:border-none rounded-lg"
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
                    {project.image ? (
                      <AnimatedImage
                        coverImage={project.image}
                        title={project.name}
                        imageClassName="object-contain p-4"
                      />
                    ) : (
                      <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100 dark:bg-white">
                        <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-black font-semibold text-xl uppercase">{project.name}</div>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="group relative my-4">
                        <h3 className="text-xl font-semibold text-black group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300">
                          {project.name}
                        </h3>
                        <p className="text-sm/6 text-gray-600 dark:text-gray-300 mt-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech}>
                            {tech}
                          </Badge>
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
                    </div>
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

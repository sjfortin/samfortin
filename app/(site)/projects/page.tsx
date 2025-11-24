'use client';

import { useState, useMemo } from 'react';
import ProjectCard from "@/components/projects/ProjectCard";
import { X, PlusIcon, MinusIcon } from "lucide-react";
import { Heading } from "@/components/ui/Heading";
import { Subheading } from "@/components/ui/Subheading";
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
            <div className="flex-inline mb-4">
              <Collapsible className="group">
                <CollapsibleTrigger className="cursor-pointer text-xs font-semibold text-gray-500 dark:text-white flex items-center gap-1 mb-2">
                  <PlusIcon className="h-4 w-4 group-data-[state=open]:hidden" />
                  <MinusIcon className="h-4 w-4 group-data-[state=closed]:hidden" />
                  Filter by Technology
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {allTechnologies.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechnology(tech)}
                          className={`cursor-pointer relative z-10 inline-flex items-center border px-3 py-1 text-xs transition-colors ${selectedTechnologies.includes(tech)
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
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
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

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 md:grid-cols-2 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div >
    </>
  );
}

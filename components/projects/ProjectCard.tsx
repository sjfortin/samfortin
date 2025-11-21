'use client';

import { useId } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { ExternalLinkIcon } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  technologies: string[];
  links: { name: string; url: string }[];
  image?: string;
  video?: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const patternId = useId();

  if (project.video) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border dark:border-border shadow-sm h-full">
        <video
          src={project.video}
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="true"
        />
      </div>
    );
  }

  return (
    <div className="group w-full flex flex-col overflow-clip rounded-lg border border-gray-200 bg-white shadow-sm h-full">
      <div className="relative w-full shrink-0 h-40 bg-white flex items-center justify-center overflow-clip rounded-t-lg p-2 border-b border-gray-200">
        <svg className="pointer-events-none absolute inset-0 size-full select-none text-gray-600/20">
          <defs>
            <pattern
              id={patternId}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        
        <div className="relative size-full flex items-center justify-center">
          {project.image ? (
            <div className="relative w-full h-full">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="rounded-lg object-contain p-4"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 font-semibold text-xl uppercase">
              {project.name}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 bg-gray-50/50 backdrop-blur-sm flex-1">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} theme="light" className="px-2 py-0.5 text-[10px] font-normal">
              {tech}
            </Badge>
          ))}
        </div>
        
        {project.links.length > 0 && (
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-gray-200/50">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors w-fit"
              >
                <span className="font-medium">{link.name}</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

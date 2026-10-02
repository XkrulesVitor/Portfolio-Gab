"use client";

import { useEffect, type RefObject } from "react";
import type { Project } from "@/content/projects";
import { useStory } from "@/components/story/story-context";
import { ProjectCard } from "./project-card";

interface ProjectsListProps {
  ref: RefObject<HTMLElement | null>;
  projects: Project[];
}

/**
 * Fase 3. Cada projeto ocupa uma "faixa" de ~88% da viewport; no desktop os
 * cards alternam esquerda/direita e o notebook, ao fundo, vai para o lado oposto.
 *
 * O card ativo é detectado por um IntersectionObserver com a raiz reduzida a
 * uma linha no meio da tela (rootMargin -50%): barato e sem ouvir scroll.
 */
export function ProjectsList({ ref, projects }: ProjectsListProps) {
  const { activeProject } = useStory();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeProject.set(Number(entry.target.getAttribute("data-project-index")));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    root.querySelectorAll("[data-project-index]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [ref, activeProject, projects.length]);

  if (projects.length === 0) {
    return (
      <section ref={ref} aria-label="Projetos" className="relative flex min-h-[70svh] items-center justify-center px-5">
        <div className="glass pointer-events-auto max-w-md rounded-[22px] p-8 text-center">
          <p className="text-lg font-semibold tracking-[-0.02em]">Os projetos chegam em breve.</p>
          <p className="mt-2 text-fg-muted">
            Adicione itens em <code className="font-mono text-sm">src/content/projects.ts</code> para preencher esta seção.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Lista de projetos" className="relative pb-[10svh]">
      <ol>
        {projects.map((project, i) => (
          <li
            key={project.slug}
            data-project-index={i}
            className={`mx-auto flex min-h-[88svh] max-w-[40rem] items-center px-4 md:px-0 split:max-w-[1600px] split:px-[6vw] ${
              i % 2 === 0 ? "split:justify-start" : "split:justify-end"
            }`}
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ol>
    </section>
  );
}

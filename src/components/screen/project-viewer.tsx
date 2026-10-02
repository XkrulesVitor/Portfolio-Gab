"use client";

import type { Project } from "@/content/projects";
import { ProjectCover } from "@/components/ui/project-cover";
import { useStory } from "@/components/story/story-context";
import { useMotionState } from "@/hooks/use-motion-state";
import styles from "./screen.module.css";

/**
 * Na fase de projetos a tela continua ligada e exibe o projeto do card ativo.
 * Todas as capas ficam empilhadas; a troca é um crossfade em CSS (barato).
 * É decorativo: o conteúdo acessível está nos cards.
 */
export function ProjectViewer({ projects }: { projects: Project[] }) {
  const { activeProject } = useStory();
  const active = useMotionState(activeProject, (v) => v);

  return (
    <div className={styles.viewer} aria-hidden>
      {projects.map((project, i) => (
        <div key={project.slug} className={styles.viewerSlide} data-active={i === active}>
          <ProjectCover project={project} sizes="(min-width: 1024px) 50vw, 80vw" />
        </div>
      ))}
    </div>
  );
}

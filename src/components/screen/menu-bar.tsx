"use client";

import { BatteryFull } from "@phosphor-icons/react/dist/ssr/BatteryFull";
import { WifiHigh } from "@phosphor-icons/react/dist/ssr/WifiHigh";
import type { StoryChapter } from "@/content/profile";
import type { Project } from "@/content/projects";
import { useNow } from "@/hooks/use-now";
import { useStory } from "@/components/story/story-context";
import { useMotionState } from "@/hooks/use-motion-state";
import styles from "./screen.module.css";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" });
const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

interface MenuBarProps {
  owner: string;
  chapters: StoryChapter[];
  projects: Project[];
}

/**
 * Barra de menus do "sistema" da tela. O nome do app acompanha o capítulo
 * da história e, na fase de projetos, o projeto em destaque.
 */
export function MenuBar({ owner, chapters, projects }: MenuBarProps) {
  const { chapter, t, activeProject } = useStory();
  const chapterIndex = useMotionState(chapter, (v) => Math.round(v));
  const inProjects = useMotionState(t, (v) => v > 2.45);
  const projectIndex = useMotionState(activeProject, (v) => v);
  const now = useNow();

  const storyApp = chapterIndex === 0 ? owner : chapters[chapterIndex - 1]?.label;
  const projectApp = projects[projectIndex]?.title ?? "Projetos";

  return (
    <div className={styles.menuBar} aria-hidden>
      <div className={styles.menuLeft}>
        <span className={styles.menuMark}>G</span>
        <span className={`${styles.menuApp} ${styles.appSwap}`}>
          <span data-visible={!inProjects}>{storyApp}</span>
          <span data-visible={inProjects}>{projectApp}</span>
        </span>
        <span className={styles.menuItem}>Arquivo</span>
        <span className={styles.menuItem}>Editar</span>
        <span className={styles.menuItem}>Visualizar</span>
      </div>
      <div className={styles.menuRight}>
        <WifiHigh className={styles.menuIcon} weight="bold" />
        <BatteryFull className={styles.menuIcon} weight="fill" />
        <span className={styles.menuDate}>{now ? dateFormat.format(now) : ""}</span>
        <span>{now ? timeFormat.format(now) : ""}</span>
      </div>
    </div>
  );
}

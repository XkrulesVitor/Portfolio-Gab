"use client";

import { motion, useTransform } from "motion/react";
import type { Profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import { SCREEN_TIMELINE } from "@/components/story/choreography";
import { useStory } from "@/components/story/story-context";
import { MenuBar } from "./menu-bar";
import { ProjectViewer } from "./project-viewer";
import { StoryColumn } from "./story-column";
import styles from "./screen.module.css";

interface ScreenUIProps {
  profile: Profile;
  projects: Project[];
}

/**
 * Tudo o que aparece na tela do notebook, em camadas:
 *   papel de parede → história (fases 0-1) → projetos (fases 2-3)
 *   → barra de menus → reflexo do vidro → "energia" (liga no load, apaga no fim).
 */
export function ScreenUI({ profile, projects }: ScreenUIProps) {
  const { t, pose } = useStory();

  const storyOpacity = useTransform(t, [...SCREEN_TIMELINE.storyOut], [1, 0]);
  const projectsOpacity = useTransform(t, [...SCREEN_TIMELINE.projectsIn], [0, 1]);
  const powerOff = useTransform(t, [...SCREEN_TIMELINE.powerOff], [0, 1]);
  // O reflexo desliza conforme o notebook gira, como luz fixa sobre vidro em movimento.
  const glare = useTransform(pose, (p) => `translate3d(${(-p.turn * 0.9).toFixed(2)}%, 0, 0)`);

  return (
    <div className={styles.root}>
      <div className={styles.wallpaper} aria-hidden />

      <motion.div className={styles.layer} style={{ opacity: storyOpacity }}>
        <StoryColumn profile={profile} />
      </motion.div>

      {/* Fica por cima da história mesmo invisível: sem eventos, para o hover dos chips funcionar. */}
      <motion.div className={`${styles.layer} ${styles.passive}`} style={{ opacity: projectsOpacity }}>
        <ProjectViewer projects={projects} />
      </motion.div>

      <MenuBar owner={profile.firstName} chapters={profile.chapters} projects={projects} />

      <motion.div className={styles.glare} style={{ transform: glare }} aria-hidden />
      <motion.div className={styles.power} style={{ opacity: powerOff }} aria-hidden />
      {/* Liga a tela depois que o notebook entra em cena. */}
      <motion.div
        className={styles.power}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden
      />
    </div>
  );
}

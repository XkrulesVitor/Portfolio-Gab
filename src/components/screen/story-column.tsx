"use client";

import { motion, useTransform } from "motion/react";
import type { Profile } from "@/content/profile";
import { useStory } from "@/components/story/story-context";
import { useMotionState } from "@/hooks/use-motion-state";
import { LockScreen } from "./lock-screen";
import { AboutPanel, EducationPanel, JourneyPanel, StackPanel } from "./story-panels";
import styles from "./screen.module.css";

/**
 * Coluna com as "páginas" da história, cada uma com 100% da altura da tela.
 * Rolar a página move a coluna em unidades de tela (cqh): o capítulo `c`
 * fica visível quando a coluna está em translateY(-c * 100cqh).
 * `chapter` já vem com platôs (dwellMap), então cada página assenta antes da próxima.
 */
export function StoryColumn({ profile }: { profile: Profile }) {
  const { chapter } = useStory();
  const transform = useTransform(chapter, (c) => `translate3d(0, ${(-c * 100).toFixed(3)}cqh, 0)`);
  const active = useMotionState(chapter, (c) => Math.round(c));

  return (
    <motion.div className={styles.column} style={{ transform }}>
      <LockScreen name={profile.name} portrait={profile.portrait} active={active === 0} />
      <AboutPanel profile={profile} active={active === 1} />
      <JourneyPanel profile={profile} active={active === 2} />
      <EducationPanel profile={profile} active={active === 3} />
      <StackPanel profile={profile} active={active === 4} />
    </motion.div>
  );
}

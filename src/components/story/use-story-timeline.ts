"use client";

import { useScroll, useTransform, type MotionValue } from "motion/react";
import type { RefObject } from "react";

export interface TimelineRefs {
  hero: RefObject<HTMLElement | null>;
  story: RefObject<HTMLElement | null>;
  intro: RefObject<HTMLElement | null>;
  projects: RefObject<HTMLElement | null>;
  contact: RefObject<HTMLElement | null>;
}

export interface StoryTimeline {
  /** Linha do tempo global, de 0 a 5 (ver choreography.ts). */
  t: MotionValue<number>;
  /** Progresso só do trecho da história (0..1), usado pela rolagem interna da tela. */
  storyProgress: MotionValue<number>;
}

/**
 * Converte a rolagem da página em uma linha do tempo única.
 *
 * Cada seção do primeiro plano mede o próprio progresso (0..1) com `useScroll`.
 * Os trechos são contíguos e não se sobrepõem, então a soma é monotônica:
 *
 *   hero      "start start" → "end start"   o hero sai pelo topo            t 0 → 1
 *   story     "start start" → "end end"     espaçador da história            t 1 → 2
 *   intro     "start end"   → "start start" seção "Projetos" entra           t 2 → 3
 *   projects  "start end"   → "start 0.3"   lista sobe até 30% da tela       t 3 → 4
 *   contact   "start end"   → "end end"     contato entra por baixo          t 4 → 5
 *
 * Entre o fim de `projects` e o início de `contact`, t fica parado em 4:
 * é ali que o vaivém da Fase 3 acontece, guiado pelo card ativo.
 */
export function useStoryTimeline(refs: TimelineRefs): StoryTimeline {
  const hero = useScroll({ target: refs.hero, offset: ["start start", "end start"] }).scrollYProgress;
  const story = useScroll({ target: refs.story, offset: ["start start", "end end"] }).scrollYProgress;
  const intro = useScroll({ target: refs.intro, offset: ["start end", "start start"] }).scrollYProgress;
  const projects = useScroll({ target: refs.projects, offset: ["start end", "start 0.3"] }).scrollYProgress;
  const contact = useScroll({ target: refs.contact, offset: ["start end", "end end"] }).scrollYProgress;

  const t = useTransform([hero, story, intro, projects, contact], (progress: number[]) =>
    progress.reduce((sum, value) => sum + value, 0),
  );

  return { t, storyProgress: story };
}

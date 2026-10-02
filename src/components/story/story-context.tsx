"use client";

import type { MotionValue } from "motion/react";
import { createContext, use } from "react";
import type { LaptopPose, LayoutMode } from "./choreography";

/**
 * Tudo o que muda com o scroll é MotionValue: os consumidores leem os valores
 * por frame sem provocar re-render. O objeto do contexto só muda quando o
 * layout (mobile/tablet/desktop) ou a preferência de movimento mudam.
 */
export interface StoryContextValue {
  /** Linha do tempo global (0..5). */
  t: MotionValue<number>;
  /** Progresso do trecho da história (0..1). */
  storyProgress: MotionValue<number>;
  /** Capítulo exibido na tela, com platôs (0 = tela de bloqueio, 1..4 = capítulos). */
  chapter: MotionValue<number>;
  /** Pose final do notebook neste frame (keyframes + vaivém da fase de projetos). */
  pose: MotionValue<LaptopPose>;
  /** Índice do card de projeto mais próximo do centro da viewport. */
  activeProject: MotionValue<number>;
  layout: LayoutMode;
  reducedMotion: boolean;
  scrollToChapter: (chapter: number) => void;
}

export const StoryContext = createContext<StoryContextValue | null>(null);

export function useStory(): StoryContextValue {
  const value = use(StoryContext);
  if (!value) throw new Error("useStory precisa estar dentro de <ScrollStory>.");
  return value;
}

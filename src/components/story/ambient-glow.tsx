"use client";

import { motion, useTransform, type MotionStyle } from "motion/react";
import { toneColors, type Project } from "@/content/projects";
import { useStory } from "./story-context";

const STORY_GLOW = toneColors.olive.glow;

/**
 * Luz difusa atrás do notebook, como o brilho de uma tela num ambiente escuro.
 * Segue a posição do notebook (só translate, nada de blur animado) e assume a
 * cor do projeto ativo na fase de projetos, com transição via @property.
 */
export function AmbientGlow({ projects }: { projects: Project[] }) {
  const { pose, t, activeProject } = useStory();

  const transform = useTransform(pose, (p) => `translate3d(${(p.x * 0.85).toFixed(2)}vw, ${p.y.toFixed(2)}vh, 0)`);
  const opacity = useTransform(t, [0, 1, 2, 2.6, 3, 4, 4.6, 5], [0.9, 0.55, 0.55, 0.85, 0.9, 1, 0.55, 0.35]);
  const color = useTransform(() => {
    if (t.get() < 2.5) return STORY_GLOW;
    const project = projects[activeProject.get()];
    return project ? toneColors[project.tone].glow : STORY_GLOW;
  });

  // Variáveis CSS funcionam no `style` do Motion, mas não estão nos tipos dele.
  const style = {
    transform,
    opacity,
    "--glow-color": color,
    background:
      "radial-gradient(closest-side, color-mix(in oklab, var(--glow-color) calc(var(--glow-strength) * 34%), transparent), transparent 72%)",
  } as MotionStyle;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -ml-[45vmax] -mt-[45vmax] size-[90vmax] [transition:--glow-color_900ms_ease]"
      style={style}
    />
  );
}

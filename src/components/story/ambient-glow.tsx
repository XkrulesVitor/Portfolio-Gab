"use client";

import { motion, useTransform, type MotionStyle } from "motion/react";
import { toneColors, type Project } from "@/content/projects";
import { useStory } from "./story-context";

/** Fora da fase de projetos a luz usa o roxo da marca (token --glow-base). */
const BASE_GLOW = "var(--glow-base)";

/**
 * Luz difusa atrás do notebook, como o brilho de uma tela num ambiente escuro.
 * Segue a posição do notebook (só translate, nada de blur animado) e assume a
 * cor do projeto ativo na fase de projetos, com transição via @property.
 * Uma segunda camada fixa, bem fraca, deixa um halo roxo no topo da página.
 */
export function AmbientGlow({ projects }: { projects: Project[] }) {
  const { pose, t, activeProject } = useStory();

  const transform = useTransform(pose, (p) => `translate3d(${(p.x * 0.85).toFixed(2)}vw, ${p.y.toFixed(2)}vh, 0)`);
  const opacity = useTransform(t, [0, 1, 2, 2.6, 3, 4, 4.6, 5], [1, 0.6, 0.6, 0.85, 0.9, 1, 0.6, 0.45]);
  const color = useTransform(() => {
    if (t.get() < 2.5) return BASE_GLOW;
    const project = projects[activeProject.get()];
    return project ? toneColors[project.tone].glow : BASE_GLOW;
  });

  // Variáveis CSS funcionam no `style` do Motion, mas não estão nos tipos dele.
  const style = {
    transform,
    opacity,
    "--glow-color": color,
    background: [
      "radial-gradient(closest-side,",
      "color-mix(in oklab, var(--glow-color) calc(var(--glow-strength) * 42%), transparent),",
      "color-mix(in oklab, var(--glow-color) calc(var(--glow-strength) * 12%), transparent) 48%,",
      "transparent 74%)",
    ].join(" "),
  } as MotionStyle;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% -12%, color-mix(in oklab, var(--glow-base) calc(var(--glow-strength) * 20%), transparent), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-[45vmax] -mt-[45vmax] size-[90vmax] [transition:--glow-color_900ms_ease]"
        style={style}
      />
    </>
  );
}

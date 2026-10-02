"use client";

import { motion, useTransform } from "motion/react";
import type { Ref } from "react";
import { useStory } from "@/components/story/story-context";

interface ProjectsIntroProps {
  ref: Ref<HTMLElement>;
  title: string;
  body: string;
}

/**
 * Fase 2. Enquanto esta seção sobe (t 2 → 3) o notebook desliza para a
 * direita; o título ocupa o lado esquerdo que ele deixou livre.
 */
export function ProjectsIntro({ ref, title, body }: ProjectsIntroProps) {
  const { t } = useStory();
  const opacity = useTransform(t, [2.3, 2.8, 3.25, 3.7], [0, 1, 1, 0]);
  const y = useTransform(t, [2.3, 2.85], [56, 0]);

  return (
    <section ref={ref} id="projetos" aria-labelledby="projetos-title" className="relative h-svh">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pt-[17svh] md:px-10 md:pt-[15svh] split:justify-center split:pt-0"
      >
        <div className="max-w-[30rem] split:w-[36%]">
          <h2
            id="projetos-title"
            className="text-[clamp(2.75rem,6.4vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-[32ch] text-[clamp(1rem,1.25vw,1.1875rem)] leading-relaxed text-fg-muted">
            {body}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

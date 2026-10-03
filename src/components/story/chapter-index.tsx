"use client";

import { motion, useTransform } from "motion/react";
import type { StoryChapter } from "@/content/profile";
import { SCREEN_TIMELINE } from "./choreography";
import { useMotionState } from "@/hooks/use-motion-state";
import { useStory } from "./story-context";

const [inStart, inEnd] = SCREEN_TIMELINE.chapterIndexIn;
const [outStart, outEnd] = SCREEN_TIMELINE.chapterIndexOut;

/**
 * Índice de capítulos à direita do notebook durante a Fase 1 (só desktop).
 * Mostra em que parte da história a tela está e permite pular entre capítulos.
 */
export function ChapterIndex({ chapters }: { chapters: StoryChapter[] }) {
  const { t, chapter, scrollToChapter, layout } = useStory();

  const opacity = useTransform(t, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const x = useTransform(t, [inStart, inEnd, outStart, outEnd], [24, 0, 0, 24]);
  const interactive = useMotionState(t, (v) => v > inEnd - 0.05 && v < outStart + 0.05);
  const active = useMotionState(chapter, (v) => Math.round(v));

  if (layout !== "desktop") return null;

  return (
    <motion.nav
      aria-label="Capítulos da história"
      className="absolute right-[max(1.5rem,3vw)] top-1/2 -translate-y-1/2"
      style={{ opacity, x, pointerEvents: interactive ? "auto" : "none" }}
    >
      <ol className="flex flex-col gap-1">
        {chapters.map((item, i) => {
          const index = i + 1;
          const isActive = active === index;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToChapter(index)}
                aria-current={isActive ? "step" : undefined}
                tabIndex={interactive ? 0 : -1}
                className="group flex items-center gap-3 py-1.5 text-left text-sm"
              >
                <span
                  aria-hidden
                  className={`h-px transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    isActive ? "w-8 bg-accent" : "w-4 bg-fg-faint group-hover:w-6 group-hover:bg-fg-muted"
                  }`}
                />
                <span
                  className={`transition-colors duration-300 ${
                    isActive ? "text-fg" : "text-fg-faint group-hover:text-fg-muted"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

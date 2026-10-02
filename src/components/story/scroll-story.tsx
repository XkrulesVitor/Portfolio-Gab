"use client";

import { useLenis } from "lenis/react";
import { useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useCallback, useMemo, useRef } from "react";
import type { Profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import { Contact } from "@/components/sections/contact";
import { HeroIntro } from "@/components/sections/hero-intro";
import { ProjectsIntro } from "@/components/sections/projects-intro";
import { ProjectsList } from "@/components/sections/projects-list";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { dwellMap } from "@/lib/motion-math";
import { CHOREOGRAPHY, composePose, toReducedMotion } from "./choreography";
import { Stage } from "./stage";
import { StoryContext, type StoryContextValue } from "./story-context";
import { useLayoutMode } from "./use-layout-mode";
import { useStoryTimeline } from "./use-story-timeline";

/** Altura do espaçador da história, em svh. Controla o "tempo" de leitura de cada capítulo. */
const STORY_SVH = 380;
/** Fração de cada transição em que a tela fica parada num capítulo. */
const CHAPTER_DWELL = 0.42;

interface ScrollStoryProps {
  profile: Profile;
  projects: Project[];
}

/**
 * Orquestrador do scrollytelling.
 *
 * Estrutura:
 *   <div trilha>
 *     <Stage sticky h-svh>        ← notebook, luz, índice (z: stage)
 *     <div -mt-[100svh]>          ← primeiro plano, rola por cima (z: foreground)
 *       Hero (100svh)             t 0 → 1
 *       Espaçador da história     t 1 → 2   (a tela rola por dentro)
 *       Intro de projetos         t 2 → 3
 *       Lista de projetos         t 3 → 4   (+ vaivém guiado pelo card ativo)
 *       Contato                   t 4 → 5
 *
 * Nenhum estado React muda durante o scroll: tudo flui por MotionValues.
 */
export function ScrollStory({ profile, projects }: ScrollStoryProps) {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const { t, storyProgress } = useStoryTimeline({
    hero: heroRef,
    story: storyRef,
    intro: introRef,
    projects: projectsRef,
    contact: contactRef,
  });

  const layout = useLayoutMode();
  const reducedMotion = usePrefersReducedMotion();
  const choreography = useMemo(
    () => (reducedMotion ? toReducedMotion(CHOREOGRAPHY[layout]) : CHOREOGRAPHY[layout]),
    [layout, reducedMotion],
  );

  // Capítulo da tela: 0 = bloqueio, 1..N = capítulos, com platôs de leitura.
  const chapterCount = profile.chapters.length;
  const stops = useMemo(() => Array.from({ length: chapterCount + 1 }, (_, i) => i), [chapterCount]);
  const chapter = useTransform(storyProgress, (p) => dwellMap(p, stops, CHAPTER_DWELL));

  // Fase 3: card par (esquerda) → notebook à direita (+1); card ímpar → esquerda (-1).
  const activeProject = useMotionValue(0);
  const side = useTransform(activeProject, (i): number => (i % 2 === 0 ? 1 : -1));
  const sideSpring = useSpring(side, { stiffness: 64, damping: 15, mass: 1 });
  const sideVelocity = useVelocity(sideSpring);

  // Uma pose por frame, compartilhada por notebook, luz e reflexo da tela.
  const pose = useTransform(() => composePose(choreography, t.get(), sideSpring.get(), sideVelocity.get()));

  const lenis = useLenis();
  const scrollToChapter = useCallback(
    (index: number) => {
      const spacer = storyRef.current;
      if (!spacer) return;
      const top = spacer.getBoundingClientRect().top + window.scrollY;
      const distance = spacer.offsetHeight - window.innerHeight;
      const target = top + (index / chapterCount) * distance;
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [lenis, chapterCount, reducedMotion],
  );

  const value = useMemo<StoryContextValue>(
    () => ({ t, storyProgress, chapter, pose, activeProject, layout, reducedMotion, scrollToChapter }),
    [t, storyProgress, chapter, pose, activeProject, layout, reducedMotion, scrollToChapter],
  );

  return (
    <StoryContext value={value}>
      <div className="relative">
        <Stage profile={profile} projects={projects} />

        <div className="pointer-events-none relative -mt-[100svh]" style={{ zIndex: "var(--z-foreground)" }}>
          <HeroIntro ref={heroRef} profile={profile} />

          {/* Espaço de rolagem da Fase 1. As âncoras caem no platô de cada capítulo. */}
          <div ref={storyRef} className="relative" style={{ height: `${STORY_SVH}svh` }} aria-hidden>
            {profile.chapters.map((item, i) => (
              <span
                key={item.id}
                id={item.id}
                className="absolute left-0 h-px w-px"
                style={{ top: `${((i + 1) / chapterCount) * (STORY_SVH - 100)}svh` }}
              />
            ))}
          </div>

          <ProjectsIntro ref={introRef} title={profile.projectsIntro.title} body={profile.projectsIntro.body} />
          <ProjectsList ref={projectsRef} projects={projects} />
          <Contact ref={contactRef} profile={profile} />
        </div>
      </div>
    </StoryContext>
  );
}

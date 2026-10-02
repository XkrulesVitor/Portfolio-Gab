"use client";

import { motion, useTransform } from "motion/react";
import type { Profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import { ScreenUI } from "@/components/screen/screen-ui";
import { AmbientGlow } from "./ambient-glow";
import { ChapterIndex } from "./chapter-index";
import { LaptopRig } from "./laptop-rig";
import { ScreenMirror } from "./screen-mirror";
import { useStory } from "./story-context";

interface StageProps {
  profile: Profile;
  projects: Project[];
}

/**
 * Palco sticky: ocupa exatamente uma viewport e fica preso no topo durante
 * toda a trilha (hero → história → projetos → contato). O conteúdo do primeiro
 * plano rola por cima dele.
 *
 * Camadas, de trás para frente:
 *   luz ambiente → (entrada) → cena com perspectiva → notebook
 *   → tela-espelho 2D (só na história) → índice de capítulos
 */
export function Stage({ profile, projects }: StageProps) {
  const { pose } = useStory();
  const sceneOpacity = useTransform(pose, (p) => p.opacity);

  return (
    <div className="sticky top-0 h-svh overflow-hidden" style={{ zIndex: "var(--z-stage)" }}>
      <AmbientGlow projects={projects} />

      {/* Entrada no carregamento (tempo, não scroll). Fica fora da cena 3D. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 56, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/*
          A perspectiva acompanha o tamanho do notebook, então a distorção é a mesma
          em qualquer tela. Distância longa (3x a largura) = lente "tele", como nas
          fotos de produto.
        */}
        <motion.div
          className="absolute inset-0 [perspective-origin:50%_42%] [perspective:calc(var(--lid-w)*3)]"
          style={{ opacity: sceneOpacity }}
        >
          <LaptopRig screen={<ScreenUI profile={profile} projects={projects} />} />
        </motion.div>
      </motion.div>

      <ScreenMirror profile={profile} projects={projects} />
      <ChapterIndex chapters={profile.chapters} />
    </div>
  );
}

"use client";

import { motion, useTransform } from "motion/react";
import type { CSSProperties } from "react";
import type { Profile } from "@/content/profile";
import type { Project } from "@/content/projects";
import laptopStyles from "@/components/laptop/laptop.module.css";
import { ScreenUI } from "@/components/screen/screen-ui";
import { useMotionState } from "@/hooks/use-motion-state";
import { round } from "@/lib/motion-math";
import { TIMELINE } from "./choreography";
import { useStory } from "./story-context";

/** Mesma caixa da tampa (`.rig`), mas sem nenhum contexto 3D. */
const mirrorBox: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "var(--lid-w)",
  height: "var(--lid-h)",
  marginLeft: "calc(var(--lid-w) / -2)",
  marginTop: "calc(var(--lid-h) / -2)",
  pointerEvents: "none",
  ["--u" as string]: "var(--lid-u)",
};

/**
 * TELA-ESPELHO (nitidez do texto na Fase 1)
 * --------------------------------------------------------------------------
 * Dentro de uma cena com `perspective`, o navegador compõe a tela por um
 * caminho 3D que reamostra a textura, e o texto perde um pouco de nitidez.
 *
 * Na história (t 1 → 2) o notebook está parado, de frente e em escala 1: a
 * matriz da tampa é neutra (tilt -20° + tampa +20° no mesmo pivô). Nessa fase
 * uma cópia 2D da tela é posicionada exatamente sobre a tela 3D, com a mesma
 * geometria (variáveis de globals.css) e a mesma translação. Visualmente é a
 * mesma tela, só que composta em 2D, com texto pixel-perfeito.
 *
 * A cópia é decorativa (aria-hidden): o conteúdo acessível continua na tela 3D.
 */
export function ScreenMirror({ profile, projects }: { profile: Profile; projects: Project[] }) {
  const { t, pose } = useStory();
  const visible = useMotionState(t, (v) => v >= TIMELINE.zoomed && v <= TIMELINE.storyEnd);
  const transform = useTransform(pose, (p) => `translate(${round(p.x)}vw, ${round(p.y)}vh)`);

  return (
    <motion.div
      aria-hidden
      inert
      style={{ ...mirrorBox, transform, visibility: visible ? "visible" : "hidden" }}
    >
      <div className={laptopStyles.screen}>
        <ScreenUI profile={profile} projects={projects} />
      </div>
      <div className={laptopStyles.notch}>
        <span className={laptopStyles.camera} />
      </div>
    </motion.div>
  );
}

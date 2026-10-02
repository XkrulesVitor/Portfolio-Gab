"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Lenis suaviza a roda do mouse/trackpad (a rolagem por toque continua nativa)
 * e já respeita `prefers-reduced-motion` sozinho. Como ele move o scroll nativo,
 * o `useScroll` do Motion continua funcionando sem integração extra.
 * `anchors: true` faz os links "#secao" rolarem suavemente.
 */
const LENIS_OPTIONS = { lerp: 0.085, smoothWheel: true, anchors: true } as const;

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={LENIS_OPTIONS} />
      {children}
    </MotionConfig>
  );
}

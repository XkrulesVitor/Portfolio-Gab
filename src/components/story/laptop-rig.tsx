"use client";

import { useTransform } from "motion/react";
import type { ReactNode } from "react";
import { Laptop } from "@/components/laptop/laptop";
import { round } from "@/lib/motion-math";
import { useStory } from "./story-context";

/**
 * Liga a pose calculada por frame às três camadas de transformação do notebook.
 * São três strings derivadas de um único MotionValue: um cálculo de pose por frame.
 */
export function LaptopRig({ screen }: { screen: ReactNode }) {
  const { pose } = useStory();

  const rigTransform = useTransform(
    pose,
    (p) => `translate3d(${round(p.x)}vw, ${round(p.y)}vh, ${round(p.z, 1)}px) scale(${round(p.scale, 4)})`,
  );
  const bodyTransform = useTransform(
    pose,
    (p) => `rotateX(${round(p.tilt, 2)}deg) rotateY(${round(p.turn, 2)}deg) rotateZ(${round(p.roll, 2)}deg)`,
  );
  const lidTransform = useTransform(pose, (p) => `rotateX(${round(p.lid, 2)}deg)`);

  return (
    <Laptop
      rigTransform={rigTransform}
      bodyTransform={bodyTransform}
      lidTransform={lidTransform}
      screen={screen}
    />
  );
}

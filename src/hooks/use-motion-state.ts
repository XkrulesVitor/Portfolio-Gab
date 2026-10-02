"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useState } from "react";

/**
 * Converte um MotionValue em estado React discreto. Só re-renderiza quando o
 * valor selecionado muda (ex.: o capítulo arredondado), nunca a cada frame.
 * `select` deve devolver primitivos para a comparação funcionar.
 */
export function useMotionState<T, R>(value: MotionValue<T>, select: (latest: T) => R): R {
  const [state, setState] = useState(() => select(value.get()));
  useMotionValueEvent(value, "change", (latest) => setState(select(latest)));
  return state;
}

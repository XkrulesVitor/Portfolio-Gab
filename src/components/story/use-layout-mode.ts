"use client";

import { useSyncExternalStore } from "react";
import { LAYOUT_QUERIES, type LayoutMode } from "./choreography";

function subscribe(onChange: () => void) {
  const lists = [window.matchMedia(LAYOUT_QUERIES.desktop), window.matchMedia(LAYOUT_QUERIES.tablet)];
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function getSnapshot(): LayoutMode {
  if (window.matchMedia(LAYOUT_QUERIES.desktop).matches) return "desktop";
  if (window.matchMedia(LAYOUT_QUERIES.tablet).matches) return "tablet";
  return "mobile";
}

const getServerSnapshot = (): LayoutMode => "desktop";

/**
 * Qual tabela de poses usar. No servidor assume desktop; o palco nasce
 * invisível e só aparece depois da hidratação, então a troca não pisca.
 */
export function useLayoutMode(): LayoutMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

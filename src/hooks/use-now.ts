"use client";

import { useSyncExternalStore } from "react";

/**
 * Relógio compartilhado com resolução de minuto. Um único timer atende todos os
 * componentes. No servidor (e na hidratação) devolve `null`, evitando que a hora
 * do build divirja da hora do navegador.
 */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  timer ??= setInterval(() => listeners.forEach((listener) => listener()), 10_000);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

export function useNow(): Date | null {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return minute === null ? null : new Date(minute * 60_000);
}

/**
 * Funções numéricas puras usadas pela coreografia de scroll.
 * Nada aqui toca o DOM ou o React: tudo é testável isoladamente.
 */

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Arredonda para strings de transform curtas (e nunca em notação científica). */
export const round = (value: number, digits = 3) => Number(value.toFixed(digits));

/** Inverso do lerp: onde `value` cai entre `from` e `to` (sem clamp). */
export const progressBetween = (from: number, to: number, value: number) =>
  from === to ? 0 : (value - from) / (to - from);

/** Hermite clássico: 0 antes de `edge0`, 1 depois de `edge1`, curva suave no meio. */
export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp(progressBetween(edge0, edge1, value));
  return t * t * (3 - 2 * t);
};

export type Easing = (t: number) => number;

export const ease = {
  linear: (t: number) => t,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outCubic: (t: number) => 1 - (1 - t) ** 3,
} satisfies Record<string, Easing>;

/**
 * Mapeia um progresso linear (0..1) sobre uma lista de "paradas", criando um
 * platô em torno de cada parada. É o que faz a tela do notebook "assentar" em
 * cada capítulo antes de deslizar para o próximo, como nas páginas da Apple.
 *
 * `dwell` é a fração de cada trecho gasta parada (0 = rolagem contínua).
 */
export function dwellMap(progress: number, stops: readonly number[], dwell = 0.4): number {
  const transitions = stops.length - 1;
  if (transitions < 1) return stops[0] ?? 0;

  const x = clamp(progress) * transitions;
  const index = Math.min(Math.floor(x), transitions - 1);
  const local = x - index;
  const half = clamp(dwell, 0, 0.95) / 2;
  const travel = clamp((local - half) / (1 - 2 * half));

  return lerp(stops[index], stops[index + 1], ease.inOutCubic(travel));
}

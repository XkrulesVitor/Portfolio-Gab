import { clamp, ease, lerp, smoothstep, type Easing } from "@/lib/motion-math";

/**
 * COREOGRAFIA DO NOTEBOOK
 * ==========================================================================
 * A página inteira é uma única linha do tempo `t`, de 0 a 5, montada a partir
 * do progresso de rolagem de cada seção (ver `use-story-timeline.ts`):
 *
 *   t = 0 ─ 1   Fase 1a  Hero → zoom. O palco está sticky; o notebook sai da
 *                        diagonal à esquerda, gira de frente e cresce até a
 *                        escala nativa (scale 1). A senha da tela se preenche.
 *   t = 1 ─ 2   Fase 1b  História. O notebook fica parado; só o conteúdo DENTRO
 *                        da tela rola (capítulos Sobre, Trajetória, Formação, Stack).
 *   t = 2 ─ 3   Fase 2   Transição lateral. Encolhe e desliza da esquerda para
 *                        a direita, girando para a diagonal espelhada.
 *   t = 3 ─ 4   Fase 3   Recuo. Vai para o fundo (menor, mais alto, mais
 *                        transparente) enquanto os cards de projeto sobem por cima.
 *   t = 4       Fase 3   Enquanto a lista de projetos rola, `t` fica parado em 4
 *                        e um spring alterna o notebook entre esquerda e direita
 *                        (sempre do lado oposto ao card ativo).
 *   t = 4 ─ 5   Final    Volta ao centro, desce e fecha a tampa no contato.
 *
 * Unidades: x em vw, y em vh, z em px, rotações em graus.
 * O tamanho nativo do notebook vem do CSS (`--lid-w`), então scale 1 é sempre
 * o maior tamanho que ele atinge: o texto da tela nunca é ampliado além da
 * resolução em que foi rasterizado.
 */

export type LayoutMode = "mobile" | "tablet" | "desktop";

/** Media queries espelhadas em `globals.css` (variável --lid-w). */
export const LAYOUT_QUERIES = {
  desktop: "(min-width: 1024px), (min-width: 640px) and (min-aspect-ratio: 13/10)",
  tablet: "(min-width: 768px)",
} as const;

export const TIMELINE = {
  hero: 0,
  zoomed: 1,
  storyEnd: 2,
  aside: 3,
  background: 4,
  closed: 5,
} as const;

export interface LaptopPose {
  /** Deslocamento do centro da tampa em relação ao centro da viewport (vw). */
  x: number;
  /** Deslocamento vertical (vh). Positivo = para baixo. */
  y: number;
  /** Profundidade (px). Negativo = afasta da câmera. */
  z: number;
  /** Escala uniforme. 1 = tamanho nativo definido por --lid-w. */
  scale: number;
  /** Inclinação da câmera (rotateX). Negativo = vemos o teclado de cima. */
  tilt: number;
  /** Giro no "prato giratório" (rotateY). Positivo = a tela vira para a direita. */
  turn: number;
  /** Inclinação lateral (rotateZ). */
  roll: number;
  /** Abertura da tampa além da vertical (rotateX na dobradiça). 20 = aberta, -88 = fechada. */
  lid: number;
  /** Opacidade da cena inteira (usada no recuo para o fundo). */
  opacity: number;
}

export interface PoseKeyframe {
  at: number;
  pose: LaptopPose;
  /** Curva do trecho que TERMINA neste keyframe. */
  ease?: Easing;
}

export interface SwingConfig {
  /** Amplitude do vaivém lateral na fase de projetos (vw). */
  x: number;
  /** Quanto o notebook gira para "olhar" para o centro quando está de lado (graus). */
  turn: number;
  /** Inclinação máxima causada pela velocidade do spring (graus). */
  lean: number;
}

export interface Choreography {
  keyframes: PoseKeyframe[];
  swing: SwingConfig;
}

/**
 * Tampa com abertura de 110°: inclinação de 20° além da vertical. Com a câmera
 * em tilt -20°, as duas rotações se anulam e a tela fica exatamente de frente.
 */
const OPEN = 20;
const CLOSED = -88;

const pose = (p: Partial<LaptopPose>): LaptopPose => ({
  x: 0,
  y: 0,
  z: 0,
  scale: 1,
  tilt: -20,
  turn: 0,
  roll: 0,
  lid: OPEN,
  opacity: 1,
  ...p,
});

/*
 * Atenção ao ler os `y`: a origem do notebook é o centro da TAMPA. Com a tampa
 * fechada, o volume visível (base vista de cima) fica bem abaixo dessa origem,
 * por isso o final usa y negativo para o notebook fechado ficar no terço inferior.
 */
const desktop: Choreography = {
  keyframes: [
    // Hero: diagonal à esquerda, tela virada para o texto do hero.
    { at: TIMELINE.hero, pose: pose({ x: -21, y: -6, scale: 0.47, tilt: -14, turn: 30, roll: -1 }) },
    // Zoom: de frente, escala nativa, levemente à esquerda (o índice de capítulos fica à direita).
    { at: TIMELINE.zoomed, pose: pose({ x: -6.5, y: 3.5 }), ease: ease.inOutCubic },
    { at: TIMELINE.storyEnd, pose: pose({ x: -6.5, y: 3.5 }), ease: ease.linear },
    // Transição lateral: desliza para a direita e espelha a diagonal.
    { at: TIMELINE.aside, pose: pose({ x: 21, y: -5, scale: 0.47, tilt: -14, turn: -30, roll: 1 }), ease: ease.inOutCubic },
    // Recuo: fundo da cena. O vaivém soma ±x a partir daqui.
    { at: TIMELINE.background, pose: pose({ y: -6, z: -120, scale: 0.5, tilt: -12, opacity: 0.8 }), ease: ease.inOutCubic },
    // Final: desce para o centro já fechando a tampa (o texto do contato ainda não apareceu)...
    { at: 4.4, pose: pose({ y: 10, scale: 0.4, tilt: -22, turn: -10, lid: -10 }), ease: ease.inOutCubic },
    // ...quase fechado quando o texto entra...
    { at: 4.75, pose: pose({ y: -6, scale: 0.36, tilt: -28, turn: -13, lid: -70 }), ease: ease.inOutCubic },
    // ...e termina fechado, apoiado no terço inferior, sob o texto.
    { at: TIMELINE.closed, pose: pose({ y: -9, scale: 0.36, tilt: -30, turn: -14, lid: CLOSED }), ease: ease.outCubic },
  ],
  swing: { x: 12, turn: 20, lean: 5 },
};

const tablet: Choreography = {
  keyframes: [
    { at: TIMELINE.hero, pose: pose({ y: -17, scale: 0.66, tilt: -15, turn: 20 }) },
    { at: TIMELINE.zoomed, pose: pose({ y: -2 }), ease: ease.inOutCubic },
    { at: TIMELINE.storyEnd, pose: pose({ y: -2 }), ease: ease.linear },
    { at: TIMELINE.aside, pose: pose({ x: 14, y: 6, scale: 0.56, tilt: -15, turn: -24 }), ease: ease.inOutCubic },
    { at: TIMELINE.background, pose: pose({ y: 12, z: -100, scale: 0.62, tilt: -12, opacity: 0.85 }), ease: ease.inOutCubic },
    { at: 4.4, pose: pose({ y: 12, scale: 0.52, tilt: -22, turn: -9, lid: -10 }), ease: ease.inOutCubic },
    { at: 4.75, pose: pose({ y: -5, scale: 0.48, tilt: -28, turn: -12, lid: -70 }), ease: ease.inOutCubic },
    { at: TIMELINE.closed, pose: pose({ y: -8, scale: 0.48, tilt: -30, turn: -14, lid: CLOSED }), ease: ease.outCubic },
  ],
  swing: { x: 12, turn: 16, lean: 4 },
};

/*
 * No celular os cards ocupam a largura toda e a capa (opaca) fica no topo do card,
 * então no recuo o notebook desce para trás da metade de vidro do card.
 */
const mobile: Choreography = {
  keyframes: [
    { at: TIMELINE.hero, pose: pose({ x: -4, y: -18, scale: 0.66, tilt: -15, turn: 16 }) },
    { at: TIMELINE.zoomed, pose: pose({ y: -7 }), ease: ease.inOutCubic },
    { at: TIMELINE.storyEnd, pose: pose({ y: -7 }), ease: ease.linear },
    { at: TIMELINE.aside, pose: pose({ x: 12, y: 8, scale: 0.62, tilt: -15, turn: -20 }), ease: ease.inOutCubic },
    { at: TIMELINE.background, pose: pose({ y: 10, z: -60, scale: 0.7, tilt: -12, opacity: 0.85 }), ease: ease.inOutCubic },
    { at: 4.4, pose: pose({ y: 14, scale: 0.6, tilt: -22, turn: -9, lid: -10 }), ease: ease.inOutCubic },
    { at: 4.75, pose: pose({ y: -4, scale: 0.56, tilt: -28, turn: -12, lid: -70 }), ease: ease.inOutCubic },
    { at: TIMELINE.closed, pose: pose({ y: -7, scale: 0.56, tilt: -30, turn: -14, lid: CLOSED }), ease: ease.outCubic },
  ],
  swing: { x: 10, turn: 14, lean: 3 },
};

export const CHOREOGRAPHY: Record<LayoutMode, Choreography> = { desktop, tablet, mobile };

/**
 * Versão para `prefers-reduced-motion`: mantém posição e tamanho (que só mudam
 * quando o próprio usuário rola), mas remove giros, inclinações, o vaivém da
 * fase de projetos e o fechamento da tampa (no final o notebook apenas some).
 */
export function toReducedMotion(choreo: Choreography): Choreography {
  return {
    keyframes: choreo.keyframes.map((k) => ({
      ...k,
      pose: {
        ...k.pose,
        turn: 0,
        roll: 0,
        tilt: -20,
        lid: OPEN,
        opacity: k.at > TIMELINE.background ? 0 : k.pose.opacity,
      },
    })),
    swing: { x: 0, turn: 0, lean: 0 },
  };
}

/** Interpola a pose para um `t` qualquer, aplicando a curva de cada trecho. */
export function samplePose(keyframes: readonly PoseKeyframe[], t: number): LaptopPose {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (t <= first.at) return first.pose;
  if (t >= last.at) return last.pose;

  let i = 1;
  while (i < keyframes.length - 1 && keyframes[i].at < t) i++;

  const from = keyframes[i - 1];
  const to = keyframes[i];
  const local = (to.ease ?? ease.inOutCubic)(clamp((t - from.at) / (to.at - from.at)));

  return {
    x: lerp(from.pose.x, to.pose.x, local),
    y: lerp(from.pose.y, to.pose.y, local),
    z: lerp(from.pose.z, to.pose.z, local),
    scale: lerp(from.pose.scale, to.pose.scale, local),
    tilt: lerp(from.pose.tilt, to.pose.tilt, local),
    turn: lerp(from.pose.turn, to.pose.turn, local),
    roll: lerp(from.pose.roll, to.pose.roll, local),
    lid: lerp(from.pose.lid, to.pose.lid, local),
    opacity: lerp(from.pose.opacity, to.pose.opacity, local),
  };
}

/**
 * Peso do vaivém da Fase 3: entra durante o recuo (t 3.35 → 4) e sai quando o
 * contato começa a entrar (t 4 → 4.45). Fora disso o notebook ignora o spring.
 */
export const swingWeight = (t: number) =>
  smoothstep(3.35, TIMELINE.background, t) * (1 - smoothstep(4.02, 4.45, t));

/**
 * Pose final do frame: keyframes + vaivém da fase de projetos.
 * `side` vem de um spring entre -1 (esquerda) e +1 (direita);
 * `sideVelocity` inclina o notebook na direção do movimento.
 */
export function composePose(
  choreo: Choreography,
  t: number,
  side: number,
  sideVelocity: number,
): LaptopPose {
  const base = samplePose(choreo.keyframes, t);
  const weight = swingWeight(t);
  if (weight === 0) return base;

  const { x, turn, lean } = choreo.swing;
  return {
    ...base,
    x: base.x + weight * side * x,
    // Do lado direito ele gira para a esquerda (olhando para o centro) e vice-versa.
    turn: base.turn - weight * side * turn,
    roll: base.roll + weight * clamp(-sideVelocity * lean * 0.35, -lean, lean),
  };
}

/** Janelas de `t` usadas pelos elementos que acompanham o notebook. */
export const SCREEN_TIMELINE = {
  /** Pontos da senha preenchendo durante o zoom. */
  unlock: [0.05, 0.8],
  /** Momento em que o cadeado vira "desbloqueado". */
  unlocked: 0.86,
  storyOut: [2.12, 2.48],
  projectsIn: [2.3, 2.7],
  chapterIndexIn: [0.8, 1],
  chapterIndexOut: [1.98, 2.18],
  /** A tela apaga enquanto a tampa fecha. */
  powerOff: [4.6, 4.95],
} as const;

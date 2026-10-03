"use client";

import { LockSimple } from "@phosphor-icons/react/dist/ssr/LockSimple";
import { LockSimpleOpen } from "@phosphor-icons/react/dist/ssr/LockSimpleOpen";
import { motion, useTransform } from "motion/react";
import Image from "next/image";
import type { Photo } from "@/content/profile";
import { useNow } from "@/hooks/use-now";
import { SCREEN_TIMELINE } from "@/components/story/choreography";
import { useStory } from "@/components/story/story-context";
import { useMotionState } from "@/hooks/use-motion-state";
import styles from "./screen.module.css";

const DOTS = 8;
const [unlockStart, unlockEnd] = SCREEN_TIMELINE.unlock;
const dotStep = (unlockEnd - unlockStart) / DOTS;

const dateFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });
const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Cada ponto da "senha" acende num trecho do zoom: rolar = digitar. */
function PasswordDot({ index }: { index: number }) {
  const { t } = useStory();
  const range = [unlockStart + index * dotStep, unlockStart + (index + 1) * dotStep];
  const opacity = useTransform(t, range, [0.18, 1]);
  const scale = useTransform(t, range, [0.55, 1]);
  return <motion.span className={styles.passwordDot} style={{ opacity, scale }} />;
}

interface LockScreenProps {
  name: string;
  portrait: Photo;
  active: boolean;
}

/**
 * Primeira "página" da tela: a tela de bloqueio com a foto e o nome.
 * Durante o zoom (t 0 → 1) a senha se preenche e o cadeado abre,
 * desbloqueando a história.
 */
export function LockScreen({ name, portrait, active }: LockScreenProps) {
  const { t } = useStory();
  const unlocked = useMotionState(t, (v) => v >= SCREEN_TIMELINE.unlocked);
  const now = useNow();

  return (
    <section className={`${styles.panel} ${styles.lock}`} data-active={active} aria-label="Tela de bloqueio">
      <div className={styles.lockClock} aria-hidden>
        <p className={styles.lockDate}>{now ? dateFormat.format(now) : " "}</p>
        <p className={styles.lockTime}>{now ? timeFormat.format(now) : " "}</p>
      </div>

      <div className={styles.lockUser}>
        <div className={styles.avatar}>
          <Image
            src={portrait.src}
            alt=""
            fill
            sizes="96px"
            priority
            className="origin-[48%_36%] scale-[1.45] object-cover"
            style={{ objectPosition: "50% 26%" }}
          />
        </div>
        <p className={styles.lockName}>{name}</p>
        <div className={styles.password} aria-hidden>
          <span className={styles.passwordDots}>
            {Array.from({ length: DOTS }, (_, i) => (
              <PasswordDot key={i} index={i} />
            ))}
          </span>
          <span className={styles.lockGlyph}>
            <LockSimple weight="bold" style={{ opacity: unlocked ? 0 : 0.8, transition: "opacity 300ms" }} />
            <LockSimpleOpen
              weight="bold"
              style={{ opacity: unlocked ? 1 : 0, color: "var(--screen-accent)", transition: "opacity 300ms" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

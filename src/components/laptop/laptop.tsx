"use client";

import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { Keyboard } from "./keyboard";
import styles from "./laptop.module.css";

interface LaptopProps {
  /** translate3d + scale: posição e tamanho no palco. */
  rigTransform: MotionValue<string>;
  /** rotateX/Y/Z: inclinação da câmera e giro no "prato". */
  bodyTransform: MotionValue<string>;
  /** rotateX na dobradiça: abre/fecha a tampa. */
  lidTransform: MotionValue<string>;
  /** Conteúdo renderizado dentro da tela (DOM real, nítido e acessível). */
  screen: ReactNode;
  /** Letra gravada na tampa traseira. */
  monogram?: string;
}

/**
 * Notebook construído com DOM + CSS 3D. Componente puramente visual:
 * quem decide a pose é o `LaptopRig`, via MotionValues (sem re-render no scroll).
 */
export function Laptop({ rigTransform, bodyTransform, lidTransform, screen, monogram = "G" }: LaptopProps) {
  return (
    <motion.div className={styles.rig} style={{ transform: rigTransform }}>
      <motion.div className={styles.body} style={{ transform: bodyTransform }}>
        <motion.div className={styles.lid} style={{ transform: lidTransform }}>
          <div className={styles.lidFront}>
            <div className={styles.screen}>{screen}</div>
            <div className={styles.notch} aria-hidden>
              <span className={styles.camera} />
            </div>
            <div className={styles.chin} aria-hidden />
          </div>
          <div className={styles.lidBack} aria-hidden>
            <span className={styles.monogram}>{monogram}</span>
          </div>
          <div className={`${styles.lidEdge} ${styles.lidEdgeTop}`} aria-hidden />
          <div className={`${styles.lidEdge} ${styles.lidEdgeLeft}`} aria-hidden />
          <div className={`${styles.lidEdge} ${styles.lidEdgeRight}`} aria-hidden />
        </motion.div>

        <div className={styles.base} aria-hidden>
          <div className={styles.shadow} />
          <div className={styles.deck}>
            <div className={styles.screenSpill} />
            <span className={`${styles.speaker} ${styles.speakerLeft}`} />
            <span className={`${styles.speaker} ${styles.speakerRight}`} />
            <Keyboard />
            <div className={styles.trackpad} />
            <div className={styles.thumbNotch} />
          </div>
          <div className={styles.hinge} />
          <div className={`${styles.baseEdge} ${styles.baseFront}`} />
          <div className={`${styles.baseEdge} ${styles.baseLeft}`} />
          <div className={`${styles.baseEdge} ${styles.baseRight}`} />
        </div>
      </motion.div>
    </motion.div>
  );
}

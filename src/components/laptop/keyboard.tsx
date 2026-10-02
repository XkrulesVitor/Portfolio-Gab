import type { CSSProperties } from "react";
import styles from "./laptop.module.css";

/**
 * Teclado ANSI estilizado. Cada número é a largura relativa da tecla
 * (todas as fileiras somam 14.5 unidades). Puramente decorativo.
 */
const ROWS: number[][] = [
  [1.5, ...Array<number>(12).fill(1), 1],
  [...Array<number>(13).fill(1), 1.5],
  [1.5, ...Array<number>(13).fill(1)],
  [1.8, ...Array<number>(11).fill(1), 1.7],
  [2.3, ...Array<number>(10).fill(1), 2.2],
];

const BOTTOM_ROW = [1, 1, 1, 1.25, 5, 1.25, 1];

const keyStyle = (width: number) => ({ "--w": width }) as CSSProperties;

export function Keyboard() {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, r) => (
        <div key={r} className={r === 0 ? `${styles.row} ${styles.rowFn}` : styles.row}>
          {row.map((width, k) => (
            <span key={k} className={styles.key} style={keyStyle(width)} />
          ))}
        </div>
      ))}
      <div className={styles.row}>
        {BOTTOM_ROW.map((width, k) => (
          <span key={k} className={styles.key} style={keyStyle(width)} />
        ))}
        <span className={styles.arrows}>
          <span className={styles.key} />
          <span className={styles.key} />
          <span className={styles.key} />
          <span className={styles.key} />
        </span>
      </div>
    </div>
  );
}

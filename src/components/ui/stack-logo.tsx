import type { CSSProperties } from "react";
import {
  siC,
  siCplusplus,
  siDbeaver,
  siHtml5,
  siJavascript,
  siOpenjdk,
  siPython,
  siReact,
  siTotvs,
  siVite,
} from "simple-icons";
import type { StackIcon } from "@/content/profile";

/** Logos oficiais (Simple Icons). Em repouso são monocromáticos. */
const ICONS: Record<StackIcon, { path: string }> = {
  react: siReact,
  vite: siVite,
  javascript: siJavascript,
  html5: siHtml5,
  c: siC,
  cplusplus: siCplusplus,
  openjdk: siOpenjdk,
  python: siPython,
  dbeaver: siDbeaver,
  totvs: siTotvs,
};

/**
 * Cores do hover. Partem das cores de marca, clareadas quando a original some
 * sobre a tela escura (DBeaver, OpenJDK, TOTVS). `icon` = segunda cor do logo.
 */
const BRANDS: Record<StackIcon, { color: string; icon?: string }> = {
  react: { color: "#61dafb" },
  vite: { color: "#bd34fe" },
  javascript: { color: "#f7df1e" },
  html5: { color: "#e34f26" },
  c: { color: "#a8b9cc" },
  cplusplus: { color: "#659ad2" },
  openjdk: { color: "#f89820" },
  python: { color: "#4b8bbe", icon: "#ffd43b" },
  dbeaver: { color: "#c49a6c" },
  totvs: { color: "#b9a6ff" },
};

/** Variáveis CSS consumidas pelo `.chip` (screen.module.css). */
export const brandStyle = (icon: StackIcon) =>
  ({ "--brand": BRANDS[icon].color, "--brand-icon": BRANDS[icon].icon ?? BRANDS[icon].color }) as CSSProperties;

export function StackLogo({ icon, className }: { icon: StackIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} focusable="false">
      <path d={ICONS[icon].path} />
    </svg>
  );
}

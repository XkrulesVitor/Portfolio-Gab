import { siCplusplus, siDbeaver, siOpenjdk, siPython, siReact, siTotvs, siVite } from "simple-icons";
import type { StackIcon } from "@/content/profile";

/** Logos oficiais (Simple Icons), sempre monocromáticos para respeitar a paleta. */
const ICONS: Record<StackIcon, { path: string; title: string }> = {
  totvs: siTotvs,
  dbeaver: siDbeaver,
  openjdk: siOpenjdk,
  cplusplus: siCplusplus,
  python: siPython,
  react: siReact,
  vite: siVite,
};

export function StackLogo({ icon, className }: { icon: StackIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} focusable="false">
      <path d={ICONS[icon].path} />
    </svg>
  );
}

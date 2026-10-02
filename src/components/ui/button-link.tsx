import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "inverted";
  /** Abre em nova aba com rel seguro. */
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const VARIANTS = {
  primary: "bg-accent text-accent-fg hover:brightness-[1.08]",
  ghost: "border border-line text-fg hover:bg-fg/[0.06]",
  inverted: "bg-fg text-bg hover:bg-fg/85",
} as const;

/**
 * Botões em pílula (regra de forma do site: botões e chips = pill,
 * cards = 22px, mídia dentro de cards = 14px).
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  icon,
  className = "",
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,filter,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
    >
      {icon}
      {children}
    </a>
  );
}

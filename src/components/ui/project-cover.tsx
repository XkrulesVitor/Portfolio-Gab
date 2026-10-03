import Image from "next/image";
import type { CSSProperties } from "react";
import { toneColors, type Project } from "@/content/projects";

interface ProjectCoverProps {
  project: Project;
  sizes: string;
  /**
   * "screen": capa provisória com o título (a tela do notebook não tem outro texto).
   * "card": só a inicial, porque o título já aparece logo abaixo no card.
   */
  variant?: "screen" | "card";
  className?: string;
  priority?: boolean;
}

/** Inicial do título, usada como monograma da capa provisória. */
const initialOf = (title: string) => title.trim().charAt(0).toUpperCase();

/**
 * Capa do projeto: o print real quando existir; senão, uma capa tipográfica
 * provisória com a cor de apoio do projeto (estado "sem imagem").
 * Ocupa 100% do pai, que define a proporção.
 */
export function ProjectCover({ project, sizes, variant = "screen", className = "", priority }: ProjectCoverProps) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt ?? `Tela do projeto ${project.title}`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  const tone = toneColors[project.tone];
  const style = {
    "--tone-base": tone.base,
    "--tone-glow": tone.glow,
    "--tone-ink": tone.ink,
    background: [
      "radial-gradient(80% 90% at 88% 0%, color-mix(in oklab, var(--tone-glow) 55%, transparent), transparent 62%)",
      "radial-gradient(70% 70% at 0% 100%, color-mix(in oklab, var(--tone-glow) 28%, transparent), transparent 70%)",
      "linear-gradient(160deg, color-mix(in oklab, var(--tone-base) 85%, white 6%), var(--tone-base))",
    ].join(", "),
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={`Capa provisória do projeto ${project.title}`}
      className={`absolute inset-0 text-[var(--tone-ink)] [container-type:inline-size] ${className}`}
      style={style}
    >
      {/* O padding fica no filho: cqi no próprio container mediria o ancestral. */}
      <div className="flex h-full flex-col justify-end p-[7cqi]">
        {variant === "card" ? (
          <span
            aria-hidden
            className="absolute right-[6cqi] top-[2cqi] text-[34cqi] font-semibold leading-none tracking-[-0.08em] opacity-[0.14]"
          >
            {initialOf(project.title)}
          </span>
        ) : null}
        <span className="font-mono text-[max(9px,2.6cqi)] uppercase tracking-[0.14em] opacity-70">
          {project.tags.join(" / ")}
        </span>
        {variant === "screen" ? (
          <span className="mt-[2cqi] max-w-[14ch] text-[max(18px,9cqi)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
            {project.title}
          </span>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";
import type { Project } from "@/content/projects";
import { ProjectCover } from "@/components/ui/project-cover";

interface ProjectCardProps {
  project: Project;
}

/** Atualiza o centro do spotlight direto no DOM (sem estado React). */
function trackPointer(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

/**
 * Card de projeto em vidro (inspirado no linear.app): fundo translúcido com
 * backdrop-blur, borda de 1px, brilho interno no topo e spotlight que segue o
 * cursor. O notebook, ao fundo, aparece desfocado através dele.
 *
 * Entrada e saída são ligadas ao scroll do próprio card (sem timers).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0, 1, 1, 0.25]);
  const y = useTransform(scrollYProgress, [0, 0.3], [96, 0]);
  const scale = useTransform(scrollYProgress, [0.72, 1], [1, 0.95]);
  const { live, repo } = project.links ?? {};

  return (
    <motion.article
      ref={ref}
      style={{ opacity, y, scale }}
      onPointerMove={trackPointer}
      aria-labelledby={`${project.slug}-title`}
      // A largura também é limitada pela altura da viewport, para o card inteiro caber em telas baixas.
      className="glass spotlight group pointer-events-auto w-full rounded-[22px] p-2.5 md:p-3 split:w-[min(46vw,40rem,calc((100svh-354px)*1.6+24px))]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] shadow-[0_0_0_1px_var(--line)]">
        <ProjectCover
          project={project}
          variant="card"
          sizes="(min-width: 768px) 46vw, 92vw"
          className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02]"
        />
      </div>

      <div className="px-2.5 pb-2.5 pt-5 md:px-3 md:pb-3 md:pt-6">
        <div className="flex items-baseline justify-between gap-4 text-sm text-fg-muted">
          <span>{project.context}</span>
          <span className="font-mono text-xs tabular-nums">{project.year}</span>
        </div>

        <h3
          id={`${project.slug}-title`}
          className="mt-2.5 text-[clamp(1.375rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.035em]"
        >
          {project.title}
        </h3>
        <p className="mt-2 max-w-[48ch] leading-relaxed text-fg-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologias">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line bg-fg/[0.03] px-2.5 py-1 text-xs font-medium text-fg-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          {live || repo ? (
            <div className="flex items-center gap-4 text-sm font-medium">
              {repo ? (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
                >
                  <GithubLogo className="size-4" weight="fill" aria-hidden />
                  Código
                </a>
              ) : null}
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-fg transition-opacity hover:opacity-75"
                >
                  Ver projeto
                  <ArrowUpRight className="size-4" weight="bold" aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

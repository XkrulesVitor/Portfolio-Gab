import type { StaticImageData } from "next/image";

/**
 * PROJETOS - CONTEÚDO DE EXEMPLO
 * --------------------------------------------------------------------------
 * Os quatro projetos abaixo são marcadores de lugar para validar o layout.
 * Substitua título, descrição, tags e links pelos projetos reais da Gabriela.
 *
 * Imagens: salve os prints em `src/assets/projects/` e importe-os aqui
 * (ex.: `import painel from "@/assets/projects/painel.png"`), depois use
 * `image: painel`. Sem imagem, o card e a tela do notebook exibem uma capa
 * tipográfica gerada a partir do título e do `tone`.
 *
 * Proporção ideal dos prints: 16:10 (ex.: 1600 x 1000), igual à tela do notebook.
 */

export type ProjectTone = "olive" | "sand" | "slate" | "clay";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Contexto curto exibido no card: "Acadêmico", "Pessoal", "Trabalho"... */
  context: string;
  year: string;
  image?: StaticImageData | string;
  imageAlt?: string;
  links?: { live?: string; repo?: string };
  /** Cor de apoio da capa provisória e da luz ambiente atrás do notebook. */
  tone: ProjectTone;
}

export const projects: Project[] = [
  {
    slug: "painel-de-indicadores",
    title: "Painel de indicadores",
    summary:
      "Dashboard em React e Vite para acompanhar indicadores a partir de dados exportados do ERP.",
    tags: ["React", "Vite"],
    context: "Pessoal",
    year: "2026",
    tone: "olive",
  },
  {
    slug: "consultas-protheus",
    title: "Consultas Protheus",
    summary:
      "Coleção de consultas e relatórios usados no suporte ao ERP Protheus, organizada no DBeaver.",
    tags: ["ERP Protheus", "DBeaver"],
    context: "Trabalho",
    year: "2025",
    tone: "sand",
  },
  {
    slug: "automacao-de-planilhas",
    title: "Automação de planilhas",
    summary: "Scripts em Python para limpar, cruzar e consolidar planilhas operacionais.",
    tags: ["Python"],
    context: "Pessoal",
    year: "2025",
    tone: "slate",
  },
  {
    slug: "sistema-academico",
    title: "Sistema acadêmico",
    summary: "Projeto da graduação em Java com cadastro de alunos, disciplinas e notas.",
    tags: ["Java"],
    context: "Acadêmico",
    year: "2024",
    tone: "clay",
  },
];

/** Cores das capas provisórias e da luz ambiente (todas dessaturadas). */
export const toneColors: Record<ProjectTone, { base: string; glow: string; ink: string }> = {
  olive: { base: "#2b3018", glow: "#8f9d58", ink: "#e7ecd2" },
  sand: { base: "#352b1e", glow: "#c3a67a", ink: "#f1e6d4" },
  slate: { base: "#1f262e", glow: "#7f8fa0", ink: "#dfe6ee" },
  clay: { base: "#33221b", glow: "#b67f64", ink: "#f2dfd6" },
};

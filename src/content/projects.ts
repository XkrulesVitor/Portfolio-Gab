import type { StaticImageData } from "next/image";

/**
 * PROJETOS
 * --------------------------------------------------------------------------
 * Projetos reais do GitHub da Gabriela (github.com/gabicpp).
 *
 * Imagens: salve os prints em `src/assets/projects/` e importe-os aqui
 * (ex.: `import astro from "@/assets/projects/astrocalendario.png"`), depois
 * use `image: astro`. Sem imagem, o card e a tela do notebook exibem uma capa
 * tipográfica provisória gerada a partir do título e do `tone`.
 *
 * Proporção ideal dos prints: 16:10 (ex.: 1600 x 1000), igual à tela do notebook.
 */

export type ProjectTone = "violet" | "indigo" | "rose" | "slate";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Tipo de projeto, exibido no topo do card. */
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
    slug: "astrocalendario",
    title: "AstroCalendário",
    summary:
      "Explorador da foto astronômica do dia da NASA: escolha uma data no calendário e veja a imagem com título e descrição oficiais.",
    tags: ["React", "Vite", "React Router", "API da NASA"],
    context: "Aplicação web, em dupla",
    year: "2026",
    links: { repo: "https://github.com/gabicpp/nasa" },
    tone: "indigo",
  },
  {
    slug: "pokedex",
    title: "Pokédex",
    summary:
      "Catálogo de Pokémon com dados da PokéAPI, busca por nome, página de detalhes e estados de carregamento e erro.",
    tags: ["React", "Vite", "React Router", "PokéAPI"],
    context: "Aplicação web",
    year: "2026",
    links: { repo: "https://github.com/gabicpp/pokedex" },
    tone: "violet",
  },
  {
    slug: "curriculo-html-css",
    title: "Currículo em HTML e CSS",
    summary:
      "Página de currículo feita do zero, com layout em duas colunas, barras de habilidade e seções de formação, experiência e projetos.",
    tags: ["HTML", "CSS"],
    context: "Página web",
    year: "2025",
    links: { repo: "https://github.com/gabicpp/Trabalho-3" },
    tone: "rose",
  },
  {
    slug: "strings-em-c",
    title: "Strings em C",
    summary:
      "Onze exercícios de manipulação de strings: concatenação, maiúsculas e minúsculas, remoção de espaços, troca de caracteres e divisão em palavras.",
    tags: ["C"],
    context: "Algoritmos",
    year: "2024",
    links: { repo: "https://github.com/gabicpp/strings" },
    tone: "slate",
  },
];

/** Cores das capas provisórias e da luz ambiente (família do roxo, dessaturada). */
export const toneColors: Record<ProjectTone, { base: string; glow: string; ink: string }> = {
  violet: { base: "#221a3d", glow: "#8b6cff", ink: "#ece7ff" },
  indigo: { base: "#161b3a", glow: "#6a78ff", ink: "#e2e5ff" },
  rose: { base: "#2f1829", glow: "#d07ab6", ink: "#f7e4f0" },
  slate: { base: "#1b2129", glow: "#7d8ea2", ink: "#e0e6ee" },
};

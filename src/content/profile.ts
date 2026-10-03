import type { StaticImageData } from "next/image";
import portrait from "@/assets/images/gabriela.jpg";

/**
 * Conteúdo pessoal da Gabriela.
 * Todos os textos visíveis do site saem daqui: editar a história, a trajetória
 * ou a stack não exige mexer em nenhum componente.
 */

export type StoryChapterId = "sobre" | "trajetoria" | "formacao" | "stack";

export interface StoryChapter {
  id: StoryChapterId;
  /** Nome curto usado no índice lateral e na barra de menus da tela. */
  label: string;
}

export interface Milestone {
  year: string;
  title: string;
  detail: string;
}

export type StackIcon =
  | "react"
  | "vite"
  | "javascript"
  | "html5"
  | "c"
  | "cplusplus"
  | "openjdk"
  | "python"
  | "dbeaver"
  | "totvs";

export interface StackItem {
  name: string;
  /** Logo do Simple Icons, quando a marca existe lá. */
  icon?: StackIcon;
}

export interface StackGroup {
  label: string;
  items: StackItem[];
}

export interface Photo {
  src: StaticImageData;
  alt: string;
  /** Ajuste fino do enquadramento (CSS object-position). */
  focus?: string;
}

export interface Profile {
  name: string;
  firstName: string;
  linkedin: string;
  /** Rótulo único para a intenção "contato" em todo o site. */
  linkedinLabel: string;
  hero: { lead: string };
  portrait: Photo;
  chapters: StoryChapter[];
  about: { title: string; body: string; location: string };
  journey: { title: string; milestones: Milestone[] };
  education: { title: string; org: string; startYear: number; endYear: number; note: string };
  stack: { title: string; groups: StackGroup[] };
  projectsIntro: { title: string; body: string };
  contact: { title: string; body: string };
}

export const profile: Profile = {
  name: "Gabriela Castro Pereira",
  firstName: "Gabriela",
  linkedin: "https://www.linkedin.com/in/gabriela-pereira-a455a5325/",
  linkedinLabel: "Conectar no LinkedIn",

  hero: {
    // Máximo de ~20 palavras: o hero precisa caber inteiro na primeira dobra.
    lead: "Estudante de Sistemas de Informação e analista de serviços na TOTVS, com foco em desenvolvimento e UI/UX.",
  },

  portrait: {
    src: portrait,
    alt: "Retrato de Gabriela Castro Pereira, de óculos e cardigã verde-oliva",
    focus: "50% 32%",
  },

  chapters: [
    { id: "sobre", label: "Sobre" },
    { id: "trajetoria", label: "Trajetória" },
    { id: "formacao", label: "Formação" },
    { id: "stack", label: "Stack" },
  ],

  about: {
    title: "Olá, eu sou a Gabriela.",
    body: "Estudo Sistemas de Informação na UNIVÁS e sou analista de serviços na TOTVS. Gosto de criar interfaces claras e fáceis de usar, com foco em desenvolvimento e UI/UX.",
    location: "Pouso Alegre, MG",
  },

  journey: {
    title: "Minha trajetória até aqui.",
    milestones: [
      { year: "2023", title: "Auxiliar administrativo", detail: "UNIVÁS, de abr. 2023 a jan. 2025" },
      { year: "2024", title: "Sistemas de Informação", detail: "Início da graduação na UNIVÁS" },
      { year: "2025", title: "Analista de serviços", detail: "TOTVS Sudeste Meridional, desde abr. 2025" },
    ],
  },

  education: {
    title: "Sistemas de Informação.",
    org: "Universidade do Vale do Sapucaí (UNIVÁS)",
    startYear: 2024,
    endYear: 2027,
    note: "Graduação em andamento, com conclusão prevista para 2027.",
  },

  stack: {
    title: "Com o que eu trabalho.",
    groups: [
      {
        label: "Front-end",
        items: [
          { name: "React", icon: "react" },
          { name: "Vite", icon: "vite" },
          { name: "JavaScript", icon: "javascript" },
          { name: "HTML e CSS", icon: "html5" },
        ],
      },
      {
        label: "Linguagens",
        items: [
          { name: "C", icon: "c" },
          { name: "C++", icon: "cplusplus" },
          { name: "Java", icon: "openjdk" },
          { name: "Python", icon: "python" },
        ],
      },
      {
        label: "Ferramentas",
        items: [
          { name: "DBeaver", icon: "dbeaver" },
          { name: "ERP Protheus", icon: "totvs" },
        ],
      },
    ],
  },

  projectsIntro: {
    title: "Projetos",
    body: "Alguns projetos que construí estudando desenvolvimento, do C ao React.",
  },

  contact: {
    title: "Vamos conversar?",
    body: "O jeito mais rápido de falar comigo é pelo LinkedIn.",
  },
};

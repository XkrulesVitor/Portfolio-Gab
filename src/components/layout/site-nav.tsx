import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";

interface SiteNavProps {
  name: string;
  linkedin: string;
  linkedinLabel: string;
}

const LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
];

/** Navegação flutuante em vidro. Componente de servidor: não precisa de JS. */
export function SiteNav({ name, linkedin, linkedinLabel }: SiteNavProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 flex justify-center px-3 pt-3" style={{ zIndex: "var(--z-nav)" }}>
      <nav
        aria-label="Principal"
        className="glass pointer-events-auto flex h-12 w-full max-w-[56rem] items-center justify-between gap-4 rounded-full pl-5 pr-1.5"
      >
        <a href="#top" className="truncate text-[0.9375rem] font-semibold tracking-[-0.02em]">
          {name}
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center sm:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-fg-muted transition-colors duration-300 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkedinLabel}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-3 text-sm font-medium text-bg transition-[background-color,transform] duration-300 hover:bg-fg/85 active:scale-[0.98] lg:px-4"
          >
            <LinkedinLogo weight="fill" className="size-[18px]" aria-hidden />
            <span className="hidden lg:inline">{linkedinLabel}</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

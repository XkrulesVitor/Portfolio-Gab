import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";

interface SiteFooterProps {
  name: string;
  linkedin: string;
  linkedinLabel: string;
}

export function SiteFooter({ name, linkedin, linkedinLabel }: SiteFooterProps) {
  return (
    <footer className="relative border-t border-line bg-bg">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-8 text-sm text-fg-muted md:px-10">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={linkedinLabel}
          className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg transition-colors duration-300 hover:bg-fg/[0.06]"
        >
          <LinkedinLogo weight="fill" className="size-[18px]" aria-hidden />
        </a>
      </div>
    </footer>
  );
}

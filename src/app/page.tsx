import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { ScrollStory } from "@/components/story/scroll-story";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

/**
 * Página única. O conteúdo vem de `src/content/*`; o servidor só monta a
 * estrutura e entrega os dados para a ilha interativa (`ScrollStory`).
 */
export default function Home() {
  return (
    <>
      <SiteNav name={profile.name} linkedin={profile.linkedin} linkedinLabel={profile.linkedinLabel} />
      {/* overflow-x: clip corta o notebook nas bordas sem criar um container de scroll (o sticky continua funcionando). */}
      <main id="top" className="overflow-x-clip">
        <ScrollStory profile={profile} projects={projects} />
      </main>
      <SiteFooter name={profile.name} linkedin={profile.linkedin} linkedinLabel={profile.linkedinLabel} />
      <div className="grain" aria-hidden />
    </>
  );
}

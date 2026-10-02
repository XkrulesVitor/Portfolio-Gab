"use client";

import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { motion, useTransform } from "motion/react";
import type { Ref } from "react";
import type { Profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/button-link";
import { useStory } from "@/components/story/story-context";
import { TIMELINE } from "@/components/story/choreography";
import { useMotionState } from "@/hooks/use-motion-state";
import { clamp } from "@/lib/motion-math";

interface ContactProps {
  ref: Ref<HTMLElement>;
  profile: Profile;
}

/**
 * Final. Enquanto esta seção sobe (t 4 → 5), o conteúdo é contra-transladado
 * pelo mesmo tanto que a seção andou: na tela ele parece fixo na posição final,
 * no terço de cima. Assim o notebook, que desce para o centro e fecha a tampa,
 * nunca cruza com o texto. O DOM continua no fluxo normal (ordem de leitura e
 * âncora #contato preservadas).
 */
export function Contact({ ref, profile }: ContactProps) {
  const { t } = useStory();

  const transform = useTransform(t, (v) => {
    const remaining = 1 - clamp(v - TIMELINE.background);
    const entrance = 40 * (1 - clamp((v - 4.5) / 0.35));
    return `translateY(calc(${(-remaining * 100).toFixed(3)}svh + ${entrance.toFixed(1)}px))`;
  });
  // Aparece só depois que o último card saiu e a tampa está quase fechada.
  const opacity = useTransform(t, [4.58, 4.85], [0, 1]);
  const interactive = useMotionState(t, (v) => v > 4.7);

  return (
    <section ref={ref} id="contato" aria-labelledby="contato-title" className="relative h-svh">
      <motion.div
        style={{ transform, opacity }}
        className="mx-auto flex h-full max-w-[1440px] flex-col items-center px-5 pt-[13svh] text-center md:px-10"
      >
        <h2
          id="contato-title"
          className="text-[clamp(2.5rem,5.6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
        >
          {profile.contact.title}
        </h2>
        <p className="mt-5 max-w-[42ch] text-[clamp(1rem,1.25vw,1.1875rem)] leading-relaxed text-fg-muted">
          {profile.contact.body}
        </p>
        <ButtonLink
          href={profile.linkedin}
          external
          className={`mt-8 ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
          icon={<LinkedinLogo weight="fill" className="size-[18px]" aria-hidden />}
        >
          {profile.linkedinLabel}
        </ButtonLink>
      </motion.div>
    </section>
  );
}

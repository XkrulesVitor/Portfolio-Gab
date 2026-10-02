"use client";

import { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { motion, useTransform, type Variants } from "motion/react";
import type { Ref } from "react";
import type { Profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/button-link";
import { useStory } from "@/components/story/story-context";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

interface HeroIntroProps {
  ref: Ref<HTMLElement>;
  profile: Profile;
}

/**
 * Fase 0. Texto do hero no primeiro plano; o notebook (no palco sticky atrás)
 * está na diagonal à esquerda. Ao rolar, o texto sobe e some enquanto o
 * notebook dá o zoom.
 */
export function HeroIntro({ ref, profile }: HeroIntroProps) {
  const { t } = useStory();
  const opacity = useTransform(t, [0, 0.36], [1, 0]);
  const y = useTransform(t, [0, 0.5], [0, -70]);

  return (
    <section ref={ref} id="inicio" className="relative h-svh">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-[max(2rem,6svh)] md:px-10 md:pb-[9svh] split:justify-center split:pb-0"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pointer-events-auto split:ml-auto split:w-[41%] split:max-w-[38rem]"
        >
          <motion.h1
            variants={item}
            className="text-[clamp(2.5rem,5.4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance"
          >
            {profile.name}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-5 max-w-[36ch] text-[clamp(1rem,1.25vw,1.1875rem)] leading-relaxed text-fg-muted md:mt-6"
          >
            {profile.hero.lead}
          </motion.p>
          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3 md:mt-9">
            <ButtonLink href="#projetos" icon={<ArrowDown weight="bold" className="size-4" aria-hidden />}>
              Ver projetos
            </ButtonLink>
            <ButtonLink
              href={profile.linkedin}
              external
              variant="ghost"
              icon={<LinkedinLogo weight="fill" className="size-[18px]" aria-hidden />}
            >
              {profile.linkedinLabel}
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

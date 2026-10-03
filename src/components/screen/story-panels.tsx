"use client";

import { GraduationCap } from "@phosphor-icons/react/dist/ssr/GraduationCap";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Profile } from "@/content/profile";
import { useNow } from "@/hooks/use-now";
import { brandStyle, StackLogo } from "@/components/ui/stack-logo";
import styles from "./screen.module.css";

/** Ordem de entrada (stagger) de cada elemento quando o capítulo assenta. */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

interface PanelProps {
  id: string;
  active: boolean;
  children: ReactNode;
}

function Panel({ id, active, children }: PanelProps) {
  return (
    <section className={styles.panel} data-active={active} aria-labelledby={`${id}-title`}>
      <div className={styles.panelInner}>{children}</div>
    </section>
  );
}

export function AboutPanel({ profile, active }: { profile: Profile; active: boolean }) {
  const { about, portrait } = profile;
  return (
    <Panel id="sobre" active={active}>
      <div className={styles.about}>
        <figure className={`${styles.photo} ${styles.reveal}`} style={order(0)}>
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            sizes="(min-width: 1024px) 440px, 36vw"
            loading="eager"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: portrait.focus }}
          />
        </figure>
        <div>
          <h2 id="sobre-title" className={`${styles.title} ${styles.reveal}`} style={order(1)}>
            {about.title}
          </h2>
          <p className={`${styles.body} ${styles.reveal}`} style={order(2)}>
            {about.body}
          </p>
          <p className={`${styles.meta} ${styles.metaRow} ${styles.reveal}`} style={order(3)}>
            <MapPin className={styles.icon} weight="regular" aria-hidden />
            {about.location}
          </p>
        </div>
      </div>
    </Panel>
  );
}

export function JourneyPanel({ profile, active }: { profile: Profile; active: boolean }) {
  const { journey } = profile;
  const last = journey.milestones.length - 1;
  return (
    <Panel id="trajetoria" active={active}>
      <h2 id="trajetoria-title" className={`${styles.title} ${styles.reveal}`} style={order(0)}>
        {journey.title}
      </h2>
      <ol className={styles.timeline}>
        {journey.milestones.map((item, i) => (
          <li
            key={item.year + item.title}
            className={`${styles.milestone} ${styles.reveal}`}
            data-current={i === last}
            style={order(i + 1)}
          >
            <span className={styles.milestoneNode} aria-hidden />
            <span className={styles.year}>{item.year}</span>
            <p className={styles.milestoneTitle}>{item.title}</p>
            <p className={`${styles.meta} ${styles.milestoneDetail}`}>{item.detail}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function EducationPanel({ profile, active }: { profile: Profile; active: boolean }) {
  const { education } = profile;
  const now = useNow();
  const currentYear = now?.getFullYear();
  const years = Array.from(
    { length: education.endYear - education.startYear + 1 },
    (_, i) => education.startYear + i,
  );

  const stateOf = (year: number) => {
    if (currentYear === undefined) return "past";
    if (year === currentYear) return "current";
    return year < currentYear ? "past" : "future";
  };

  const captionOf = (year: number) => {
    if (year === currentYear) return "agora";
    if (year === education.startYear) return "início";
    if (year === education.endYear) return "conclusão";
    return "";
  };

  return (
    <Panel id="formacao" active={active}>
      <GraduationCap className={`${styles.educationIcon} ${styles.reveal}`} style={order(0)} aria-hidden />
      <h2 id="formacao-title" className={`${styles.title} ${styles.reveal}`} style={order(1)}>
        {education.title}
      </h2>
      <p className={`${styles.body} ${styles.reveal}`} style={order(2)}>
        {education.org}
      </p>
      <ol
        className={`${styles.years} ${styles.reveal}`}
        style={{ ...order(3), "--count": years.length } as CSSProperties}
        aria-label={`Graduação de ${education.startYear} a ${education.endYear}`}
      >
        {years.map((year) => (
          <li key={year} className={styles.yearCell} data-state={stateOf(year)}>
            <span className={styles.year}>{year}</span>
            <p className={`${styles.meta} ${styles.yearCaption}`}>{captionOf(year) || " "}</p>
          </li>
        ))}
      </ol>
      <p className={`${styles.meta} ${styles.metaRow} ${styles.reveal}`} style={order(4)}>
        {education.note}
      </p>
    </Panel>
  );
}

export function StackPanel({ profile, active }: { profile: Profile; active: boolean }) {
  const { stack } = profile;
  return (
    <Panel id="stack" active={active}>
      <h2 id="stack-title" className={`${styles.title} ${styles.reveal}`} style={order(0)}>
        {stack.title}
      </h2>
      <div className={styles.groups}>
        {stack.groups.map((group, g) => (
          <div key={group.label} className={`${styles.group} ${styles.reveal}`} style={order(g + 1)}>
            <p className={`${styles.meta} ${styles.groupLabel}`}>{group.label}</p>
            <ul className={styles.chips}>
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className={styles.chip}
                  style={item.icon ? brandStyle(item.icon) : undefined}
                >
                  {item.icon ? <StackLogo icon={item.icon} /> : null}
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

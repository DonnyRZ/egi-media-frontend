import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ProfesionalCtaButton } from "@/features/profesional/components/ProfesionalCtaButton";

interface ProfesionalPageBannerProps {
  image: string;
  kickerKey: string;
  titleKey: string;
  ledeKey: string;
  cta?: boolean;
}

export function ProfesionalPageBanner({
  image,
  kickerKey,
  titleKey,
  ledeKey,
  cta = false,
}: ProfesionalPageBannerProps) {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-page-banner">
      <Image alt="" fill priority sizes="100vw" src={image} />
      <div className="profesional-page-banner-overlay" />
      <div className="profesional-page-banner-copy">
        <p className="profesional-kicker">{t(kickerKey)}</p>
        <h1>{t(titleKey)}</h1>
        <p className="profesional-lede">{t(ledeKey)}</p>
        {cta ? <ProfesionalCtaButton /> : null}
      </div>
    </section>
  );
}

interface ProfesionalCopyListProps {
  keys: readonly string[];
}

export function ProfesionalCopyList({ keys }: ProfesionalCopyListProps) {
  const t = useTranslations("profesional");

  return (
    <ul className="profesional-points">
      {keys.map((key) => (
        <li key={key}>{t(key)}</li>
      ))}
    </ul>
  );
}

interface ProfesionalRichCopyProps {
  children?: ReactNode;
}

export function ProfesionalRichCopy({ children }: ProfesionalRichCopyProps) {
  return <div className="profesional-interior">{children}</div>;
}

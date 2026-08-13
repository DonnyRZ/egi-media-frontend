import Image from "next/image";
import { useTranslations } from "next-intl";

import { ProfesionalCtaButton } from "@/features/profesional/components/ProfesionalCtaButton";
import { PROFESIONAL_IMAGES } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalHero() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-hero">
      <Image alt="" fill priority sizes="100vw" src={PROFESIONAL_IMAGES.hero} />
      <div className="profesional-hero-overlay" />
      <div className="profesional-hero-copy">
        <h1>{t("heroHeadline")}</h1>
        <p>{t("heroLede")}</p>
        <ProfesionalCtaButton />
      </div>
    </section>
  );
}

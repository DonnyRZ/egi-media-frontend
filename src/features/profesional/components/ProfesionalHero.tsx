import { useTranslations } from "next-intl";

import { ProfesionalCtaButton } from "@/features/profesional/components/ProfesionalCtaButton";
import { ProfesionalIssueMock } from "@/features/profesional/components/ProfesionalIssueMock";

export function ProfesionalHero() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-hero">
      <div className="profesional-hero-copy">
        <h1>{t("heroHeadline")}</h1>
        <p>{t("heroLede")}</p>
        <ProfesionalCtaButton />
      </div>
      <ProfesionalIssueMock />
    </section>
  );
}

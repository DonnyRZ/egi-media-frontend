import { useTranslations } from "next-intl";

import { ProfesionalCtaButton } from "@/features/profesional/components/ProfesionalCtaButton";

export function ProfesionalCtaBand() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-cta-band">
      <h2>{t("ctaBandTitle")}</h2>
      <p className="profesional-lede">{t("ctaBandBody")}</p>
      <ProfesionalCtaButton />
    </section>
  );
}

import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalKnowsCompany() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section" id={PROFESIONAL_ANCHORS.products}>
      <p className="profesional-kicker">{t("companyKicker")}</p>
      <h2>{t("companyTitle")}</h2>
    </section>
  );
}

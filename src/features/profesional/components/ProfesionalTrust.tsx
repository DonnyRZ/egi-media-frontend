import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalTrust() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section" id={PROFESIONAL_ANCHORS.trust}>
      <p className="profesional-kicker">{t("trustKicker")}</p>
      <h2>{t("trustTitle")}</h2>
      <p className="profesional-lede">{t("trustBody")}</p>
    </section>
  );
}

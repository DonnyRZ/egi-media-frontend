import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

const DIRECTION_KEYS = ["directionSelf", "directionCompetitor", "directionMarket"] as const;

export function ProfesionalDirections() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section" id={PROFESIONAL_ANCHORS.solutions}>
      <p className="profesional-kicker">{t("directionsKicker")}</p>
      <h2>{t("directionsTitle")}</h2>
      <p className="profesional-lede">{t("directionsBody")}</p>
      <div className="profesional-tiles">
        {DIRECTION_KEYS.map((key) => (
          <article key={key}>{t(key)}</article>
        ))}
      </div>
    </section>
  );
}

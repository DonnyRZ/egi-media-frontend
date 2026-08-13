import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalAttention() {
  const t = useTranslations("profesional");
  const points = t.raw("attentionPoints") as string[];

  return (
    <section className="profesional-section" id={PROFESIONAL_ANCHORS.leadership}>
      <p className="profesional-kicker">{t("attentionKicker")}</p>
      <h2>{t("attentionTitle")}</h2>
      <ul className="profesional-points">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

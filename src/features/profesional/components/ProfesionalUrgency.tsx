import { useTranslations } from "next-intl";

export function ProfesionalUrgency() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section">
      <p className="profesional-kicker">{t("urgencyKicker")}</p>
      <h2>{t("urgencyTitle")}</h2>
      <ul className="profesional-points">
        <li>{t("urgencyMorning")}</li>
        <li>{t("urgencyAlert")}</li>
        <li>{t("urgencyMeeting")}</li>
      </ul>
    </section>
  );
}

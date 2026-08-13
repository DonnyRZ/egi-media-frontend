import { useTranslations } from "next-intl";

const AUDIENCE_KEYS = [
  "audienceDirectors",
  "audienceComms",
  "audienceRisk",
  "audienceGroup",
] as const;

export function ProfesionalAudience() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section">
      <p className="profesional-kicker">{t("audienceKicker")}</p>
      <h2>{t("audienceTitle")}</h2>
      <div className="profesional-tiles">
        {AUDIENCE_KEYS.map((key) => (
          <article key={key}>{t(key)}</article>
        ))}
      </div>
    </section>
  );
}

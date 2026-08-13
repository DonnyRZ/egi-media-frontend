import { useTranslations } from "next-intl";

const ISSUE_KEYS = ["issueWhat", "issueWhy", "issueImpact", "issueRisk", "issueWatch"] as const;

export function ProfesionalIssues() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section">
      <p className="profesional-kicker">{t("issuesKicker")}</p>
      <h2>{t("issuesTitle")}</h2>
      <p className="profesional-lede">{t("issuesBody")}</p>
      <ol className="profesional-issue-list">
        {ISSUE_KEYS.map((key, index) => (
          <li key={key}>
            <span>{index + 1}</span>
            {t(key)}
          </li>
        ))}
      </ol>
    </section>
  );
}

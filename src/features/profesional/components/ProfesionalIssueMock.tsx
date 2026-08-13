import { useTranslations } from "next-intl";

export function ProfesionalIssueMock() {
  const t = useTranslations("profesional");

  return (
    <aside aria-hidden="true" className="profesional-mock">
      <p className="profesional-mock-priority">{t("mockPriority")}</p>
      <p className="profesional-mock-title">{t("mockIssueTitle")}</p>
      <p className="profesional-mock-line">{t("mockIssueLine")}</p>
    </aside>
  );
}

import { useTranslations } from "next-intl";

import { SOLUTION_LINKS } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";

export function ProfesionalSolutionsSplit() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section profesional-solutions">
      <div>
        <p className="profesional-kicker">{t("solutionsKicker")}</p>
        <h2>{t("solutionsTitle")}</h2>
        <p className="profesional-lede">{t("solutionsBody")}</p>
      </div>
      <div className="profesional-link-list">
        {SOLUTION_LINKS.map((item) => (
          <Link href={item.href} key={item.key}>
            {t(item.key)}
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

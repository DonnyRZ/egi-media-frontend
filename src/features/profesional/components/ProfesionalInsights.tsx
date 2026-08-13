import Image from "next/image";
import { useTranslations } from "next-intl";

import { INSIGHT_CARDS } from "@/features/profesional/constants/profesional.constants";
import { copyKey } from "@/features/profesional/utils/copy-key";
import { Link } from "@/i18n/navigation";

export function ProfesionalInsights() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section">
      <div className="profesional-section-head">
        <p className="profesional-kicker">{t("insightsKicker")}</p>
      </div>
      <div className="profesional-insight-grid">
        {INSIGHT_CARDS.map((item) => (
          <Link className="profesional-insight-card" href={item.href} key={item.key}>
            <Image alt="" fill sizes="(min-width: 900px) 33vw, 100vw" src={item.image} />
            <span className="profesional-card-shade" />
            <span className="profesional-insight-card-copy">
              <span className="profesional-insight-kicker">
                {t(copyKey("insight", `${item.key}Kicker`))}
              </span>
              <h3>{t(copyKey("insight", `${item.key}Title`))}</h3>
            </span>
            <span aria-hidden="true" className="profesional-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

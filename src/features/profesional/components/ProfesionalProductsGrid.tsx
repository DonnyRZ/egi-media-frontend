import Image from "next/image";
import { useTranslations } from "next-intl";

import { PRODUCT_CARDS } from "@/features/profesional/constants/profesional.constants";
import { copyKey } from "@/features/profesional/utils/copy-key";
import { Link } from "@/i18n/navigation";

export function ProfesionalProductsGrid() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-section">
      <div className="profesional-section-head">
        <p className="profesional-kicker">{t("productsKicker")}</p>
      </div>
      <div className="profesional-product-grid">
        {PRODUCT_CARDS.map((item) => (
          <Link className="profesional-product-card" href={item.href} key={item.key}>
            <Image alt="" fill sizes="(min-width: 900px) 33vw, 100vw" src={item.image} />
            <span className="profesional-card-shade" />
            <span className="profesional-product-card-copy">
              <h3>{t(copyKey("product", item.key))}</h3>
              <span aria-hidden="true" className="profesional-arrow">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

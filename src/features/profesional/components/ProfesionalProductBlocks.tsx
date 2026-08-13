import Image from "next/image";
import { useTranslations } from "next-intl";

import { PRODUCT_CARDS } from "@/features/profesional/constants/profesional.constants";
import { copyKey } from "@/features/profesional/utils/copy-key";

export function ProfesionalProductBlocks() {
  const t = useTranslations("profesional");

  return (
    <>
      {PRODUCT_CARDS.map((item) => (
        <article className="profesional-product-block" id={item.id} key={item.key}>
          <div className="profesional-product-block-media">
            <Image alt="" fill sizes="(min-width: 900px) 50vw, 100vw" src={item.image} />
          </div>
          <div>
            <p className="profesional-kicker">{t("productsKicker")}</p>
            <h2>{t(copyKey("product", item.key))}</h2>
            <p className="profesional-lede">{t(copyKey("product", `${item.key}Body`))}</p>
          </div>
        </article>
      ))}
    </>
  );
}

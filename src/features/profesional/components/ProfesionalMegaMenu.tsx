"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  MEGA_FEATURES,
  PRODUCT_CARDS,
  PROFESIONAL_IMAGES,
  PROFESIONAL_ROUTES,
} from "@/features/profesional/constants/profesional.constants";
import { copyKey } from "@/features/profesional/utils/copy-key";
import { Link } from "@/i18n/navigation";

interface ProfesionalMegaMenuProps {
  open: boolean;
}

export function ProfesionalMegaMenu({ open }: ProfesionalMegaMenuProps) {
  const t = useTranslations("profesional");

  if (!open) return null;

  return (
    <div className="profesional-mega is-open">
      <div className="profesional-mega-inner">
        <div>
          {PRODUCT_CARDS.map((item) => (
            <Link href={item.href} key={item.key}>
              {t(copyKey("product", item.key))}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <Link className="profesional-mega-see-all" href={PROFESIONAL_ROUTES.products}>
            {t("megaSeeAll")}
          </Link>
        </div>
        <div>
          {MEGA_FEATURES.map((item) => (
            <Link href={item.href} key={item.key}>
              {t(item.key)}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <div>
          <Image
            alt=""
            height={160}
            src={PROFESIONAL_IMAGES.briefing}
            style={{ width: "100%", height: "auto" }}
            width={280}
          />
          <Link href={PROFESIONAL_ROUTES.insights}>
            {t("navInsights")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

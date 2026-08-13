"use client";

import { useTranslations } from "next-intl";

import { PROFESIONAL_NAV } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";

interface ProfesionalMobileNavProps {
  onClose: () => void;
}

export function ProfesionalMobileNav({ onClose }: ProfesionalMobileNavProps) {
  const t = useTranslations("profesional");

  return (
    <nav aria-label={t("brand")} className="profesional-nav-mobile">
      {PROFESIONAL_NAV.map((item) => (
        <Link href={item.href} key={item.key} onClick={onClose}>
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}

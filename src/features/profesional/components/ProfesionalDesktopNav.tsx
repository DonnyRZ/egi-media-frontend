"use client";

import { useTranslations } from "next-intl";

import { PROFESIONAL_NAV } from "@/features/profesional/constants/profesional.constants";
import { Link, usePathname } from "@/i18n/navigation";

interface ProfesionalDesktopNavProps {
  megaOpen: boolean;
  onMega: (open: boolean) => void;
}

export function ProfesionalDesktopNav({ megaOpen, onMega }: ProfesionalDesktopNavProps) {
  const t = useTranslations("profesional");
  const pathname = usePathname();

  return (
    <nav aria-label={t("brand")} className="profesional-nav-desktop">
      {PROFESIONAL_NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const className = [
          item.mega ? "profesional-nav-item" : "",
          active ? "is-active" : "",
          item.mega && megaOpen ? "is-mega" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Link
            className={className || undefined}
            href={item.href}
            key={item.key}
            onMouseEnter={() => onMega(Boolean(item.mega))}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

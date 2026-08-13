"use client";

import { useLocale, useTranslations } from "next-intl";

import { LANGUAGE_OPTIONS } from "@/features/language/constants/language.constants";
import { Link, usePathname } from "@/i18n/navigation";

export function ProfesionalLanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("profesional");

  return (
    <nav aria-label={t("language")} className="profesional-lang">
      {LANGUAGE_OPTIONS.map((option) => (
        <Link
          aria-current={option.locale === locale ? "page" : undefined}
          href={pathname}
          key={option.locale}
          locale={option.locale}
        >
          {option.code}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/features/language/components/LanguageSwitcher";
import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";
import { env } from "@/shared/config/env";

interface ProfesionalHeaderActionsProps {
  menuOpen: boolean;
  onMenu: () => void;
}

function LanguageSwitcherSlot() {
  return (
    <Suspense fallback={<span className="inline-block h-8 w-12" aria-hidden="true" />}>
      <LanguageSwitcher />
    </Suspense>
  );
}

export function ProfesionalHeaderActions({ menuOpen, onMenu }: ProfesionalHeaderActionsProps) {
  const t = useTranslations("profesional");

  return (
    <div className="profesional-header-actions">
      <LanguageSwitcherSlot />
      <a className="profesional-sign-in" href={env.aiAppUrl} rel="noreferrer">
        {t("signIn")}
      </a>
      <Link className="profesional-cta" href={PROFESIONAL_ROUTES.support}>
        {t("requestDemo")}
      </Link>
      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
        className="profesional-menu-toggle"
        onClick={onMenu}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}

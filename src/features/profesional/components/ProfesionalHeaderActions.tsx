"use client";

import { useTranslations } from "next-intl";

import { ProfesionalLanguageSwitcher } from "@/features/profesional/components/ProfesionalLanguageSwitcher";
import { ProfesionalSignIn } from "@/features/profesional/components/ProfesionalSignIn";
import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";

interface ProfesionalHeaderActionsProps {
  menuOpen: boolean;
  onMenu: () => void;
}

export function ProfesionalHeaderActions({ menuOpen, onMenu }: ProfesionalHeaderActionsProps) {
  const t = useTranslations("profesional");

  return (
    <div className="profesional-header-actions">
      <ProfesionalLanguageSwitcher />
      <ProfesionalSignIn />
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

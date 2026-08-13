"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/features/language/components/LanguageSwitcher";
import {
  PROFESIONAL_ANCHORS,
  PROFESIONAL_NAV,
} from "@/features/profesional/constants/profesional.constants";
import { env } from "@/shared/config/env";

function LanguageSwitcherSlot() {
  return (
    <Suspense fallback={<span className="inline-block h-8 w-12" aria-hidden="true" />}>
      <LanguageSwitcher />
    </Suspense>
  );
}

export function ProfesionalHeader() {
  const t = useTranslations("profesional");
  const [open, setOpen] = useState(false);

  return (
    <header className="profesional-header">
      <div className="profesional-header-inner">
        <a className="profesional-brand" href="#top">
          {t("brand")}
        </a>
        <nav aria-label={t("brand")} className="profesional-nav-desktop">
          {PROFESIONAL_NAV.map((item) => (
            <a key={item.key} href={item.href}>
              {t(item.key)}
            </a>
          ))}
        </nav>
        <div className="profesional-header-actions">
          <LanguageSwitcherSlot />
          <a className="profesional-sign-in" href={env.aiAppUrl} rel="noreferrer">
            {t("signIn")}
          </a>
          <a className="profesional-cta" href={`#${PROFESIONAL_ANCHORS.demo}`}>
            {t("requestDemo")}
          </a>
          <button
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="profesional-menu-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {open ? (
        <nav aria-label={t("brand")} className="profesional-nav-mobile">
          {PROFESIONAL_NAV.map((item) => (
            <a key={item.key} href={item.href} onClick={() => setOpen(false)}>
              {t(item.key)}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

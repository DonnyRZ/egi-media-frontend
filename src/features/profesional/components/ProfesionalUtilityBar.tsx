"use client";

import { useTranslations } from "next-intl";

import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";
import { env } from "@/shared/config/env";

export function ProfesionalUtilityBar() {
  const t = useTranslations("profesional");

  return (
    <div className="profesional-utility">
      <Link href="/" locale="id">{t("utilityNews")}</Link>
      <Link href={PROFESIONAL_ROUTES.support}>{t("utilityDemo")}</Link>
      <a href={env.aiAppUrl} rel="noreferrer">{t("utilitySignIn")}</a>
      <Link href={PROFESIONAL_ROUTES.support}>{t("utilitySupport")}</Link>
    </div>
  );
}

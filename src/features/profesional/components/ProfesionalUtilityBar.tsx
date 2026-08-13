"use client";

import { useTranslations } from "next-intl";

import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { ProfesionalSignIn } from "@/features/profesional/components/ProfesionalSignIn";
import { Link } from "@/i18n/navigation";

export function ProfesionalUtilityBar() {
  const t = useTranslations("profesional");

  return (
    <div className="profesional-utility">
      <Link href="/" locale="id">{t("utilityNews")}</Link>
      <Link href={PROFESIONAL_ROUTES.support}>{t("utilityDemo")}</Link>
      <ProfesionalSignIn />
      <Link href={PROFESIONAL_ROUTES.support}>{t("utilitySupport")}</Link>
    </div>
  );
}

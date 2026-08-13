import { useTranslations } from "next-intl";

import { PROFESIONAL_ROUTES } from "@/features/profesional/constants/profesional.constants";
import { Link } from "@/i18n/navigation";

export function ProfesionalCtaButton() {
  const t = useTranslations("profesional");

  return (
    <Link className="profesional-cta" href={PROFESIONAL_ROUTES.support}>
      {t("requestDemo")}
    </Link>
  );
}

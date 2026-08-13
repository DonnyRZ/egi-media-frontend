import { useTranslations } from "next-intl";

import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalCtaButton() {
  const t = useTranslations("profesional");

  return (
    <a className="profesional-cta" href={`#${PROFESIONAL_ANCHORS.demo}`}>
      {t("requestDemo")}
    </a>
  );
}

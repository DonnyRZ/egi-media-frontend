import { useTranslations } from "next-intl";

import { ProfesionalDemoForm } from "@/features/profesional/components/ProfesionalDemoForm";
import { PROFESIONAL_ANCHORS } from "@/features/profesional/constants/profesional.constants";

export function ProfesionalDemoBand() {
  const t = useTranslations("profesional");

  return (
    <section className="profesional-demo" id={PROFESIONAL_ANCHORS.demo}>
      <div id={PROFESIONAL_ANCHORS.support}>
        <p className="profesional-kicker">{t("demoKicker")}</p>
        <h2>{t("demoTitle")}</h2>
      </div>
      <ProfesionalDemoForm />
    </section>
  );
}

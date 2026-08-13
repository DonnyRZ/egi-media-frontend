import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfesionalDemoForm } from "@/features/profesional/components/ProfesionalDemoForm";
import { ProfesionalPageBanner, ProfesionalRichCopy } from "@/features/profesional/components/ProfesionalPageBanner";
import { PAGE_BANNERS, PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

interface SupportPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SupportPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "demoTitle", "demoBody");
}

export default async function SupportPage({ params }: SupportPageProps) {
  await params;
  setRequestLocale(PROFESIONAL_LOCALE);
  const t = await getTranslations({ locale: PROFESIONAL_LOCALE, namespace: "profesional" });

  return (
    <>
      <ProfesionalPageBanner
        image={PAGE_BANNERS.support}
        kickerKey="navSupport"
        ledeKey="demoBody"
        titleKey="demoTitle"
      />
      <ProfesionalRichCopy>
        <p className="profesional-lede">{t("supportLede")}</p>
        <ProfesionalDemoForm />
      </ProfesionalRichCopy>
    </>
  );
}

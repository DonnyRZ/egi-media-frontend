import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfesionalCtaBand } from "@/features/profesional/components/ProfesionalCtaBand";
import { ProfesionalInsights } from "@/features/profesional/components/ProfesionalInsights";
import { ProfesionalPageBanner, ProfesionalRichCopy } from "@/features/profesional/components/ProfesionalPageBanner";
import { PAGE_BANNERS, PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: InsightsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "trustTitle", "trustBody");
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  await params;
  setRequestLocale(PROFESIONAL_LOCALE);
  const t = await getTranslations({ locale: PROFESIONAL_LOCALE, namespace: "profesional" });

  return (
    <>
      <ProfesionalPageBanner
        image={PAGE_BANNERS.insights}
        kickerKey="trustKicker"
        ledeKey="trustBody"
        titleKey="trustTitle"
      />
      <ProfesionalRichCopy>
        <p className="profesional-lede">{t("trustPageBody")}</p>
      </ProfesionalRichCopy>
      <ProfesionalInsights />
      <ProfesionalCtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalCtaBand } from "@/features/profesional/components/ProfesionalCtaBand";
import { ProfesionalHero } from "@/features/profesional/components/ProfesionalHero";
import { ProfesionalInsights } from "@/features/profesional/components/ProfesionalInsights";
import { ProfesionalProductsGrid } from "@/features/profesional/components/ProfesionalProductsGrid";
import { ProfesionalSolutionsSplit } from "@/features/profesional/components/ProfesionalSolutionsSplit";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

interface ProfesionalPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProfesionalPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "metaHomeTitle", "metaHomeDescription");
}

export default async function ProfesionalPage({ params }: ProfesionalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProfesionalHero />
      <ProfesionalProductsGrid />
      <ProfesionalSolutionsSplit />
      <ProfesionalInsights />
      <ProfesionalCtaBand />
    </>
  );
}

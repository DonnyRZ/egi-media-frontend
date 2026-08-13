import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalCtaBand } from "@/features/profesional/components/ProfesionalCtaBand";
import {
  ProfesionalCopyList,
  ProfesionalPageBanner,
  ProfesionalRichCopy,
} from "@/features/profesional/components/ProfesionalPageBanner";
import { ProfesionalSolutionsSplit } from "@/features/profesional/components/ProfesionalSolutionsSplit";
import { PAGE_BANNERS, PROFESIONAL_LOCALE } from "@/features/profesional/constants/profesional.constants";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

const SOLUTION_POINTS = [
  "solutionsPointOne",
  "solutionsPointTwo",
  "solutionsPointThree",
  "solutionsPointFour",
] as const;

interface SolutionsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SolutionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "solutionsTitle", "solutionsBody");
}

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  await params;
  setRequestLocale(PROFESIONAL_LOCALE);

  return (
    <>
      <ProfesionalPageBanner
        image={PAGE_BANNERS.solutions}
        kickerKey="solutionsKicker"
        ledeKey="solutionsPageLede"
        titleKey="solutionsTitle"
      />
      <ProfesionalSolutionsSplit />
      <ProfesionalRichCopy>
        <ProfesionalCopyList keys={SOLUTION_POINTS} />
      </ProfesionalRichCopy>
      <ProfesionalCtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfesionalAttention } from "@/features/profesional/components/ProfesionalAttention";
import { ProfesionalAudience } from "@/features/profesional/components/ProfesionalAudience";
import { ProfesionalDemoBand } from "@/features/profesional/components/ProfesionalDemoBand";
import { ProfesionalDirections } from "@/features/profesional/components/ProfesionalDirections";
import { ProfesionalHero } from "@/features/profesional/components/ProfesionalHero";
import { ProfesionalIssues } from "@/features/profesional/components/ProfesionalIssues";
import { ProfesionalKnowsCompany } from "@/features/profesional/components/ProfesionalKnowsCompany";
import { ProfesionalShell } from "@/features/profesional/components/ProfesionalShell";
import { ProfesionalTrust } from "@/features/profesional/components/ProfesionalTrust";
import { ProfesionalUrgency } from "@/features/profesional/components/ProfesionalUrgency";

interface ProfesionalPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProfesionalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("profesionalTitle"),
    description: t("profesionalDescription"),
  };
}

export default async function ProfesionalPage({ params }: ProfesionalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProfesionalShell>
      <ProfesionalHero />
      <ProfesionalAttention />
      <ProfesionalKnowsCompany />
      <ProfesionalIssues />
      <ProfesionalDirections />
      <ProfesionalUrgency />
      <ProfesionalTrust />
      <ProfesionalAudience />
      <ProfesionalDemoBand />
    </ProfesionalShell>
  );
}

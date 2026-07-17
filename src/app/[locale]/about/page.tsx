import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutStory } from "@/features/about/components/AboutStory";
import { AboutCoverage } from "@/features/about/components/AboutCoverage";
import { TeamSection } from "@/features/about/components/TeamSection";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutCoverage />
      <TeamSection />
    </>
  );
}

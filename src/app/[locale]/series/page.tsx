import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SeriesHero } from "@/features/series/components/SeriesHero";
import { SeriesListing } from "@/features/series/components/SeriesListing";
import { PageFrame } from "@/shared/components/layout/PageFrame";

interface SeriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("seriesTitle"),
    description: t("seriesDescription"),
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageFrame>
      <SeriesHero />
      <SeriesListing />
    </PageFrame>
  );
}

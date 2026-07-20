import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SeriesDetailView } from "@/features/series/components/SeriesDetailView";

interface SeriesDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: SeriesDetailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("seriesTitle"),
    description: t("seriesDescription"),
  };
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <SeriesDetailView slug={slug} />;
}

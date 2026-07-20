import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopicsHero } from "@/features/topics/components/TopicsHero";
import { TopicsListing } from "@/features/topics/components/TopicsListing";

interface TopicsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TopicsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("topicsTitle"),
    description: t("topicsDescription"),
  };
}

export default async function TopicsPage({ params }: TopicsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopicsHero />
      <TopicsListing />
    </>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { VideosHero } from "@/features/videos/components/VideosHero";
import { VideosListing } from "@/features/videos/components/VideosListing";

interface VideosPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VideosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("videosTitle"),
    description: t("videosDescription"),
  };
}

export default async function VideosPage({ params }: VideosPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <VideosHero />
      <VideosListing />
    </>
  );
}

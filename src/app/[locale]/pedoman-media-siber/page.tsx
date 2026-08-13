import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PedomanBody } from "@/features/pedoman-media-siber/components/PedomanBody";
import { PedomanHero } from "@/features/pedoman-media-siber/components/PedomanHero";

interface PedomanMediaSiberPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PedomanMediaSiberPageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const tPage = await getTranslations({ locale, namespace: "pedomanSiber" });

  return {
    title: tPage("headline"),
    description: tMeta("pedomanMediaSiberDescription"),
  };
}

export default async function PedomanMediaSiberPage({
  params,
}: PedomanMediaSiberPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PedomanHero />
      <PedomanBody />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ColumnsHero } from "@/features/columns/components/ColumnsHero";
import { ColumnsListing } from "@/features/columns/components/ColumnsListing";

interface ColumnsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ColumnsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsTitle"),
    description: t("columnsDescription"),
  };
}

export default async function ColumnsPage({ params }: ColumnsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ColumnsHero />
      <Suspense fallback={null}>
        <ColumnsListing />
      </Suspense>
    </>
  );
}

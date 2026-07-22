import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ColumnDetailView } from "@/features/columns/components/ColumnDetailView";

interface ColumnDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ColumnDetailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsTitle"),
    description: t("columnsDescription"),
  };
}

export default async function ColumnDetailPage({
  params,
}: ColumnDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ColumnDetailView slug={slug} />;
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MyColumnsView } from "@/features/columns/components/MyColumnsView";

interface MyColumnsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: MyColumnsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsMineTitle"),
    description: t("columnsDescription"),
  };
}

export default async function MyColumnsPage({ params }: MyColumnsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MyColumnsView />;
}

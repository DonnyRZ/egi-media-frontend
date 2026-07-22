import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { WriteColumnView } from "@/features/columns/components/WriteColumnView";

interface WriteColumnPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: WriteColumnPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsWriteTitle"),
    description: t("columnsDescription"),
  };
}

export default async function WriteColumnPage({ params }: WriteColumnPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WriteColumnView />;
}

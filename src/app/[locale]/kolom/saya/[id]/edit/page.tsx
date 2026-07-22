import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EditColumnView } from "@/features/columns/components/EditColumnView";

interface EditColumnPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: EditColumnPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsEditTitle"),
    description: t("columnsDescription"),
  };
}

export default async function EditColumnPage({ params }: EditColumnPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <EditColumnView columnId={id} />;
}

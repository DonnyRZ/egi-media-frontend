import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CategoriesHero } from "@/features/categories/components/CategoriesHero";
import { CategoriesListing } from "@/features/categories/components/CategoriesListing";

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("categoriesTitle"),
    description: t("categoriesDescription"),
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CategoriesHero />
      <CategoriesListing />
    </>
  );
}

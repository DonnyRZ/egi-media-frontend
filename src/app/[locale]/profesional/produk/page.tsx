import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { ProfesionalCtaBand } from "@/features/profesional/components/ProfesionalCtaBand";
import { ProfesionalPageBanner } from "@/features/profesional/components/ProfesionalPageBanner";
import { ProfesionalProductBlocks } from "@/features/profesional/components/ProfesionalProductBlocks";
import { PAGE_BANNERS } from "@/features/profesional/constants/profesional.constants";
import { profesionalPageMeta } from "@/features/profesional/lib/profesional-metadata";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return profesionalPageMeta(locale, "productsTitle", "productsLede");
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProfesionalPageBanner
        image={PAGE_BANNERS.products}
        kickerKey="productsKicker"
        ledeKey="productsLede"
        titleKey="productsTitle"
      />
      <ProfesionalProductBlocks />
      <ProfesionalCtaBand />
    </>
  );
}

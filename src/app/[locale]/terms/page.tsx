import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TermsHero } from "@/features/terms/components/TermsHero";
import { TermsBody } from "@/features/terms/components/TermsBody";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TermsHero />
      <TermsBody />
    </>
  );
}

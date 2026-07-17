import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PrivacyHero } from "@/features/privacy/components/PrivacyHero";
import { PrivacyBody } from "@/features/privacy/components/PrivacyBody";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PrivacyHero />
      <PrivacyBody />
    </>
  );
}

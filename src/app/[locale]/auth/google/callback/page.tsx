import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GoogleCallbackView } from "@/features/auth/components/GoogleCallbackView";

interface GoogleCallbackPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: GoogleCallbackPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default async function GoogleCallbackPage({
  params,
}: GoogleCallbackPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <Suspense fallback={<p>{t("loading")}</p>}>
      <GoogleCallbackView />
    </Suspense>
  );
}

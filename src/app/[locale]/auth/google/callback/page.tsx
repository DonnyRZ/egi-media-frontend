import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth/components/AuthShell";
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
    <AuthShell subtitle={t("googleLoadingBody")} title={t("googleLoadingTitle")}>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <GoogleCallbackView />
      </Suspense>
    </AuthShell>
  );
}

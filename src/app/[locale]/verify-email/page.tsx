import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { VerifyEmailView } from "@/features/auth/components/VerifyEmailView";

interface VerifyEmailPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: VerifyEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("verifyEmailTitle"),
    description: t("verifyEmailDescription"),
  };
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthShell title={t("verifyHeadline")}>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <VerifyEmailView />
      </Suspense>
    </AuthShell>
  );
}

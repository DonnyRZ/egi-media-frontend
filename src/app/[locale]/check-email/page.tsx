import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { CheckEmailView } from "@/features/auth/components/CheckEmailView";

interface CheckEmailPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CheckEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("checkEmailTitle"),
    description: t("checkEmailDescription"),
  };
}

export default async function CheckEmailPage({ params }: CheckEmailPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthShell title={t("checkEmailHeadline")}>
      <Suspense fallback={<p>{t("loading")}</p>}>
        <CheckEmailView />
      </Suspense>
    </AuthShell>
  );
}

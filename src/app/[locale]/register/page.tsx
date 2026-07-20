import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("registerTitle"),
    description: t("registerDescription"),
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <AuthShell subtitle={t("registerLede")} title={t("registerHeadline")}>
      <RegisterForm />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProfileHero } from "@/features/profile/components/ProfileHero";
import { ProfileView } from "@/features/profile/components/ProfileView";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("profileTitle"),
    description: t("profileDescription"),
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ProfileHero />
      <ProfileView />
    </>
  );
}

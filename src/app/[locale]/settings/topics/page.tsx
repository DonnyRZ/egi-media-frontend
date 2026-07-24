import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopicSubscriptionsHero } from "@/features/topic-subscriptions/components/TopicSubscriptionsHero";
import { TopicSubscriptionsView } from "@/features/topic-subscriptions/components/TopicSubscriptionsView";

interface TopicSubscriptionsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: TopicSubscriptionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("topicSubscriptionsTitle"),
    description: t("topicSubscriptionsDescription"),
  };
}

export default async function TopicSubscriptionsPage({
  params,
}: TopicSubscriptionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TopicSubscriptionsHero />
      <TopicSubscriptionsView />
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopicDetailView } from "@/features/topics/components/TopicDetailView";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { HEADER_TOPIC_I18N_KEYS } from "@/shared/constants/header-topics.constants";
import { getTopicBySlug } from "@/shared/repositories/topic.repository";
import { toContentLocale } from "@/shared/utils/locale";

interface TopicDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: TopicDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = toContentLocale(locale);
  const hubKey = HEADER_TOPIC_I18N_KEYS[slug];

  if (hubKey) {
    const tHubs = await getTranslations({ locale, namespace: "topicHubs" });
    return {
      title: tHubs(`${hubKey}.metaTitle`),
      description: tHubs(`${hubKey}.metaDescription`),
    };
  }

  const topic = await getTopicBySlug(slug, lang);
  const t = await getTranslations({ locale, namespace: "metadata" });

  if (topic) {
    return {
      title: topic.name,
      description: topic.description ?? t("topicsDescription"),
    };
  }

  return {
    title: t("topicsTitle"),
    description: t("topicsDescription"),
  };
}

function DetailFallback() {
  return (
    <Section>
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Container>
    </Section>
  );
}

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DetailFallback />}>
      <TopicDetailView slug={slug} />
    </Suspense>
  );
}

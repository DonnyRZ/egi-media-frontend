import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopicDetailView } from "@/features/topics/components/TopicDetailView";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface TopicDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: TopicDetailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

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

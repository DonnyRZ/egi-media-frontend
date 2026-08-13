import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopicDetailView } from "@/features/topics/components/TopicDetailView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
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
    <PageFrame>
      <FrameModule>
        <div className="space-y-3 bg-white p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </FrameModule>
      <FrameModule>
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-white p-5">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </FrameModule>
    </PageFrame>
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

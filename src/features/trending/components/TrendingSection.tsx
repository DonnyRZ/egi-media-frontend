"use client";

import { useTranslations } from "next-intl";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useBreakingNews } from "@/features/homepage/hooks/useBreakingNews";
import { TrendingArticleGrid } from "@/features/trending/components/TrendingArticleGrid";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export function TrendingSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useBreakingNews();
  const t = useTranslations("breaking");
  const items = data?.items ?? [];
  if (!isLoading && !isError && !sectionFailed && !items.length) return null;

  return <FrameModule ariaLabelledby="trending-heading" className="homepage-trending">
    <FrameHeading id="trending-heading" title={t("title")} subtitle={t("subtitle")} />
    <HomepageSectionNotice section="breaking" />
    {isLoading ? <div className="homepage-trending-grid grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => <div key={index} className="homepage-trending-card editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
        <Skeleton className="homepage-trending-photo aspect-video w-full" />
        <Skeleton className="h-5 w-full" />
      </div>)}
    </div> : null}
    {isError ? <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
      <ErrorState message={error?.message} onRetry={() => void refetch()} />
    </div> : null}
    {!isLoading && !isError && items.length ? <TrendingArticleGrid articles={items} /> : null}
  </FrameModule>;
}

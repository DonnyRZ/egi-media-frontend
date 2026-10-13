"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useLatestNews } from "@/features/homepage/hooks/useLatestNews";

export function LatestNewsSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useLatestNews();
  const t = useTranslations("latest");

  if (!isLoading && !isError && !sectionFailed && !data?.items.length) {
    return null;
  }

  const items = data?.items ?? [];

  return (
    <FrameModule ariaLabelledby="latest-heading">
      <HomepageSectionNotice section="latest" />
      <FrameHeading
        actionHref="/latest"
        id="latest-heading"
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && items.length ? (
        <AdaptiveCardGrid items={items} keyForItem={(article) => article.id}
          renderItem={(article) => <ArticleCard article={article} className="editorial-gutter bg-white px-4 py-5 md:p-5" />} />
      ) : null}
    </FrameModule>
  );
}

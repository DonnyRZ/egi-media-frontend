"use client";

import { useTranslations } from "next-intl";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useLatestNews } from "@/features/homepage/hooks/useLatestNews";

export function LatestNewsSection() {
  const { data, isLoading, isError, error, refetch } = useLatestNews();
  const t = useTranslations("latest");

  if (!isLoading && !isError && !data?.items.length) {
    return null;
  }

  const items = data?.items ?? [];

  return (
    <FrameModule ariaLabelledby="latest-heading">
      <FrameHeading
        actionHref="/latest"
        id="latest-heading"
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 bg-white p-5">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && items.length ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              className="bg-white p-5"
            />
          ))}
          <GridFillers count={items.length} />
        </div>
      ) : null}
    </FrameModule>
  );
}

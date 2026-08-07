"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLatestNewsPage } from "@/features/latest-news/hooks/useLatestNewsPage";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { LATEST_NEWS_PAGE_LIMIT } from "@/shared/constants/latest-news.constants";

function LatestNewsSkeleton() {
  return (
    <>
      <div className="grid gap-px bg-neutral-200 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-white p-5">
          <Skeleton className="aspect-[16/10] w-full" />
        </div>
        <div className="space-y-3 bg-white p-5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 bg-white p-5">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}

export function LatestNewsListing() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useLatestNewsPage(page);
  const t = useTranslations("latestNewsPage");
  const tCommon = useTranslations("common");

  const gridItems =
    !isLoading && !isError && data?.items.length
      ? page === 1
        ? data.items.slice(1)
        : data.items
      : [];

  return (
    <FrameModule ariaLabelledby="latest-news-listing-heading">
      <h2 className="sr-only" id="latest-news-listing-heading">
        {t("listingHeading")}
      </h2>

      {isLoading ? <LatestNewsSkeleton /> : null}

      {isError ? (
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && !data?.items.length ? (
        <div className="bg-white p-5">
          <EmptyState message={t("empty")} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <>
          {page === 1 ? (
            <div className="border-b border-neutral-200 bg-white p-5">
              <p className="kicker">{t("featuredKicker")}</p>
              <div className="mt-3">
                <ArticleCard article={data.items[0]} variant="featured" />
              </div>
            </div>
          ) : null}

          {gridItems.length > 0 ? (
            <>
              <FrameHeading
                id="latest-news-grid-heading"
                subtitle={tCommon("articleCount", { count: data.total })}
                title={page === 1 ? t("allArticles") : t("listingHeading")}
              />
              <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((article) => (
                  <ArticleCard
                    article={article}
                    className="bg-white p-5"
                    key={article.id}
                  />
                ))}
                <GridFillers count={gridItems.length} />
              </div>
            </>
          ) : null}

          <div className="bg-white p-5">
            <Pagination
              basePath="/latest"
              currentPage={data.page}
              itemLabel="articles"
              pageSize={data.limit || LATEST_NEWS_PAGE_LIMIT}
              totalItems={data.total}
              totalPages={data.totalPages}
            />
          </div>
        </>
      ) : null}
    </FrameModule>
  );
}

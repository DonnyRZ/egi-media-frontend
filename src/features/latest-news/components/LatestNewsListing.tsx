"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLatestNewsPage } from "@/features/latest-news/hooks/useLatestNewsPage";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { LATEST_NEWS_PAGE_LIMIT } from "@/shared/constants/latest-news.constants";

function LatestNewsSkeleton() { return <div className="editorial-gutter px-4 py-5 md:p-5" aria-busy="true">{Array.from({length:6},(_,i)=><Skeleton key={i} className="my-4 h-24 w-full"/>)}</div>; }

export function LatestNewsListing() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useLatestNewsPage(page);
  const t = useTranslations("latestNewsPage");


  return (
    <FrameModule ariaLabelledby="latest-news-listing-heading">
      <h2 className="sr-only" id="latest-news-listing-heading">
        {t("listingHeading")}
      </h2>

      {isLoading ? <LatestNewsSkeleton /> : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && !data?.items.length ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <EmptyState message={t("empty")} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <>
          <div className="editorial-gutter px-4 md:px-5"><ArticleTimeline articles={data.items}/></div>

          {data.totalPages > 1 ? (
            <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
              <Pagination
                basePath="/latest"
                currentPage={data.page}
                itemLabel="articles"
                pageSize={data.limit || LATEST_NEWS_PAGE_LIMIT}
                totalItems={data.total}
                totalPages={data.totalPages}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </FrameModule>
  );
}

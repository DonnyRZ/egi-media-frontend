"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { HeroFeaturedCard } from "@/features/hero-section/components/HeroFeaturedCard";
import { useLatestNewsPage } from "@/features/latest-news/hooks/useLatestNewsPage";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { LATEST_NEWS_PAGE_LIMIT } from "@/shared/constants/latest-news.constants";

function LatestNewsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Skeleton className="aspect-[16/9] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LatestNewsListing() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useLatestNewsPage(page);
  const t = useTranslations("latestNewsPage");
  const tCommon = useTranslations("common");

  return (
    <Section ariaLabelledby="latest-news-listing-heading">
      <Container>
        <h2 id="latest-news-listing-heading" className="sr-only">
          {t("listingHeading")}
        </h2>

        {isLoading ? <LatestNewsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-10">
            {page === 1 ? (
              <div>
                <p className="kicker">{t("featuredKicker")}</p>
                <div className="mt-3">
                  <HeroFeaturedCard article={data.items[0]} />
                </div>
              </div>
            ) : null}

            {(page === 1 ? data.items.slice(1) : data.items).length > 0 ? (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                    {page === 1 ? t("allArticles") : t("listingHeading")}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {tCommon("articleCount", { count: data.total })}
                  </p>
                </div>
                <div className="grid min-h-[28rem] gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {(page === 1 ? data.items.slice(1) : data.items).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ) : null}

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
      </Container>
    </Section>
  );
}

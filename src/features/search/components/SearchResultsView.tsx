"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { fetchColumns } from "@/features/columns/services/column.service";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { fetchArticles } from "@/shared/services/article.service";
import { toContentLocale } from "@/shared/utils/locale";

const SEARCH_LIMIT = 12;

function SearchSkeleton() {
  return (
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
  );
}

export function SearchResultsView() {
  const t = useTranslations("searchPage");
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const lang = toContentLocale(useLocale());

  const articlesQuery = useQuery({
    queryKey: ["search", "articles", { q: query, lang }],
    queryFn: () =>
      fetchArticles({
        page: 1,
        limit: SEARCH_LIMIT,
        search: query,
        sort: "latest",
        lang,
      }),
    enabled: query.length > 0,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });

  const columnsQuery = useQuery({
    queryKey: ["search", "columns", { q: query, lang }],
    queryFn: () =>
      fetchColumns({
        page: 1,
        limit: SEARCH_LIMIT,
        search: query,
        lang,
      }),
    enabled: query.length > 0,
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });

  const isLoading = articlesQuery.isLoading || columnsQuery.isLoading;
  const isError = articlesQuery.isError || columnsQuery.isError;
  const articles = articlesQuery.data?.items ?? [];
  const columns = columnsQuery.data?.items ?? [];
  const total =
    (articlesQuery.data?.total ?? 0) + (columnsQuery.data?.total ?? 0);

  return (
    <PageFrame>
      <FrameModule ariaLabelledby="search-hero-heading">
        <FramePageHero
          kicker={t("kicker")}
          lede={query ? t("ledeWithQuery", { query }) : t("lede")}
          title={query ? t("headlineWithQuery", { query }) : t("headline")}
          titleId="search-hero-heading"
        />
      </FrameModule>

      {!query ? (
        <FrameModule>
          <div className="bg-white p-5">
            <EmptyState message={t("emptyQuery")} />
          </div>
        </FrameModule>
      ) : null}

      {query && isLoading ? (
        <FrameModule>
          <SearchSkeleton />
        </FrameModule>
      ) : null}

      {query && isError ? (
        <FrameModule>
          <div className="bg-white p-5">
            <ErrorState
              message={
                articlesQuery.error?.message || columnsQuery.error?.message
              }
              onRetry={() => {
                void articlesQuery.refetch();
                void columnsQuery.refetch();
              }}
            />
          </div>
        </FrameModule>
      ) : null}

      {query && !isLoading && !isError && total === 0 ? (
        <FrameModule>
          <div className="bg-white p-5">
            <EmptyState message={t("emptyResults", { query })} />
          </div>
        </FrameModule>
      ) : null}

      {query && !isLoading && !isError && articles.length > 0 ? (
        <FrameModule ariaLabelledby="search-articles-heading">
          <FrameHeading
            id="search-articles-heading"
            subtitle={t("resultCount", {
              count: articlesQuery.data?.total ?? 0,
            })}
            title={t("articlesHeading")}
          />
          <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                article={article}
                className="bg-white p-5"
                key={article.id}
              />
            ))}
            <GridFillers count={articles.length} />
          </div>
        </FrameModule>
      ) : null}

      {query && !isLoading && !isError && columns.length > 0 ? (
        <FrameModule ariaLabelledby="search-columns-heading">
          <FrameHeading
            id="search-columns-heading"
            subtitle={t("resultCount", {
              count: columnsQuery.data?.total ?? 0,
            })}
            title={t("columnsHeading")}
          />
          <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((column) => (
              <ColumnCard column={column} key={column.id} />
            ))}
            <GridFillers count={columns.length} />
          </div>
        </FrameModule>
      ) : null}
    </PageFrame>
  );
}

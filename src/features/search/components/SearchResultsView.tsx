"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { fetchColumns } from "@/features/columns/services/column.service";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
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
    <>
      <section>
        <Container>
          <div className="border-b border-neutral-200 py-10 lg:py-12">
            <p className="kicker">{t("kicker")}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
              {query ? t("headlineWithQuery", { query }) : t("headline")}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
              {query ? t("ledeWithQuery", { query }) : t("lede")}
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="space-y-12">
          {!query ? <EmptyState message={t("emptyQuery")} /> : null}

          {query && isLoading ? <SearchSkeleton /> : null}

          {query && isError ? (
            <ErrorState
              message={
                articlesQuery.error?.message || columnsQuery.error?.message
              }
              onRetry={() => {
                void articlesQuery.refetch();
                void columnsQuery.refetch();
              }}
            />
          ) : null}

          {query && !isLoading && !isError && total === 0 ? (
            <EmptyState message={t("emptyResults", { query })} />
          ) : null}

          {query && !isLoading && !isError && articles.length > 0 ? (
            <div>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
                  {t("articlesHeading")}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {t("resultCount", { count: articlesQuery.data?.total ?? 0 })}
                </p>
              </div>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard article={article} key={article.id} />
                ))}
              </div>
            </div>
          ) : null}

          {query && !isLoading && !isError && columns.length > 0 ? (
            <div>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
                  {t("columnsHeading")}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {t("resultCount", { count: columnsQuery.data?.total ?? 0 })}
                </p>
              </div>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {columns.map((column) => (
                  <ColumnCard column={column} key={column.id} />
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

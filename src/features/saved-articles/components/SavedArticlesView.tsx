"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { SavedColumnCard } from "@/features/columns/components/SavedColumnCard";
import { useSavedColumnsPage } from "@/features/columns/hooks/useSavedColumnsPage";
import { SavedArticleCard } from "@/features/saved-articles/components/SavedArticleCard";
import { SavedArticlesSignInPrompt } from "@/features/saved-articles/components/SavedArticlesSignInPrompt";
import { useSavedArticlesPage } from "@/features/saved-articles/hooks/useSavedArticlesPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { SAVED_COLUMN_PAGE_LIMIT } from "@/features/columns/constants/column.constants";
import { SAVED_ARTICLE_PAGE_LIMIT } from "@/features/saved-articles/constants/saved-article.constants";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-3 border border-neutral-200 p-5" key={index}>
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SavedArticlesView() {
  const t = useTranslations("savedArticlesPage");
  const searchParams = useSearchParams();
  const articlesPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const columnsPage = Math.max(
    1,
    Number(searchParams.get("columnsPage")) || 1,
  );
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const articles = useSavedArticlesPage(articlesPage);
  const columns = useSavedColumnsPage(columnsPage);

  if (!isHydrated) {
    return (
      <Section>
        <Container>
          <GridSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <SavedArticlesSignInPrompt />
        </Container>
      </Section>
    );
  }

  const articlesLoading = articles.isLoading;
  const columnsLoading = columns.isLoading;
  const hasArticles = Boolean(articles.data?.items.length);
  const hasColumns = Boolean(columns.data?.items.length);
  const bothEmpty =
    !articlesLoading &&
    !columnsLoading &&
    !articles.isError &&
    !columns.isError &&
    !hasArticles &&
    !hasColumns;

  return (
    <Section>
      <Container className="space-y-14">
        <section aria-labelledby="saved-articles-heading">
          <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
            <h2
              className="text-lg font-bold uppercase tracking-wide text-ink"
              id="saved-articles-heading"
            >
              {t("listingHeading")}
            </h2>
            {articles.data ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t("count", { count: articles.data.total })}
              </p>
            ) : null}
          </div>

          {articlesLoading ? <GridSkeleton /> : null}

          {articles.isError ? (
            <ErrorState
              message={articles.error?.message}
              onRetry={() => void articles.refetch()}
            />
          ) : null}

          {!articlesLoading && !articles.isError && !hasArticles ? (
            <EmptyState message={t("emptyArticles")} />
          ) : null}

          {!articlesLoading && !articles.isError && hasArticles && articles.data ? (
            <div className="space-y-8">
              <div className="grid min-h-[28rem] gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.data.items.map((article) => (
                  <SavedArticleCard article={article} key={article.id} />
                ))}
              </div>
              <Pagination
                basePath="/saved"
                currentPage={articles.data.page}
                itemLabel="articles"
                pageParam="page"
                pageSize={articles.data.limit || SAVED_ARTICLE_PAGE_LIMIT}
                totalItems={articles.data.total}
                totalPages={articles.data.totalPages}
              />
            </div>
          ) : null}
        </section>

        <section aria-labelledby="saved-columns-heading">
          <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
            <h2
              className="text-lg font-bold uppercase tracking-wide text-ink"
              id="saved-columns-heading"
            >
              {t("columnsHeading")}
            </h2>
            {columns.data ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t("columnsCount", { count: columns.data.total })}
              </p>
            ) : null}
          </div>

          {columnsLoading ? <GridSkeleton /> : null}

          {columns.isError ? (
            <ErrorState
              message={columns.error?.message}
              onRetry={() => void columns.refetch()}
            />
          ) : null}

          {!columnsLoading && !columns.isError && !hasColumns ? (
            <EmptyState message={t("emptyColumns")} />
          ) : null}

          {!columnsLoading && !columns.isError && hasColumns && columns.data ? (
            <div className="space-y-8">
              <div className="grid min-h-[28rem] gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {columns.data.items.map((column) => (
                  <SavedColumnCard column={column} key={column.id} />
                ))}
              </div>
              <Pagination
                basePath="/saved"
                currentPage={columns.data.page}
                itemLabel="items"
                pageParam="columnsPage"
                pageSize={columns.data.limit || SAVED_COLUMN_PAGE_LIMIT}
                totalItems={columns.data.total}
                totalPages={columns.data.totalPages}
              />
            </div>
          ) : null}
        </section>

        {bothEmpty ? (
          <p className="sr-only">{t("empty")}</p>
        ) : null}
      </Container>
    </Section>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { SavedColumnCard } from "@/features/columns/components/SavedColumnCard";
import { useSavedColumnsPage } from "@/features/columns/hooks/useSavedColumnsPage";
import { SavedArticleCard } from "@/features/saved-articles/components/SavedArticleCard";
import { SavedArticlesSignInPrompt } from "@/features/saved-articles/components/SavedArticlesSignInPrompt";
import { useSavedArticlesPage } from "@/features/saved-articles/hooks/useSavedArticlesPage";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { SAVED_COLUMN_PAGE_LIMIT } from "@/features/columns/constants/column.constants";
import { SAVED_ARTICLE_PAGE_LIMIT } from "@/features/saved-articles/constants/saved-article.constants";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function GridSkeleton() {
  return (
    <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-3 bg-white p-5" key={index}>
          <Skeleton className="aspect-[16/9] w-full" />
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
      <>
        <FrameModule>
          <GridSkeleton />
        </FrameModule>
        <FrameModule>
          <GridSkeleton />
        </FrameModule>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <FrameModule>
        <div className="bg-white p-5">
          <SavedArticlesSignInPrompt />
        </div>
      </FrameModule>
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

  if(bothEmpty) return <FrameModule><div className="p-5"><EmptyState message={t("empty")}/></div></FrameModule>;

  return (
    <>
      <FrameModule ariaLabelledby="saved-articles-heading">
        <FrameHeading
          id="saved-articles-heading"
          subtitle={
            articles.data
              ? t("count", { count: articles.data.total })
              : undefined
          }
          title={t("listingHeading")}
        />

        {articlesLoading ? <GridSkeleton /> : null}

        {articles.isError ? (
          <div className="bg-white p-5">
            <ErrorState
              message={articles.error?.message}
              onRetry={() => void articles.refetch()}
            />
          </div>
        ) : null}

        {!articlesLoading && !articles.isError && !hasArticles ? (
          <div className="bg-white p-5">
            <EmptyState message={t("emptyArticles")} />
          </div>
        ) : null}

        {!articlesLoading &&
        !articles.isError &&
        hasArticles &&
        articles.data ? (
          <>
            <AdaptiveCardGrid
              items={articles.data.items}
              keyForItem={(article) => article.id}
              renderItem={(article) => <SavedArticleCard article={article} />}
            />
            {articles.data.totalPages > 1 ? (
              <div className="bg-white p-5">
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
          </>
        ) : null}
      </FrameModule>

      <FrameModule ariaLabelledby="saved-columns-heading">
        <FrameHeading
          id="saved-columns-heading"
          subtitle={
            columns.data
              ? t("columnsCount", { count: columns.data.total })
              : undefined
          }
          title={t("columnsHeading")}
        />

        {columnsLoading ? <GridSkeleton /> : null}

        {columns.isError ? (
          <div className="bg-white p-5">
            <ErrorState
              message={columns.error?.message}
              onRetry={() => void columns.refetch()}
            />
          </div>
        ) : null}

        {!columnsLoading && !columns.isError && !hasColumns ? (
          <div className="bg-white p-5">
            <EmptyState message={t("emptyColumns")} />
          </div>
        ) : null}

        {!columnsLoading && !columns.isError && hasColumns && columns.data ? (
          <>
            <AdaptiveCardGrid
              items={columns.data.items}
              keyForItem={(column) => column.id}
              renderItem={(column) => <SavedColumnCard column={column} />}
            />
            {columns.data.totalPages > 1 ? (
              <div className="bg-white p-5">
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
          </>
        ) : null}

        {bothEmpty ? <p className="sr-only">{t("empty")}</p> : null}
      </FrameModule>
    </>
  );
}

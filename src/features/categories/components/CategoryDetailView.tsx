"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCategoryDetail } from "@/features/categories/hooks/useCategoryDetail";
import { CategoryDesk } from "@/features/categories/components/CategoryDesk";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { TaxonomyLocaleShell } from "@/shared/components/common/TaxonomyLocaleShell";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { TAXONOMY_ARTICLES_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

interface CategoryDetailViewProps {
  slug: string;
}

function ArticlesSkeleton() {
  return (
    <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
          <Skeleton className="aspect-[16/9] w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function CategoryDetailView({ slug }: CategoryDetailViewProps) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { categoryQuery, articlesQuery } = useCategoryDetail(slug, page);
  const t = useTranslations("categoriesPage");

  const isLoading = categoryQuery.isLoading || articlesQuery.isLoading;
  const isError = categoryQuery.isError || articlesQuery.isError;
  const error = categoryQuery.error ?? articlesQuery.error;

  function handleRetry() {
    void categoryQuery.refetch();
    void articlesQuery.refetch();
  }

  const heroTitle = categoryQuery.data
    ? categoryQuery.data.name
    : categoryQuery.isLoading
      ? "…"
      : t("notFound");

  const articleItems =
    !isLoading && !isError ? articlesQuery.data?.items ?? [] : [];

  const content = (
    <PageFrame>
      <FrameModule ariaLabelledby="category-detail-heading">
        <FramePageHero
          className="py-5 lg:py-6 sm:[&_h1]:text-[44px]"
          title={heroTitle}
          titleId="category-detail-heading"
        />
      </FrameModule>

      <FrameModule ariaLabelledby="category-articles-heading">
        <h2 className="sr-only" id="category-articles-heading">
          {t("articlesHeading")}
        </h2>

        {isLoading ? <ArticlesSkeleton /> : null}

        {isError ? (
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <ErrorState message={error?.message} onRetry={handleRetry} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        categoryQuery.data &&
        !articlesQuery.data?.items.length && page !== 1 ? (
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <EmptyState message={t("noArticles")} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        categoryQuery.data &&
        articlesQuery.data ? (
          <>
            {page === 1 ? (
              <CategoryDesk category={categoryQuery.data} articles={articleItems} />
            ) : (
              <div className="editorial-gutter p-4 md:p-6">
                <ArticleTimeline articles={articleItems} />
              </div>
            )}

          {articlesQuery.data.totalPages > 1 ? (
              <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
                <Pagination
                  basePath={`/categories/${slug}`}
                  currentPage={articlesQuery.data.page}
                  itemLabel="articles"
                  pageSize={
                    articlesQuery.data.limit || TAXONOMY_ARTICLES_PAGE_LIMIT
                  }
                  totalItems={articlesQuery.data.total}
                  totalPages={articlesQuery.data.totalPages}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </FrameModule>
    </PageFrame>
  );

  if (categoryQuery.data) {
    return (
      <TaxonomyLocaleShell entity={categoryQuery.data} kind="categories">
        {content}
      </TaxonomyLocaleShell>
    );
  }

  return content;
}

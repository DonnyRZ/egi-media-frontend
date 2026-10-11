"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCategoryDetail } from "@/features/categories/hooks/useCategoryDetail";
import { Link } from "@/i18n/navigation";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { TaxonomyLocaleShell } from "@/shared/components/common/TaxonomyLocaleShell";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { HEADER_CATEGORY_I18N_KEYS } from "@/shared/constants/header-categories.constants";
import { TAXONOMY_ARTICLES_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

interface CategoryDetailViewProps {
  slug: string;
}

function ArticlesSkeleton() {
  return (
    <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-3 bg-white p-5">
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
  const tHubs = useTranslations("categoryHubs");
  const tCommon = useTranslations("common");
  const hubKey = HEADER_CATEGORY_I18N_KEYS[slug];

  const isLoading = categoryQuery.isLoading || articlesQuery.isLoading;
  const isError = categoryQuery.isError || articlesQuery.isError;
  const error = categoryQuery.error ?? articlesQuery.error;

  function handleRetry() {
    void categoryQuery.refetch();
    void articlesQuery.refetch();
  }

  const categoryDescription =
    categoryQuery.data?.description ||
    (hubKey ? tHubs(`${hubKey}.lede`) : null);

  const heroTitle = categoryQuery.data
    ? hubKey
      ? tHubs(`${hubKey}.headline`)
      : categoryQuery.data.name
    : categoryQuery.isLoading
      ? "…"
      : t("notFound");

  const articleItems =
    !isLoading && !isError ? articlesQuery.data?.items ?? [] : [];
  const showFeatured = page === 1 && articleItems.length >= 3;
  const gridItems = showFeatured ? articleItems.slice(1) : articleItems;

  const content = (
    <PageFrame>
      <FrameModule ariaLabelledby="category-detail-heading">
        <FramePageHero
          kicker={
            categoryQuery.data
              ? hubKey
                ? tHubs(`${hubKey}.kicker`)
                : t("kicker")
              : undefined
          }
          leading={
            <Link
              className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
              href="/categories"
            >
              ← {t("backToCategories")}
            </Link>
          }
          lede={categoryQuery.data ? categoryDescription || undefined : undefined}
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
          <div className="bg-white p-5">
            <ErrorState message={error?.message} onRetry={handleRetry} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        categoryQuery.data &&
        !articlesQuery.data?.items.length ? (
          <div className="bg-white p-5">
            <EmptyState message={t("noArticles")} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        categoryQuery.data &&
        articlesQuery.data?.items.length ? (
          <>
            {showFeatured ? (
              <div className="border-b border-neutral-200 bg-white p-5">
                <p className="kicker">{t("featuredKicker")}</p>
                <div className="mt-3">
                  <ArticleCard article={articleItems[0]} variant="featured" />
                </div>
              </div>
            ) : null}

            {gridItems.length > 0 ? (
              <>
                <FrameHeading
                  id="category-articles-grid-heading"
                  subtitle={tCommon("articleCount", {
                    count: articlesQuery.data.total,
                  })}
                  title={t("articlesHeading")}
                />
                <AdaptiveCardGrid
                  items={gridItems}
                  keyForItem={(article) => article.id}
                  renderItem={(article) => (
                    <ArticleCard article={article} className="bg-white p-5" />
                  )}
                />
              </>
            ) : null}

            {articlesQuery.data.totalPages > 1 ? (
              <div className="bg-white p-5">
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

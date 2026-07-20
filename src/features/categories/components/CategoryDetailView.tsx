"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useCategoryDetail } from "@/features/categories/hooks/useCategoryDetail";
import { HeroFeaturedCard } from "@/features/hero-section/components/HeroFeaturedCard";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { HEADER_CATEGORY_I18N_KEYS } from "@/shared/constants/header-categories.constants";

interface CategoryDetailViewProps {
  slug: string;
}

function DetailSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border-b border-neutral-200 pb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
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

  return (
    <>
      <section
        aria-labelledby="category-detail-heading"
        className="border-b border-neutral-200 bg-neutral-50"
      >
        <Container className="py-8 lg:py-10">
          <Link
            className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
            href="/categories"
          >
            ← {t("backToCategories")}
          </Link>

          {categoryQuery.isLoading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ) : null}

          {categoryQuery.data ? (
            <>
              <p className="mt-4 kicker">
                {hubKey ? tHubs(`${hubKey}.kicker`) : t("kicker")}
              </p>
              <h1
                id="category-detail-heading"
                className="mt-2 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
              >
                {categoryQuery.data.name}
              </h1>
              {categoryDescription ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
                  {categoryDescription}
                </p>
              ) : null}
            </>
          ) : null}

          {!categoryQuery.isLoading &&
          !categoryQuery.isError &&
          categoryQuery.data === null ? (
            <h1
              id="category-detail-heading"
              className="mt-4 font-serif text-3xl font-bold text-ink"
            >
              {t("notFound")}
            </h1>
          ) : null}
        </Container>
      </section>

      <Section ariaLabelledby="category-articles-heading">
        <Container>
          <h2 id="category-articles-heading" className="sr-only">
            {t("articlesHeading")}
          </h2>

          {isLoading ? <DetailSkeleton /> : null}

          {isError ? (
            <ErrorState message={error?.message} onRetry={handleRetry} />
          ) : null}

          {!isLoading &&
          !isError &&
          categoryQuery.data &&
          !articlesQuery.data?.items.length ? (
            <EmptyState message={t("noArticles")} />
          ) : null}

          {!isLoading &&
          !isError &&
          categoryQuery.data &&
          articlesQuery.data?.items.length ? (
            <div className="space-y-10">
              {page === 1 ? (
                <div>
                  <p className="kicker">{t("featuredKicker")}</p>
                  <div className="mt-3">
                    <HeroFeaturedCard article={articlesQuery.data.items[0]} />
                  </div>
                </div>
              ) : null}

              {(page === 1
                ? articlesQuery.data.items.slice(1)
                : articlesQuery.data.items
              ).length > 0 ? (
                <div>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                      {t("articlesHeading")}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {tCommon("articleCount", {
                        count: articlesQuery.data.total,
                      })}
                    </p>
                  </div>
                  <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {(page === 1
                      ? articlesQuery.data.items.slice(1)
                      : articlesQuery.data.items
                    ).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ) : null}

              <Pagination
                basePath={`/categories/${slug}`}
                currentPage={articlesQuery.data.page}
                totalPages={articlesQuery.data.totalPages}
              />
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

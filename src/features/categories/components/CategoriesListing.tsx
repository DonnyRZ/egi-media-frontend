"use client";

import { useTranslations } from "next-intl";

import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { useCategoriesPage } from "@/features/categories/hooks/useCategoriesPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function CategoriesSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border border-neutral-200 p-6 lg:p-8">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid border border-neutral-200 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoriesListing() {
  const { data, isLoading, isError, error, refetch } = useCategoriesPage();
  const t = useTranslations("categoriesPage");

  return (
    <Section ariaLabelledby="categories-listing-heading" dense>
      <Container>
        <h2 id="categories-listing-heading" className="sr-only">
          {t("listingHeading")}
        </h2>

        {isLoading ? <CategoriesSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-10">
            <CategoryCard category={data.items[0]} variant="featured" />

            {data.items.length > 1 ? (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                    {t("allCategories")}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t("categoryCount", { count: data.total })}
                  </p>
                </div>
                <div className="grid border border-neutral-200 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
                  {data.items.slice(1).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

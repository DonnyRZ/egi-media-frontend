"use client";

import { useTranslations } from "next-intl";

import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { useCategoriesPage } from "@/features/categories/hooks/useCategoriesPage";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function CategoriesSkeleton() {
  return (
    <>
      <div className="bg-white p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-3 h-10 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 bg-white p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </>
  );
}

export function CategoriesListing() {
  const { data, isLoading, isError, error, refetch } = useCategoriesPage();
  const t = useTranslations("categoriesPage");

  const items = !isLoading && !isError ? data?.items ?? [] : [];
  const gridItems = items;

  return (
    <FrameModule ariaLabelledby="categories-listing-heading">
      <h2 className="sr-only" id="categories-listing-heading">
        {t("listingHeading")}
      </h2>

      {isLoading ? <CategoriesSkeleton /> : null}

      {isError ? (
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && !data?.items.length ? (
        <div className="bg-white p-5">
          <EmptyState message={t("empty")} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <>
          <FrameHeading
            id="categories-grid-heading"
            subtitle={t("categoryCount", { count: data.total })}
            title={t("allCategories")}
          />
          <AdaptiveCardGrid
            items={gridItems}
            keyForItem={(category) => category.id}
            renderItem={(category) => <CategoryCard category={category} />}
          />
        </>
      ) : null}
    </FrameModule>
  );
}

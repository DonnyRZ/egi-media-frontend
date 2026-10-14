"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { useCategoryNews } from "@/features/homepage/hooks/useCategoryNews";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { cn } from "@/shared/lib/cn";
import type { CategoryNewsGroup } from "@/shared/types/category.types";

function CategoryColumn({ group }: { group: CategoryNewsGroup }) {
  return (
    <div className="editorial-gutter min-w-0 bg-white px-4 py-5 md:p-5">
      <div className="mb-4 border-b border-neutral-200 pb-2">
        <p className="kicker">
          <Link
            className="transition-colors hover:text-accent"
            href={`/categories/${group.category.slug}`}
          >
            {group.category.name}
          </Link>
        </p>
        {group.category.description ? (
          <p className="editorial-summary mt-1 line-clamp-2 text-sm text-neutral-500">
            {group.category.description}
          </p>
        ) : null}
      </div>
      <div className="space-y-5">
        {group.articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}

export function CategoryNewsSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useCategoryNews();
  const t = useTranslations("categories");
  const itemCount = (data?.length ?? 0);
  const gridColumns =
    itemCount === 1
      ? "grid-cols-1"
      : itemCount === 2
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  if (!isLoading && !isError && !sectionFailed && !data?.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="categories-heading" className="homepage-desktop-section">
      <HomepageSectionNotice section="categories" />
      <FrameHeading
        id="categories-heading"
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="editorial-gutter space-y-4 bg-white px-4 py-5 md:p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
          <GridFillers count={3} />
        </div>
      ) : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className={cn("grid gap-px bg-neutral-200", gridColumns)}>
          {data.map((group) => (
            <CategoryColumn key={group.category.id} group={group} />
          ))}
          {itemCount >= 3 ? <GridFillers count={itemCount} /> : null}
        </div>
      ) : null}
    </FrameModule>
  );
}

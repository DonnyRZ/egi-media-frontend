"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { useColumnsPage } from "@/features/columns/hooks/useColumnsPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ColumnsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Skeleton className="aspect-[16/10] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="space-y-3" key={index}>
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColumnsListing() {
  const t = useTranslations("columnsPage");
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useColumnsPage(page);

  return (
    <Section ariaLabelledby="columns-listing-heading" className="pt-8 lg:pt-10">
      <Container>
        <h2 className="sr-only" id="columns-listing-heading">
          {t("listingHeading")}
        </h2>

        {isLoading ? <ColumnsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-10">
            <ColumnCard column={data.items[0]} variant="featured" />

            {data.items.length > 1 ? (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                    {t("allColumns")}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t("columnCount", { count: data.total })}
                  </p>
                </div>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.slice(1).map((column) => (
                    <ColumnCard column={column} key={column.id} />
                  ))}
                </div>
              </div>
            ) : null}

            <Pagination
              basePath="/kolom"
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

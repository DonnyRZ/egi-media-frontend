"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { COLUMNS_PAGE_LIMIT } from "@/features/columns/constants/column.constants";
import { useColumnsPage } from "@/features/columns/hooks/useColumnsPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function ColumnsSkeleton() {
  return (
    <>
      <div className="grid gap-px bg-neutral-200 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-white p-5">
          <Skeleton className="aspect-[16/10] w-full" />
        </div>
        <div className="space-y-3 bg-white p-5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="space-y-3 bg-white p-5" key={index}>
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}

export function ColumnsListing() {
  const t = useTranslations("columnsPage");
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { data, isLoading, isError, error, refetch } = useColumnsPage(page);

  const gridItems =
    !isLoading && !isError && data?.items.length
      ? page === 1
        ? data.items.slice(1)
        : data.items
      : [];

  return (
    <FrameModule ariaLabelledby="columns-listing-heading">
      <h2 className="sr-only" id="columns-listing-heading">
        {t("listingHeading")}
      </h2>

      {isLoading ? <ColumnsSkeleton /> : null}

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
          {page === 1 ? (
            <div className="border-b border-neutral-200 bg-white">
              <ColumnCard column={data.items[0]} variant="featured" />
            </div>
          ) : null}

          {gridItems.length > 0 ? (
            <>
              <FrameHeading
                id="columns-grid-heading"
                subtitle={t("columnCount", { count: data.total })}
                title={page === 1 ? t("allColumns") : t("listingHeading")}
              />
              <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((column) => (
                  <ColumnCard column={column} key={column.id} />
                ))}
                <GridFillers count={gridItems.length} />
              </div>
            </>
          ) : null}

          <div className="bg-white p-5">
            <Pagination
              basePath="/kolom"
              currentPage={data.page}
              itemLabel="items"
              pageSize={data.limit || COLUMNS_PAGE_LIMIT}
              totalItems={data.total}
              totalPages={data.totalPages}
            />
          </div>
        </>
      ) : null}
    </FrameModule>
  );
}

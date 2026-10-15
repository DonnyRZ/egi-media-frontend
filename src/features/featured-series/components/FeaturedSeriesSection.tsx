"use client";

import { useTranslations } from "next-intl";

import { SeriesCard } from "@/features/series/components/SeriesCard";
import { useFeaturedSeries } from "@/features/homepage/hooks/useFeaturedSeries";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export function FeaturedSeriesSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedSeries();
  const t = useTranslations("series");

  if (!isLoading && !isError && !data?.items.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="series-heading" className="homepage-desktop-section">
      <FrameHeading
        actionHref="/series"
        id="series-heading"
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
              <Skeleton className="aspect-[16/9] w-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-3/4" />
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

      {!isLoading && !isError && data?.items.length ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.slice(0, 3).map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
          <GridFillers count={Math.min(data.items.length, 3)} />
        </div>
      ) : null}
    </FrameModule>
  );
}

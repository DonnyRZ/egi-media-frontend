"use client";

import { useTranslations } from "next-intl";

import { SeriesCard } from "@/features/series/components/SeriesCard";
import { useSeriesPage } from "@/features/series/hooks/useSeriesPage";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function SeriesSkeleton() {
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
          <div key={index} className="space-y-3">
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

export function SeriesListing() {
  const { data, isLoading, isError, error, refetch } = useSeriesPage();
  const t = useTranslations("seriesPage");

  return (
    <Section ariaLabelledby="series-listing-heading">
      <Container>
        <h2 id="series-listing-heading" className="sr-only">
          {t("listingHeading")}
        </h2>

        {isLoading ? <SeriesSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-10">
            <SeriesCard series={data.items[0]} variant="featured" />

            {data.items.length > 1 ? (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                    {t("allSeries")}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t("seriesCount", { count: data.total })}
                  </p>
                </div>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.slice(1).map((series) => (
                    <SeriesCard key={series.id} series={series} />
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

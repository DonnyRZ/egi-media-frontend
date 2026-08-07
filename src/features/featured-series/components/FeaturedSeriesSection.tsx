"use client";

import { useTranslations } from "next-intl";

import { SeriesCard } from "@/features/series/components/SeriesCard";
import { useFeaturedSeries } from "@/features/homepage/hooks/useFeaturedSeries";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export function FeaturedSeriesSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedSeries();
  const t = useTranslations("series");

  return (
    <Section ariaLabelledby="series-heading" dense>
      <Container>
        <SectionHeading
          actionHref="/series"
          id="series-heading"
          subtitle={t("subtitle")}
          title={t("title")}
        />

        {isLoading ? (
          <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3 bg-white p-5">
                <Skeleton className="aspect-[16/10] w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
            <GridFillers count={3} />
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.slice(0, 3).map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
            <GridFillers count={Math.min(data.items.length, 3)} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

"use client";

import Link from "next/link";

import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useFeaturedSeries } from "@/features/homepage/hooks/useFeaturedSeries";
import type { Series } from "@/shared/types/series.types";

function SeriesCard({ series }: { series: Series }) {
  return (
    <article className="w-72 shrink-0 rounded-xl border border-neutral-300 bg-white p-6 shadow-sm">
      <div className="flex h-32 items-center justify-center rounded-lg bg-primary-100 text-3xl font-bold text-primary-700">
        {series.name.slice(0, 1)}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">
        <Link href={`/series/${series.slug}`}>{series.name}</Link>
      </h3>
      {series.description ? (
        <p className="mt-2 line-clamp-3 text-sm text-neutral-700">{series.description}</p>
      ) : null}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {series.articleCount} articles
      </p>
    </article>
  );
}

export function FeaturedSeriesSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedSeries();

  return (
    <Section ariaLabelledby="series-heading">
      <Container>
        <SectionHeading
          id="series-heading"
          subtitle="Deep-dive editorial collections curated by our newsroom."
          title="Featured Series"
        />

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-72 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message="Series will appear here once published." />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {data.items.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

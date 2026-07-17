"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useFeaturedSeries } from "@/features/homepage/hooks/useFeaturedSeries";
import type { Series } from "@/shared/types/series.types";

function SeriesCard({ series }: { series: Series }) {
  const t = useTranslations("series");
  const tCommon = useTranslations("common");

  return (
    <article className="group w-72 shrink-0 border-t-2 border-ink pt-4">
      <div className="flex h-32 items-center justify-center bg-neutral-100 font-serif text-5xl font-bold text-ink">
        {series.name.slice(0, 1)}
      </div>
      <span className="kicker mt-4 block">{t("kicker")}</span>
      <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-ink group-hover:text-accent">
        <Link href={`/series/${series.slug}`}>{series.name}</Link>
      </h3>
      {series.description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
          {series.description}
        </p>
      ) : null}
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {tCommon("articleCount", { count: series.articleCount })}
      </p>
    </article>
  );
}

export function FeaturedSeriesSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedSeries();
  const t = useTranslations("series");

  return (
    <Section ariaLabelledby="series-heading">
      <Container>
        <SectionHeading
          actionHref="/series"
          id="series-heading"
          subtitle={t("subtitle")}
          title={t("title")}
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
          <EmptyState message={t("empty")} />
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

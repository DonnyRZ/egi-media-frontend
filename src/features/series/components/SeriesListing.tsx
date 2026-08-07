"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { SeriesCard } from "@/features/series/components/SeriesCard";
import { useSeriesPage } from "@/features/series/hooks/useSeriesPage";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { HorizontalScroller } from "@/shared/components/common/HorizontalScroller";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { groupSeriesByTopic } from "@/shared/utils/taxonomy-groups";

function SeriesSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-5">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div key={cardIndex} className="w-60 shrink-0 space-y-3">
                <Skeleton className="aspect-[16/10] w-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeriesListing() {
  const { data, isLoading, isError, error, refetch } = useSeriesPage();
  const t = useTranslations("seriesPage");

  const groups = useMemo(
    () => (data?.items.length ? groupSeriesByTopic(data.items) : []),
    [data?.items],
  );

  return (
    <Section ariaLabelledby="series-listing-heading" className="pt-8 lg:pt-10">
      <Container className="min-w-0">
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

        {!isLoading && !isError && groups.length ? (
          <div className="min-w-0 space-y-12">
            <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
              <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                {t("allSeries")}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t("seriesCount", { count: data?.total ?? 0 })}
              </p>
            </div>

            {groups.map((group) => {
              const title = group.topic?.name ?? t("ungroupedTopic");
              const headingId = `series-topic-${group.topic?.id ?? "other"}`;

              return (
                <section
                  aria-labelledby={headingId}
                  className="min-w-0"
                  key={group.topic?.id ?? "ungrouped"}
                >
                  <HorizontalScroller
                    ariaLabel={title}
                    heading={
                      <div>
                        <p className="kicker">{t("kicker")}</p>
                        <h3
                          className="mt-1 font-serif text-xl font-bold text-ink sm:text-2xl"
                          id={headingId}
                        >
                          {group.topic ? (
                            <Link
                              className="transition-colors hover:text-accent"
                              href={`/topics/${group.topic.slug}`}
                            >
                              {title}
                            </Link>
                          ) : (
                            title
                          )}
                        </h3>
                      </div>
                    }
                    trailing={
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        {t("seriesInTopic", { count: group.items.length })}
                      </p>
                    }
                  >
                    {group.items.map((series) => (
                      <div
                        className="w-60 shrink-0 snap-start sm:w-72"
                        key={series.id}
                        role="listitem"
                      >
                        <SeriesCard series={series} />
                      </div>
                    ))}
                  </HorizontalScroller>
                </section>
              );
            })}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { SeriesCard } from "@/features/series/components/SeriesCard";
import { useSeriesPage } from "@/features/series/hooks/useSeriesPage";
import { Link } from "@/i18n/navigation";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { HorizontalScroller } from "@/shared/components/common/HorizontalScroller";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { SERIES_PAGE_LIMIT } from "@/shared/constants/series.constants";
import { useVisibleGroups } from "@/shared/hooks/useVisibleGroups";
import { groupSeriesByTopic } from "@/shared/utils/taxonomy-groups";

function SeriesSkeleton() {
  return (
    <div className="space-y-5 bg-white p-5">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-5">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="w-60 shrink-0 space-y-3 border border-neutral-200 p-5"
              >
                <Skeleton className="aspect-[16/9] w-full" />
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
  const { visibleGroups, hiddenCount, revealAll } = useVisibleGroups(groups);

  if (isLoading) {
    return (
      <FrameModule ariaLabelledby="series-listing-heading">
        <h2 className="sr-only" id="series-listing-heading">
          {t("listingHeading")}
        </h2>
        <SeriesSkeleton />
      </FrameModule>
    );
  }

  if (isError) {
    return (
      <FrameModule ariaLabelledby="series-listing-heading">
        <h2 className="sr-only" id="series-listing-heading">
          {t("listingHeading")}
        </h2>
        <div className="bg-white p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      </FrameModule>
    );
  }

  if (!data?.items.length) {
    return (
      <FrameModule ariaLabelledby="series-listing-heading">
        <h2 className="sr-only" id="series-listing-heading">
          {t("listingHeading")}
        </h2>
        <div className="bg-white p-5">
          <EmptyState message={t("empty")} />
        </div>
      </FrameModule>
    );
  }

  return (
    <>
      <FrameModule ariaLabelledby="series-listing-heading">
        <FrameHeading
          id="series-listing-heading"
          subtitle={
            data.total > SERIES_PAGE_LIMIT
              ? t("truncatedCount", { shown: data.items.length, total: data.total })
              : t("seriesCount", { count: data.total })
          }
          title={t("allSeries")}
        />
      </FrameModule>

      {visibleGroups.map((group) => {
        const title = group.topic?.name ?? t("ungroupedTopic");
        const headingId = `series-topic-${group.topic?.id ?? "other"}`;
        const heading = (
          <div>
            <p className="kicker">{t("kicker")}</p>
            <h3
              className="mt-1 font-sans text-xl font-bold text-ink sm:text-2xl"
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
        );

        return (
          <FrameModule ariaLabelledby={headingId} key={group.topic?.id ?? "ungrouped"}>
            {group.items.length < 4 ? (
              <div className="min-w-0 space-y-5 bg-white p-5">
                {heading}
                <AdaptiveCardGrid
                  items={group.items}
                  keyForItem={(series) => series.id}
                  renderItem={(series) => <SeriesCard series={series} />}
                />
              </div>
            ) : (
              <div className="min-w-0 bg-white p-5">
                <HorizontalScroller
                  ariaLabel={title}
                  heading={heading}
                  trailing={
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t("seriesInTopic", { count: group.items.length })}
                    </p>
                  }
                >
                  {group.items.map((series) => (
                    <div
                      className="w-60 shrink-0 snap-start border border-neutral-200 sm:w-72"
                      key={series.id}
                      role="listitem"
                    >
                      <SeriesCard series={series} />
                    </div>
                  ))}
                </HorizontalScroller>
              </div>
            )}
          </FrameModule>
        );
      })}

      {hiddenCount > 0 && (
        <FrameModule ariaLabelledby="series-listing-heading">
          <div className="flex justify-center bg-white p-5">
            <Button onClick={revealAll} variant="secondary">
              {t("revealMoreGroups", { count: hiddenCount })}
            </Button>
          </div>
        </FrameModule>
      )}
    </>
  );
}

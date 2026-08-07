"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { TopicCard } from "@/features/topics/components/TopicCard";
import { useTopicsPage } from "@/features/topics/hooks/useTopicsPage";
import { Link } from "@/i18n/navigation";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { HorizontalScroller } from "@/shared/components/common/HorizontalScroller";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { groupTopicsByCategory } from "@/shared/utils/taxonomy-groups";

function TopicsSkeleton() {
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
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopicsListing() {
  const { data, isLoading, isError, error, refetch } = useTopicsPage();
  const t = useTranslations("topicsPage");

  const groups = useMemo(
    () => (data?.items.length ? groupTopicsByCategory(data.items) : []),
    [data?.items],
  );

  if (isLoading) {
    return (
      <FrameModule ariaLabelledby="topics-listing-heading">
        <h2 className="sr-only" id="topics-listing-heading">
          {t("listingHeading")}
        </h2>
        <TopicsSkeleton />
      </FrameModule>
    );
  }

  if (isError) {
    return (
      <FrameModule ariaLabelledby="topics-listing-heading">
        <h2 className="sr-only" id="topics-listing-heading">
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
      <FrameModule ariaLabelledby="topics-listing-heading">
        <h2 className="sr-only" id="topics-listing-heading">
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
      <FrameModule ariaLabelledby="topics-listing-heading">
        <FrameHeading
          id="topics-listing-heading"
          subtitle={t("topicCount", { count: data.total })}
          title={t("allTopics")}
        />
      </FrameModule>

      {groups.map((group) => {
        const title = group.category?.name ?? t("ungroupedCategory");
        const headingId = `topics-category-${group.category?.id ?? "other"}`;
        const heading = (
          <div>
            <p className="kicker">{t("kicker")}</p>
            <h3
              className="mt-1 font-serif text-xl font-bold text-ink sm:text-2xl"
              id={headingId}
            >
              {group.category ? (
                <Link
                  className="transition-colors hover:text-accent"
                  href={`/categories/${group.category.slug}`}
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
          <FrameModule ariaLabelledby={headingId} key={group.category?.id ?? "ungrouped"}>
            {group.items.length < 4 ? (
              <div className="min-w-0 space-y-5 bg-white p-5">
                {heading}
                <AdaptiveCardGrid
                  items={group.items}
                  keyForItem={(topic) => topic.id}
                  renderItem={(topic) => (
                    <div className="bg-white">
                      <TopicCard topic={topic} />
                    </div>
                  )}
                />
              </div>
            ) : (
              <div className="min-w-0 bg-white p-5">
                <HorizontalScroller
                  ariaLabel={title}
                  heading={heading}
                  trailing={
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {t("topicsInCategory", { count: group.items.length })}
                    </p>
                  }
                >
                  {group.items.map((topic) => (
                    <div
                      className="w-60 shrink-0 snap-start border border-neutral-200 sm:w-72"
                      key={topic.id}
                      role="listitem"
                    >
                      <TopicCard topic={topic} />
                    </div>
                  ))}
                </HorizontalScroller>
              </div>
            )}
          </FrameModule>
        );
      })}
    </>
  );
}

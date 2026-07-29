"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { TopicCard } from "@/features/topics/components/TopicCard";
import { useTopicsPage } from "@/features/topics/hooks/useTopicsPage";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { HorizontalScroller } from "@/shared/components/common/HorizontalScroller";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { groupTopicsByCategory } from "@/shared/utils/taxonomy-groups";

function TopicsSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-5">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="w-72 shrink-0 space-y-3 border-t-2 border-ink pt-4"
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

  return (
    <Section ariaLabelledby="topics-listing-heading">
      <Container className="min-w-0">
        <h2 id="topics-listing-heading" className="sr-only">
          {t("listingHeading")}
        </h2>

        {isLoading ? <TopicsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && groups.length ? (
          <div className="min-w-0 space-y-12">
            <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
              <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                {t("allTopics")}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {t("topicCount", { count: data?.total ?? 0 })}
              </p>
            </div>

            {groups.map((group) => {
              const title = group.category?.name ?? t("ungroupedCategory");
              const headingId = `topics-category-${group.category?.id ?? "other"}`;

              return (
                <section
                  aria-labelledby={headingId}
                  className="min-w-0"
                  key={group.category?.id ?? "ungrouped"}
                >
                  <HorizontalScroller
                    ariaLabel={title}
                    heading={
                      <div>
                        <p className="kicker">{t("kicker")}</p>
                        <h3
                          className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl"
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
                    }
                    trailing={
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                        {t("topicsInCategory", { count: group.items.length })}
                      </p>
                    }
                  >
                    {group.items.map((topic) => (
                      <div
                        className="w-[17.5rem] shrink-0 snap-start sm:w-80"
                        key={topic.id}
                        role="listitem"
                      >
                        <TopicCard topic={topic} />
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

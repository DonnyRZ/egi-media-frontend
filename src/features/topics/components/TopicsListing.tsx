"use client";

import { useTranslations } from "next-intl";

import { TopicCard } from "@/features/topics/components/TopicCard";
import { useTopicsPage } from "@/features/topics/hooks/useTopicsPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function TopicsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border-b-2 border-ink pb-8">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 border-t-2 border-ink pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopicsListing() {
  const { data, isLoading, isError, error, refetch } = useTopicsPage();
  const t = useTranslations("topicsPage");

  return (
    <Section ariaLabelledby="topics-listing-heading">
      <Container>
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

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-10">
            <TopicCard topic={data.items[0]} variant="featured" />

            {data.items.length > 1 ? (
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                    {t("allTopics")}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t("topicCount", { count: data.total })}
                  </p>
                </div>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.slice(1).map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
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

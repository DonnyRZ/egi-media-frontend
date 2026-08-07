"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ForYouEmptyState } from "@/features/for-you/components/ForYouEmptyState";
import { ForYouGuestCta } from "@/features/for-you/components/ForYouGuestCta";
import { PERSONALIZED_FEED_PAGE_LIMIT } from "@/features/for-you/constants/for-you.constants";
import { usePersonalizedFeed } from "@/features/for-you/hooks/usePersonalizedFeed";
import { useMyTopicSubscriptions } from "@/features/topic-subscriptions/hooks/useMyTopicSubscriptions";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function FeedSkeleton() {
  return (
    <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="space-y-3" key={index}>
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ForYouListing() {
  const t = useTranslations("forYouPage");
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const feed = usePersonalizedFeed(page, PERSONALIZED_FEED_PAGE_LIMIT);
  const subscriptions = useMyTopicSubscriptions();

  if (!isHydrated) {
    return (
      <Section>
        <Container>
          <FeedSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <ForYouGuestCta />
        </Container>
      </Section>
    );
  }

  const hasSubscriptions = Boolean(subscriptions.data?.total);
  const hasItems = Boolean(feed.data?.items.length);
  const isLoading = feed.isLoading || subscriptions.isLoading;

  return (
    <Section ariaLabelledby="for-you-listing-heading" className="pt-8 lg:pt-10">
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
          <h2
            className="text-lg font-bold uppercase tracking-wide text-ink"
            id="for-you-listing-heading"
          >
            {t("listingHeading")}
          </h2>
          {feed.data ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t("count", { count: feed.data.total })}
            </p>
          ) : null}
        </div>

        {isLoading ? <FeedSkeleton /> : null}

        {feed.isError ? (
          <ErrorState
            message={feed.error?.message}
            onRetry={() => void feed.refetch()}
          />
        ) : null}

        {!isLoading && !feed.isError && (!hasSubscriptions || !hasItems) ? (
          <ForYouEmptyState />
        ) : null}

        {!isLoading && !feed.isError && hasItems && feed.data ? (
          <div className="space-y-8">
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {feed.data.items.map((article) => (
                <ArticleCard article={article} key={article.id} />
              ))}
            </div>
            <Pagination
              basePath="/for-you"
              currentPage={feed.data.page}
              totalPages={feed.data.totalPages}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

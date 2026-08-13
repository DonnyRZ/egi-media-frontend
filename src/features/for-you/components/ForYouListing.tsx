"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ForYouEmptyState } from "@/features/for-you/components/ForYouEmptyState";
import { ForYouGuestCta } from "@/features/for-you/components/ForYouGuestCta";
import { PERSONALIZED_FEED_PAGE_LIMIT } from "@/features/for-you/constants/for-you.constants";
import { usePersonalizedFeed } from "@/features/for-you/hooks/usePersonalizedFeed";
import { useMyTopicSubscriptions } from "@/features/topic-subscriptions/hooks/useMyTopicSubscriptions";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function FeedSkeleton() {
  return (
    <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="space-y-3 bg-white p-5" key={index}>
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
      <FrameModule>
        <FeedSkeleton />
      </FrameModule>
    );
  }

  if (!isAuthenticated) {
    return (
      <FrameModule>
        <div className="bg-white p-5">
          <ForYouGuestCta />
        </div>
      </FrameModule>
    );
  }

  const hasSubscriptions = Boolean(subscriptions.data?.total);
  const hasItems = Boolean(feed.data?.items.length);
  const isLoading = feed.isLoading || subscriptions.isLoading;

  return (
    <FrameModule ariaLabelledby="for-you-listing-heading">
      <FrameHeading
        id="for-you-listing-heading"
        subtitle={feed.data ? t("count", { count: feed.data.total }) : undefined}
        title={t("listingHeading")}
      />

      {isLoading ? <FeedSkeleton /> : null}

      {feed.isError ? (
        <div className="bg-white p-5">
          <ErrorState
            message={feed.error?.message}
            onRetry={() => void feed.refetch()}
          />
        </div>
      ) : null}

      {!isLoading && !feed.isError && (!hasSubscriptions || !hasItems) ? (
        <div className="bg-white p-5">
          <ForYouEmptyState />
        </div>
      ) : null}

      {!isLoading && !feed.isError && hasItems && feed.data ? (
        <>
          <AdaptiveCardGrid
            items={feed.data.items}
            keyForItem={(article) => article.id}
            renderItem={(article) => (
              <ArticleCard article={article} className="bg-white p-5" />
            )}
          />
          {feed.data.totalPages > 1 ? (
            <div className="bg-white p-5">
              <Pagination
                basePath="/for-you"
                currentPage={feed.data.page}
                totalPages={feed.data.totalPages}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </FrameModule>
  );
}

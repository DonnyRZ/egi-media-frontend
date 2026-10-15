"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { HomepageAdSkeleton } from "@/features/ads/components/HomepageAdSkeleton";
import { HomepageAdGrid } from "@/features/ads/components/HomepageAdGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { useLatestNews } from "@/features/homepage/hooks/useLatestNews";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";

export function LatestNewsSection() {
  const { data, isLoading, isError, error, refetch } = useLatestNews();
  const t = useTranslations("latest");


  const items = data?.items ?? [];

  return (
    <FrameModule ariaLabelledby="latest-heading" className="homepage-latest">
      <HomepageSectionNotice section="latest" />
      <FrameHeading
        actionHref="/latest"
        id="latest-heading"
        title={t("title")}
      />

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {isLoading ? <HomepageAdSkeleton placement="IN_FEED" /> : <HomepageAdGrid placement="IN_FEED" items={items.slice(0, HOMEPAGE_LIMITS.latestNews)}
        keyForItem={(article) => article.id} renderItem={(article) => <>
          <div className="latest-news-desktop"><ArticleCard article={article} className="editorial-gutter bg-white px-4 py-5 md:p-5" /></div>
          <div className="latest-news-mobile"><ArticleCard article={article} variant="horizontal" className="editorial-gutter bg-white px-4 py-3" /></div>
        </>} />}
    </FrameModule>
  );
}

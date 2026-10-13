"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { LatestNewsSkeleton } from "@/features/latest-news/components/LatestNewsSkeleton";
import { LatestArticleGrid } from "@/shared/components/common/LatestArticleGrid";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { useLatestNews } from "@/features/homepage/hooks/useLatestNews";

export function LatestNewsSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useLatestNews();
  const t = useTranslations("latest");

  if (!isLoading && !isError && !sectionFailed && !data?.items.length) {
    return null;
  }

  const items = data?.items ?? [];

  return (
    <FrameModule ariaLabelledby="latest-heading" className="homepage-latest">
      <HomepageSectionNotice section="latest" />
      <FrameHeading
        actionHref="/latest"
        id="latest-heading"
        subtitle={t("subtitle")}
        title={t("title")}
      />

      {isLoading ? <LatestNewsSkeleton /> : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && items.length ? (
        <LatestArticleGrid articles={items} />
      ) : null}
    </FrameModule>
  );
}

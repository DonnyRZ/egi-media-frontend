"use client";

import { HomepageSectionNotice } from "@/features/homepage/components/HomepageSectionNotice";
import { useTranslations } from "next-intl";

import { useTopicNews } from "@/features/homepage/hooks/useTopicNews";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { TopicNewsGroup } from "@/shared/types/topic.types";

function TopicBlock({ group }: { group: TopicNewsGroup }) {
  const [featured, ...rest] = group.articles;

  if (!featured) return null;

  return (
    <div className="editorial-gutter min-w-0 bg-white px-4 py-5 md:p-5">
      <div className="mb-4">
        <h3 className="editorial-card-title font-sans text-xl font-bold text-ink">
          <Link
            className="transition-colors hover:text-accent"
            href={`/topics/${group.topic.slug}`}
          >
            {group.topic.name}
          </Link>
        </h3>
      </div>

      <div className="space-y-5">
        <ArticleCard article={featured} variant="horizontal" />
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}

export function TopicNewsSection() {
  const { data, isLoading, isError, error, refetch, sectionFailed } = useTopicNews();
  const t = useTranslations("topics");

  if (!isLoading && !isError && !sectionFailed && !data?.length) {
    return null;
  }

  return (
    <FrameModule ariaLabelledby="topics-heading" className="homepage-desktop-section">
      <HomepageSectionNotice section="topics" />
      <FrameHeading
        actionHref="/topics"
        id="topics-heading"
        title={t("title")}
      />

      {isLoading ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="editorial-gutter space-y-4 bg-white px-4 py-5 md:p-5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ))}
          <GridFillers count={3} />
        </div>
      ) : null}

      {isError ? (
        <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </div>
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((group) => (
            <TopicBlock key={group.topic.id} group={group} />
          ))}
          <GridFillers count={data.length} />
        </div>
      ) : null}
    </FrameModule>
  );
}

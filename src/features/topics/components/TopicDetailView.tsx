"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useTopicDetail } from "@/features/topics/hooks/useTopicDetail";
import { Link } from "@/i18n/navigation";
import { TopicFollow } from "@/features/topics/components/TopicFollow";
import { TopicSeries } from "@/features/categories/components/DeskSections";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { TaxonomyLocaleShell } from "@/shared/components/common/TaxonomyLocaleShell";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { TAXONOMY_ARTICLES_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

interface TopicDetailViewProps {
  slug: string;
}

function ArticlesSkeleton() {
  return (
    <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
          <Skeleton className="aspect-[16/9] w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function TopicDetailView({ slug }: TopicDetailViewProps) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const { topicQuery, articlesQuery } = useTopicDetail(slug, page);
  const t = useTranslations("topicsPage");
  const tCommon = useTranslations("common");

  const isLoading = topicQuery.isLoading || articlesQuery.isLoading;
  const isError = topicQuery.isError || articlesQuery.isError;
  const error = topicQuery.error ?? articlesQuery.error;

  function handleRetry() {
    void topicQuery.refetch();
    void articlesQuery.refetch();
  }

  const heroTitle = topicQuery.data
    ? topicQuery.data.name
    : topicQuery.isLoading
      ? "…"
      : t("notFound");

  const articleItems =
    !isLoading && !isError ? articlesQuery.data?.items ?? [] : [];
  const showFeatured = page === 1 && articleItems.length >= 1;
  const gridItems = showFeatured ? articleItems.slice(1) : articleItems;

  const content = (
    <PageFrame>
      <FrameModule ariaLabelledby="topic-detail-heading">
        <FramePageHero
          kicker={topicQuery.data ? t("kicker") : undefined}
          leading={
            <Link
              className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
              href="/topics"
            >
              ← {t("backToTopics")}
            </Link>
          }
          actions={topicQuery.data?<TopicFollow id={topicQuery.data.id}/>:undefined}
          title={heroTitle}
          titleId="topic-detail-heading"
        />
      </FrameModule>

      <FrameModule ariaLabelledby="topic-articles-heading">
        <h2 className="sr-only" id="topic-articles-heading">
          {t("articlesHeading")}
        </h2>

        {isLoading ? <ArticlesSkeleton /> : null}

        {isError ? (
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <ErrorState message={error?.message} onRetry={handleRetry} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        topicQuery.data &&
        !articlesQuery.data?.items.length ? (
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <EmptyState message={t("noArticles")} />
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        topicQuery.data &&
        articlesQuery.data?.items.length ? (
          <>
            {showFeatured ? (
              <div className="editorial-gutter border-b border-neutral-200 bg-white px-4 py-5 md:p-5">
                <p className="kicker">{t("featuredKicker")}</p>
                <div className="mt-3">
                  <ArticleCard article={articleItems[0]} variant="featured" />
                </div>
              </div>
            ) : null}

            {gridItems.length > 0 ? (
              <>
                <FrameHeading
                  id="topic-articles-grid-heading"
                  countLabel={tCommon("articleCount", {
                    count: articlesQuery.data.total,
                  })}
                  title={t("articlesHeading")}
                />
                <div className="px-4 md:px-5"><ArticleTimeline articles={gridItems}/></div>
              </>
            ) : null}

            {articlesQuery.data.totalPages > 1 ? (
              <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
                <Pagination
                  basePath={`/topics/${slug}`}
                  currentPage={articlesQuery.data.page}
                  itemLabel="articles"
                  pageSize={
                    articlesQuery.data.limit || TAXONOMY_ARTICLES_PAGE_LIMIT
                  }
                  totalItems={articlesQuery.data.total}
                  totalPages={articlesQuery.data.totalPages}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </FrameModule>
      {topicQuery.data?<TopicSeries topicId={topicQuery.data.id}/>:null}
    </PageFrame>
  );

  if (topicQuery.data) {
    return (
      <TaxonomyLocaleShell entity={topicQuery.data} kind="topics">
        {content}
      </TaxonomyLocaleShell>
    );
  }

  return content;
}

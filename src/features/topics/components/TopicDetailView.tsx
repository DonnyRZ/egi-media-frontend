"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useTopicDetail } from "@/features/topics/hooks/useTopicDetail";
import { Link } from "@/i18n/navigation";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { TaxonomyLocaleShell } from "@/shared/components/common/TaxonomyLocaleShell";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { TAXONOMY_ARTICLES_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

interface TopicDetailViewProps {
  slug: string;
}

function DetailSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 border-b border-neutral-200 pb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
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

  const content = (
    <>
      <section aria-labelledby="topic-detail-heading">
        <Container>
          <div className="border-b border-neutral-200 py-8 lg:py-10">
          <Link
            className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
            href="/topics"
          >
            ← {t("backToTopics")}
          </Link>

          {topicQuery.isLoading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ) : null}

          {topicQuery.data ? (
            <>
              <p className="mt-4 kicker">{t("kicker")}</p>
              <h1
                id="topic-detail-heading"
                className="mt-2 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              >
                {topicQuery.data.name}
              </h1>
              {topicQuery.data.description ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 lg:text-base lg:leading-7">
                  {topicQuery.data.description}
                </p>
              ) : null}
            </>
          ) : null}

          {!topicQuery.isLoading &&
          !topicQuery.isError &&
          topicQuery.data === null ? (
            <h1
              id="topic-detail-heading"
              className="mt-4 font-serif text-3xl font-bold text-ink"
            >
              {t("notFound")}
            </h1>
          ) : null}
          </div>
        </Container>
      </section>

      <Section ariaLabelledby="topic-articles-heading" className="pt-8 lg:pt-10">
        <Container>
          <h2 id="topic-articles-heading" className="sr-only">
            {t("articlesHeading")}
          </h2>

          {isLoading ? <DetailSkeleton /> : null}

          {isError ? (
            <ErrorState message={error?.message} onRetry={handleRetry} />
          ) : null}

          {!isLoading &&
          !isError &&
          topicQuery.data &&
          !articlesQuery.data?.items.length ? (
            <EmptyState message={t("noArticles")} />
          ) : null}

          {!isLoading &&
          !isError &&
          topicQuery.data &&
          articlesQuery.data?.items.length ? (
            <div className="space-y-10">
              {page === 1 ? (
                <div className="border-b border-neutral-200 pb-8">
                  <p className="kicker">{t("featuredKicker")}</p>
                  <div className="mt-3">
                    <ArticleCard article={articlesQuery.data.items[0]} variant="featured" />
                  </div>
                </div>
              ) : null}

              {(page === 1
                ? articlesQuery.data.items.slice(1)
                : articlesQuery.data.items
              ).length > 0 ? (
                <div>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-neutral-200 pb-2">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-ink">
                      {t("articlesHeading")}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {tCommon("articleCount", {
                        count: articlesQuery.data.total,
                      })}
                    </p>
                  </div>
                  <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {(page === 1
                      ? articlesQuery.data.items.slice(1)
                      : articlesQuery.data.items
                    ).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              ) : null}

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
        </Container>
      </Section>
    </>
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

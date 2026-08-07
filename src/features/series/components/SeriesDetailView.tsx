"use client";

import { useFormatter, useTranslations } from "next-intl";

import { useSeriesDetail } from "@/features/series/hooks/useSeriesDetail";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import { Link } from "@/i18n/navigation";

interface SeriesDetailViewProps {
  slug: string;
}

export function SeriesDetailView({ slug }: SeriesDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useSeriesDetail(slug);
  const t = useTranslations("seriesPage");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  if (isLoading) {
    return (
      <>
        <section>
          <Container>
            <div className="border-b border-neutral-200 py-8 lg:py-10">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-10 w-2/3" />
              <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
            </div>
          </Container>
        </section>
        <Section>
          <Container>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </>
    );
  }

  if (isError) {
    return (
      <Section>
        <Container>
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        </Container>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section>
        <Container>
          <EmptyState message={t("notFound")} />
        </Container>
      </Section>
    );
  }

  return (
    <>
      <section aria-labelledby="series-detail-heading">
        <Container>
          <div className="grid gap-8 border-b border-neutral-200 py-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-10 lg:py-10">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <ArticleImage
                alt={data.name}
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                src={data.coverImage}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
                  href="/series"
                >
                  ← {t("backToSeries")}
                </Link>
                {data.publishedAt ? (
                  <time
                    className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                    dateTime={data.publishedAt}
                  >
                    {format.dateTime(new Date(data.publishedAt), DATE_FORMAT)}
                  </time>
                ) : null}
              </div>
              <p className="kicker mt-4">{t("kicker")}</p>
              <h1
                id="series-detail-heading"
                className="mt-2 max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              >
                {data.name}
              </h1>
              {data.description ? (
                <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700">
                  {data.description}
                </p>
              ) : null}
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {tCommon("articleCount", { count: data.articleCount })}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section ariaLabelledby="series-articles-heading" className="pt-8 lg:pt-10">
        <Container>
          <div className="mb-6 border-b border-neutral-200 pb-2">
            <h2
              id="series-articles-heading"
              className="text-lg font-bold uppercase tracking-wide text-ink"
            >
              {t("articlesInSeries")}
            </h2>
          </div>

          {!data.articles.length ? (
            <EmptyState message={t("noArticles")} />
          ) : (
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {data.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

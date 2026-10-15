"use client";

import { useFormatter, useTranslations } from "next-intl";

import { useSeriesDetail } from "@/features/series/hooks/useSeriesDetail";
import { Link } from "@/i18n/navigation";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

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
      <PageFrame>
        <FrameModule>
          <div className="grid gap-px bg-neutral-200 lg:grid-cols-[1.2fr_1fr]">
            <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
              <Skeleton className="aspect-[16/9] w-full" />
            </div>
            <div className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </FrameModule>
        <FrameModule>
          <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="editorial-gutter space-y-3 bg-white px-4 py-5 md:p-5">
                <Skeleton className="aspect-[16/9] w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </FrameModule>
      </PageFrame>
    );
  }

  if (isError) {
    return (
      <PageFrame>
        <FrameModule>
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <ErrorState message={error?.message} onRetry={() => void refetch()} />
          </div>
        </FrameModule>
      </PageFrame>
    );
  }

  if (!data) {
    return (
      <PageFrame>
        <FrameModule>
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <EmptyState message={t("notFound")} />
          </div>
        </FrameModule>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <FrameModule ariaLabelledby="series-detail-heading">
        <div className="grid gap-px bg-neutral-200 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-[16/9] self-start overflow-hidden bg-neutral-100">
            <ArticleImage
              alt={data.name}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              src={data.coverImage}
            />
          </div>
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5 lg:p-8">
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
            {data.topic?<Link href={`/topics/${data.topic.slug}`} className="mt-4 block text-sm font-semibold text-primary-700">{data.topic.name} →</Link>:null}
            <p className="kicker mt-4">{t("kicker")}</p>
            <h1
              className="editorial-page-title mt-2 max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              id="series-detail-heading"
            >
              {data.name}
            </h1>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {tCommon("articleCount", { count: data.articleCount })}
            </p>
          </div>
        </div>
      </FrameModule>

      <FrameModule ariaLabelledby="series-articles-heading">
        <FrameHeading id="series-articles-heading" title={t("articlesInSeries")} />

        {!data.articles.length ? (
          <div className="editorial-gutter bg-white px-4 py-5 md:p-5">
            <EmptyState message={t("noArticles")} />
          </div>
        ) : (
          <AdaptiveCardGrid
            items={data.articles}
            keyForItem={(article) => article.id}
            renderItem={(article) => (
              <ArticleCard article={article} className="editorial-gutter bg-white px-4 py-5 md:p-5" />
            )}
          />
        )}
      </FrameModule>
    </PageFrame>
  );
}

"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";

import { ArticleBody } from "@/features/article/components/ArticleBody";
import { ColumnCommentsSection } from "@/features/columns/components/ColumnCommentsSection";
import { ColumnEngagement } from "@/features/columns/components/ColumnEngagement";
import { useColumnDetail } from "@/features/columns/hooks/useColumnDetail";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { FramePageHero } from "@/shared/components/layout/FramePageHero";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { env } from "@/shared/config/env";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

interface ColumnDetailViewProps {
  slug: string;
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-4/5" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="aspect-[16/9] w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function ColumnDetailView({ slug }: ColumnDetailViewProps) {
  const t = useTranslations("columnsPage");
  const format = useFormatter();
  const locale = useLocale();
  const { data, isLoading, isError, error, refetch } = useColumnDetail(slug);

  const shareUrl = data
    ? `${env.siteUrl}/${locale}/kolom/${data.slug}`
    : "";

  const backLink = (
    <Link
      className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-accent"
      href="/kolom"
    >
      ← {t("backToColumns")}
    </Link>
  );

  if (isLoading) {
    return (
      <PageFrame>
        <FrameModule>
          <div className="bg-white p-5 lg:p-8">
            <div className="mb-4">{backLink}</div>
            <DetailSkeleton />
          </div>
        </FrameModule>
      </PageFrame>
    );
  }

  if (isError) {
    return (
      <PageFrame>
        <FrameModule>
          <div className="bg-white p-5 lg:p-8">
            <div className="mb-4">{backLink}</div>
            <ErrorState
              message={error?.message}
              onRetry={() => void refetch()}
            />
          </div>
        </FrameModule>
      </PageFrame>
    );
  }

  if (!data || data.status !== "published") {
    return (
      <PageFrame>
        <FrameModule ariaLabelledby="column-detail-heading">
          <FramePageHero
            leading={backLink}
            title={t("notFound")}
            titleId="column-detail-heading"
          />
        </FrameModule>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <FrameModule ariaLabelledby="column-detail-heading">
        <div className="bg-white p-5 lg:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4">{backLink}</div>
            <p className="kicker">{t("kicker")}</p>
            <h1
              className="mt-2 font-sans text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
              id="column-detail-heading"
            >
              {data.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="font-semibold text-ink">
                {t("byAuthor", { name: data.author.fullName })}
              </span>
              {data.publishedAt ? (
                <time dateTime={data.publishedAt}>
                  {format.dateTime(new Date(data.publishedAt), DATE_FORMAT)}
                </time>
              ) : null}
            </div>
            {data.summary ? (
              <p className="mt-5 border-l-2 border-ink pl-4 text-base leading-7 text-neutral-700 lg:text-lg">
                {data.summary}
              </p>
            ) : null}
            {data.featuredImage ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-neutral-100">
                <ArticleImage
                  alt={data.title}
                  sizes="(max-width: 768px) 100vw, 768px"
                  src={data.featuredImage}
                />
              </div>
            ) : null}
            <div className="mt-8">
              <ColumnEngagement
                columnId={data.id}
                initialShareCount={data.shareCount}
                shareUrl={shareUrl}
                title={data.title}
              />
            </div>
          </div>
        </div>
      </FrameModule>

      <FrameModule>
        <div className="bg-white p-5 lg:p-8">
          <div className="mx-auto max-w-3xl">
            <ArticleBody content={data.content} />
          </div>
        </div>
      </FrameModule>

      <FrameModule ariaLabelledby="column-comments-heading">
        <ColumnCommentsSection
          columnAuthorId={data.author.id}
          columnId={data.id}
        />
      </FrameModule>
    </PageFrame>
  );
}

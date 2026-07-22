"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";

import { ArticleBody } from "@/features/article/components/ArticleBody";
import { ColumnCommentsSection } from "@/features/columns/components/ColumnCommentsSection";
import { ColumnEngagement } from "@/features/columns/components/ColumnEngagement";
import { useColumnDetail } from "@/features/columns/hooks/useColumnDetail";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
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

  return (
    <Section className="pt-8 lg:pt-12">
      <Container>
        <div className="mb-6">
          <Link
            className="text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
            href="/kolom"
          >
            ← {t("backToColumns")}
          </Link>
        </div>

        {isLoading ? <DetailSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && (!data || data.status !== "published") ? (
          <EmptyState message={t("notFound")} />
        ) : null}

        {!isLoading && !isError && data?.status === "published" ? (
          <article className="mx-auto max-w-3xl">
            <p className="kicker">{t("kicker")}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
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
                initialViewCount={data.viewCount}
                shareUrl={shareUrl}
                title={data.title}
              />
            </div>
            <div className="mt-10">
              <ArticleBody content={data.content} />
            </div>
            <ColumnCommentsSection
              columnAuthorId={data.author.id}
              columnId={data.id}
            />
          </article>
        ) : null}
      </Container>
    </Section>
  );
}

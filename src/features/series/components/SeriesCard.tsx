"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import { cn } from "@/shared/lib/cn";
import type { Series } from "@/shared/types/series.types";

interface SeriesCardProps {
  series: Series;
  variant?: "default" | "featured";
  className?: string;
}

function SeriesCover({
  series,
  className,
}: {
  series: Series;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className ?? ""}`}>
      <ArticleImage
        alt={series.name}
        sizes="(max-width: 768px) 100vw, 50vw"
        src={series.coverImage}
      />
    </div>
  );
}

export function SeriesCard({ series, variant = "default", className }: SeriesCardProps) {
  const t = useTranslations("seriesPage");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  if (variant === "featured") {
    return (
      <article className={cn("editorial-card group grid gap-6 border-b border-neutral-200 pb-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:pb-10", className)}>
        <Link className="block" href={`/series/${series.slug}`}>
          <SeriesCover className="aspect-[16/9]" series={series} />
        </Link>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">{t("featuredKicker")}</span>
            {series.publishedAt ? (
              <time
                className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
                dateTime={series.publishedAt}
              >
                {format.dateTime(new Date(series.publishedAt), DATE_FORMAT)}
              </time>
            ) : null}
          </div>
          <h2 className="editorial-lead-title mt-3 font-sans text-3xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
            <Link href={`/series/${series.slug}`}>{series.name}</Link>
          </h2>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {tCommon("articleCount", { count: series.articleCount })}
          </p>
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
            href={`/series/${series.slug}`}
          >
            {t("readSeries")} →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("editorial-card editorial-gutter group flex h-full flex-col bg-white px-4 py-5 md:p-5", className)}>
      <Link className="block" href={`/series/${series.slug}`}>
        <SeriesCover className="aspect-[16/9]" series={series} />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="kicker">{t("kicker")}</span>
          {series.publishedAt ? (
            <time
              className="text-xs font-semibold uppercase tracking-wide text-neutral-500"
              dateTime={series.publishedAt}
            >
              {format.dateTime(new Date(series.publishedAt), DATE_FORMAT)}
            </time>
          ) : null}
        </div>
        <h3 className="editorial-card-title mt-2 font-sans text-xl font-bold leading-snug text-ink transition-colors group-hover:text-accent">
          <Link href={`/series/${series.slug}`}>{series.name}</Link>
        </h3>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {tCommon("articleCount", { count: series.articleCount })}
        </p>
      </div>
    </article>
  );
}

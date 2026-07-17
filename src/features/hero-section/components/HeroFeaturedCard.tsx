"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

interface HeroFeaturedCardProps {
  article: Article;
}

export function HeroFeaturedCard({ article }: HeroFeaturedCardProps) {
  const t = useTranslations("common");
  const format = useFormatter();

  return (
    <article className="group">
      <Link href={getArticleHref(article)}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <ArticleImage
            alt={article.title}
            className="transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            src={article.featuredImage}
          />
        </div>
      </Link>

      <div className="mt-4">
        {article.category ? (
          <span className="kicker">{article.category.name}</span>
        ) : null}
        <h2 className="mt-2 font-serif text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl">
          <Link className="headline-link" href={getArticleHref(article)}>
            {article.title}
          </Link>
        </h2>
        {article.summary ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-700 lg:text-lg">
            {article.summary}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <span className="font-semibold text-neutral-800">
            {article.author.fullName}
          </span>
          <span aria-hidden="true">•</span>
          {article.publishedAt ? (
            <time dateTime={article.publishedAt}>
              {format.dateTime(new Date(article.publishedAt), DATE_FORMAT)}
            </time>
          ) : null}
          <span aria-hidden="true">•</span>
          <span>{t("readingTime", { minutes: article.readingTimeMinutes })}</span>
        </div>
      </div>
    </article>
  );
}

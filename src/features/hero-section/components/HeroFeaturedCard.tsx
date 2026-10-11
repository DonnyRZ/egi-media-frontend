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
    <article className="group mx-auto max-w-[560px] bg-white p-4 min-[1200px]:p-5">
      <Link href={getArticleHref(article)}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <ArticleImage
            alt={article.title}
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 60vw, 480px"
            src={article.featuredImage}
          />
        </div>
      </Link>

      <div className="mt-4">
        {article.category ? (
          <span className="kicker">{article.category.name}</span>
        ) : null}
        <h2 className="mt-2 font-sans text-[28px] font-bold leading-[1.08] tracking-tight text-ink min-[1200px]:text-4xl min-[1440px]:text-[40px]">
          <Link className="headline-link" href={getArticleHref(article)}>
            {article.title}
          </Link>
        </h2>
        {article.summary ? (
          <p className="mt-3 line-clamp-3 text-base leading-6 text-neutral-700">
            {article.summary}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
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

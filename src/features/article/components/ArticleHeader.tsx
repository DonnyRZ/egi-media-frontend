"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import type { ArticleDetail } from "@/shared/types/article.types";

interface ArticleHeaderProps {
  article: ArticleDetail;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const t = useTranslations("article");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  return (
    <header className="editorial-article-header border-b border-neutral-200 pb-4">
      {article.category ? <Link className="kicker" href={`/categories/${article.category.id}`}>{article.category.name}</Link> : null}
      <h1 className="editorial-article-title mt-3 font-sans text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
        {article.title}
      </h1>
      <div className="editorial-reader-meta mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-500">
        <span className="font-semibold text-neutral-800">{article.author.fullName}</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {article.publishedAt ? (
          <>
            <span aria-hidden="true" className="editorial-wide-only">•</span>
            <time dateTime={article.publishedAt}>
              <span className="editorial-wide-only">{t("publishedOn", {
                date: format.dateTime(new Date(article.publishedAt), {
                  ...DATE_FORMAT,
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })}</span>
              <span className="editorial-mobile-only">{format.dateTime(new Date(article.publishedAt), {
                ...DATE_FORMAT, hour: "2-digit", minute: "2-digit",
              })}</span>
            </time>
          </>
        ) : null}
        {article.readingTimeMinutes ? <span className="inline-flex items-center gap-x-3">
          {article.publishedAt ? <span aria-hidden="true">•</span> : null}
          <span>{tCommon("readingTime", { minutes: article.readingTimeMinutes })}</span>
        </span> : null}
        </div>
      </div>
    </header>
  );
}

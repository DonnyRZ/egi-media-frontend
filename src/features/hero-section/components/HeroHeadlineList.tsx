"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

interface HeroHeadlineListProps {
  articles: Article[];
}

export function HeroHeadlineList({ articles }: HeroHeadlineListProps) {
  const t = useTranslations("hero");
  const format = useFormatter();

  return (
    <div className="flex h-full flex-col bg-white p-6">
      <h3 className="border-b border-neutral-200 pb-2 text-sm font-bold uppercase tracking-wide text-ink">
        {t("moreTopStories")}
      </h3>
      <ul className="mt-4 flex flex-1 flex-col">
        {articles.map((article, index) => (
          <li
            key={article.id}
            className="flex gap-3 border-b border-neutral-200 py-4 first:pt-0 last:border-b-0"
          >
            <span
              aria-hidden="true"
              className="font-serif text-lg font-bold leading-none text-accent"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              {article.category ? (
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {article.category.name}
                </span>
              ) : null}
              <h4 className="mt-0.5 font-serif text-base font-semibold leading-snug text-ink">
                <Link className="headline-link" href={getArticleHref(article)}>
                  {article.title}
                </Link>
              </h4>
              {article.publishedAt ? (
                <p className="mt-1 text-xs text-neutral-500">
                  {format.dateTime(new Date(article.publishedAt), DATE_FORMAT)}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

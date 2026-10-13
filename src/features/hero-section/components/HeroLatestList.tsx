"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

interface HeroLatestListProps {
  articles: Article[];
  allHref?: string | null;
  title?: string;
  headingId?: string;
}

export function HeroLatestList({ articles, allHref = "/latest", title, headingId = "hero-latest-heading" }: HeroLatestListProps) {
  const t = useTranslations("latest");
  const format = useFormatter();
  return <section className="editorial-gutter p-4 min-[1200px]:p-5" aria-labelledby={headingId}>
    <div className="flex items-center justify-between gap-3">
      <h2 id={headingId} className="editorial-section-title text-xl font-bold text-accent">{title ?? t("title")}</h2>
      {allHref ? <Link href={allHref} className="shrink-0 text-xs font-semibold underline underline-offset-4">{t("viewAll")}</Link> : null}
    </div>
    <ul className="mt-3 divide-y divide-neutral-200">
      {articles.map((article) => <li key={article.id} className="py-3 first:pt-0 last:pb-0">
        <h3 className="editorial-list-title font-sans text-lg font-bold leading-snug tracking-tight text-ink">
          <Link className="headline-link" href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        {article.publishedAt ? <time dateTime={article.publishedAt} className="mt-1 block text-xs text-neutral-500">
          {format.dateTime(new Date(article.publishedAt), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </time> : null}
      </li>)}
    </ul>
  </section>;
}

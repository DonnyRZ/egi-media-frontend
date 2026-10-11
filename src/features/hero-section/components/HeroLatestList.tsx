"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

export function HeroLatestList({ articles }: { articles: Article[] }) {
  const t = useTranslations("latest");
  const format = useFormatter();
  return <section className="p-4 min-[1200px]:p-5" aria-labelledby="hero-latest-heading">
    <div className="flex items-center justify-between gap-3">
      <h2 id="hero-latest-heading" className="text-xl font-bold text-accent">{t("title")}</h2>
      <Link href="/latest" className="shrink-0 text-xs font-semibold underline underline-offset-4">{t("viewAll")}</Link>
    </div>
    <ul className="mt-3 divide-y divide-neutral-200">
      {articles.map((article) => <li key={article.id} className="py-3 first:pt-0 last:pb-0">
        <h3 className="font-sans text-lg font-bold leading-snug tracking-tight text-ink">
          <Link className="headline-link" href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        {article.publishedAt ? <time dateTime={article.publishedAt} className="mt-1 block text-xs text-neutral-500">
          {format.dateTime(new Date(article.publishedAt), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </time> : null}
      </li>)}
    </ul>
  </section>;
}

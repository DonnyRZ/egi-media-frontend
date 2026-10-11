"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ArticleMeta } from "@/shared/components/common/ArticleCard";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

export function HeroHeadlineList({ articles }: { articles: Article[] }) {
  const t = useTranslations("hero");
  return <section className="p-4 min-[1200px]:p-5" aria-labelledby="hero-headlines-heading">
    <h2 id="hero-headlines-heading" className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">{t("moreTopStories")}</h2>
    <ul className="divide-y divide-neutral-200">
      {articles.slice(0, 5).map((article, index) => <li key={article.id} className="py-3 first:pt-0 last:pb-0">
        {index === 0 ? <Link className="mb-3 block" href={getArticleHref(article)}>
          <div className="relative aspect-video overflow-hidden"><ArticleImage alt={article.title} src={article.featuredImage} sizes="(max-width: 767px) 100vw, 340px" priority /></div>
        </Link> : null}
        {article.category ? <p className="kicker">{article.category.name}</p> : null}
        <h3 className={`mt-1 font-sans font-bold leading-[1.15] tracking-tight text-ink ${index === 0 ? "text-2xl min-[1440px]:text-[28px]" : "text-lg"}`}>
          <Link className="headline-link" href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        {index === 0 ? <ArticleMeta article={article} className="mt-3" /> : null}
      </li>)}
    </ul>
  </section>;
}

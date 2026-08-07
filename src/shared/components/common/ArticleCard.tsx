"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";
import { cn } from "@/shared/lib/cn";

interface ArticleMetaProps {
  article: Article;
  className?: string;
}

export function ArticleMeta({ article, className }: ArticleMetaProps) {
  const t = useTranslations("common");
  const format = useFormatter();

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-xs text-neutral-500", className)}>
      <span className="font-semibold text-neutral-700">{article.author.fullName}</span>
      <span aria-hidden="true">•</span>
      {article.publishedAt ? (
        <time dateTime={article.publishedAt}>
          {format.dateTime(new Date(article.publishedAt), DATE_FORMAT)}
        </time>
      ) : null}
      <span aria-hidden="true">•</span>
      <span>{t("readingTime", { minutes: article.readingTimeMinutes })}</span>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal" | "featured";
}

function CategoryKicker({ article }: { article: Article }) {
  if (!article.category) return null;
  return <span className="kicker">{article.category.name}</span>;
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <article className="group grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <Link href={getArticleHref(article)}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <ArticleImage
              alt={article.title}
              className="transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              src={article.featuredImage}
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center">
          <CategoryKicker article={article} />
          <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-accent sm:text-3xl">
            <Link href={getArticleHref(article)}>{article.title}</Link>
          </h2>
          {article.summary ? (
            <p className="mt-3 line-clamp-3 text-base leading-7 text-neutral-700">
              {article.summary}
            </p>
          ) : null}
          <ArticleMeta article={article} className="mt-4" />
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden">
          <ArticleImage alt={article.title} src={article.featuredImage} />
        </div>
        <div className="min-w-0 flex-1">
          <CategoryKicker article={article} />
          <h3 className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-snug text-ink group-hover:text-accent">
            <Link href={getArticleHref(article)}>{article.title}</Link>
          </h3>
          <ArticleMeta article={article} className="mt-2" />
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
        <CategoryKicker article={article} />
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-accent">
          <Link href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        <ArticleMeta article={article} className="mt-2" />
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link href={getArticleHref(article)}>
        <div className="relative aspect-[16/10] overflow-hidden">
          <ArticleImage
            alt={article.title}
            className="transition-transform duration-500 group-hover:scale-105"
            src={article.featuredImage}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <CategoryKicker article={article} />
        <h3 className="mt-1.5 font-serif text-xl font-bold leading-tight text-ink group-hover:text-accent">
          <Link href={getArticleHref(article)}>{article.title}</Link>
        </h3>
        {article.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-600">
            {article.summary}
          </p>
        ) : null}
        <ArticleMeta article={article} className="mt-3" />
      </div>
    </article>
  );
}

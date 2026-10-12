"use client";

import { useTranslations } from "next-intl";

import {
  DeskColumns,
  TopicSection,
  TopicSeries,
} from "@/features/categories/components/DeskSections";
import { ArticleCard, ArticleMeta } from "@/shared/components/common/ArticleCard";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import type { useCategoryDesk } from "@/features/categories/hooks/useCategoryDesk";
import type { Article } from "@/shared/types/article.types";
import { getArticleHref } from "@/shared/utils/article-path";

interface DeskPartProps {
  model: ReturnType<typeof useCategoryDesk>;
}

export function DeskTopicNavigation({
  model,
  categorySlug,
}: DeskPartProps & { categorySlug: string }) {
  const t = useTranslations("editorial");
  const categoryT = useTranslations("categoriesPage");
  if (!model.config?.topics.length) return null;

  return (
    <nav
      aria-label={t("topics")}
      className="border-y border-neutral-200 bg-white px-4 md:px-6"
    >
      <ul className="flex gap-6 overflow-x-auto scrollbar-hide">
        <li className="shrink-0">
          <Link
            href={`/categories/${categorySlug}`}
            aria-current="page"
            className="block border-b-2 border-accent py-3 text-sm font-semibold text-ink"
          >
            {categoryT("categoryAll")}
          </Link>
        </li>
        {model.config.topics.map((topic) => (
          <li key={topic.id} className="shrink-0">
            <Link
              href={`/topics/${topic.slug}`}
              className="block border-b-2 border-transparent py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-ink"
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CategoryLeadStory({ article }: { article: Article }) {
  return (
    <article className="group min-w-0">
      <Link
        href={getArticleHref(article)}
        aria-label={article.title}
        className="block"
      >
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            priority
            sizes="(max-width: 1279px) 100vw, 62vw"
          />
        </div>
      </Link>
      <div className="pt-4">
        {article.category ? (
          <p className="kicker">{article.category.name}</p>
        ) : null}
        <h2 className="mt-2 font-sans text-[28px] font-bold leading-[1.08] tracking-tight text-ink sm:text-3xl xl:text-4xl">
          <Link className="headline-link" href={getArticleHref(article)}>
            {article.title}
          </Link>
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

function SupportingStory({ article }: { article: Article }) {
  return (
    <article className="group grid min-w-0 grid-cols-[112px_minmax(0,1fr)] gap-3 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4 xl:grid-cols-[132px_minmax(0,1fr)]">
      <Link
        href={getArticleHref(article)}
        aria-label={article.title}
        className="relative aspect-video self-start overflow-hidden bg-neutral-100"
      >
        <ArticleImage
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          sizes="(max-width: 639px) 112px, 132px"
        />
      </Link>
      <div className="min-w-0">
        {article.category ? (
          <p className="kicker text-[10px]">{article.category.name}</p>
        ) : null}
        <h3 className="mt-1 font-sans text-base font-bold leading-snug tracking-tight text-ink sm:text-[17px]">
          <Link className="headline-link" href={getArticleHref(article)}>
            {article.title}
          </Link>
        </h3>
        <ArticleMeta article={article} className="mt-2 text-[11px]" />
      </div>
    </article>
  );
}

export function CategoryOpeningPackage({
  lead,
  supporting,
}: {
  lead: Article;
  supporting: Article[];
}) {
  const t = useTranslations("hero");

  return (
    <section
      aria-label={t("srHeading")}
      className="grid min-w-0 border-b border-neutral-200 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]"
    >
      <div className="min-w-0 p-4 md:p-6 xl:border-r xl:border-neutral-200">
        <CategoryLeadStory article={lead} />
      </div>
      {supporting.length ? (
        <div className="min-w-0 border-t border-neutral-200 p-4 md:p-6 xl:border-t-0">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">
            {t("moreTopStories")}
          </h2>
          <div className="grid gap-x-6 gap-y-0 md:grid-cols-2 xl:grid-cols-1">
            {supporting.slice(0, 5).map((article, index) => (
              <div
                key={article.id}
                className={cn(
                  "py-3",
                  index === 0 && "pt-0",
                  index === 1 && "md:pt-0 xl:pt-3",
                  index < supporting.length - 1 && "border-b border-neutral-200",
                  "xl:border-b xl:border-neutral-200 xl:last:border-b-0",
                )}
              >
                <SupportingStory article={article} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CategoryLatestCard({ article }: { article: Article }) {
  return (
    <article className="group flex min-w-0 flex-col bg-white p-4 md:p-5">
      <Link
        href={getArticleHref(article)}
        aria-label={article.title}
        className="block"
      >
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <ArticleImage
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        {article.category ? (
          <p className="kicker">{article.category.name}</p>
        ) : null}
        <h3 className="mt-1.5 font-sans text-xl font-bold leading-tight tracking-tight text-ink">
          <Link className="headline-link" href={getArticleHref(article)}>
            {article.title}
          </Link>
        </h3>
        {article.summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
            {article.summary}
          </p>
        ) : null}
        <ArticleMeta article={article} className="mt-auto pt-3" />
      </div>
    </article>
  );
}

export function CategoryLatestGrid({ articles }: { articles: Article[] }) {
  const t = useTranslations("latest");
  if (!articles.length) return null;

  return (
    <section
      aria-labelledby="category-latest-heading"
      className="border-b border-neutral-200"
    >
      <header className="flex flex-col gap-2 px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6">
        <div>
          <h2
            id="category-latest-heading"
            className="font-sans text-2xl font-bold tracking-tight text-ink"
          >
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{t("subtitle")}</p>
        </div>
      </header>
      <div className="border-t border-neutral-200">
        <AdaptiveCardGrid
          items={articles.slice(0, 6)}
          keyForItem={(article) => article.id}
          renderItem={(article) => <CategoryLatestCard article={article} />}
        />
      </div>
    </section>
  );
}

export function DeskNotices({ model }: DeskPartProps) {
  return model.selection.isError ? (
    <div className="px-4 py-5 md:p-5">
      <ErrorState onRetry={() => void model.selection.refetch()} />
    </div>
  ) : null;
}

export function DeskEditorPicks({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  const alreadyShown = new Set([
    model.lead?.id,
    ...model.supporting.map((article) => article.id),
  ]);
  const articles = model.editors.filter(
    (article) => !alreadyShown.has(article.id),
  );
  if (!articles.length) return null;

  return (
    <section className="border-b border-neutral-200 p-4 md:p-6">
      <h2 className="mb-4 font-sans text-xl font-bold tracking-tight text-ink">
        {t("editors")}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="supporting"
          />
        ))}
      </div>
    </section>
  );
}

export function DeskCompactStories({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  const articles = model.rest.slice(0, 6);
  if (!articles.length) return null;

  return (
    <section className="border-b border-neutral-200 p-4 md:p-6">
      <h2 className="mb-4 font-sans text-xl font-bold tracking-tight text-ink">
        {t("more")}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="supporting" />
        ))}
      </div>
    </section>
  );
}

export function DeskRelatedSections({
  model,
  categoryId,
}: DeskPartProps & { categoryId: string }) {
  return (
    <>
      <DeskColumns categoryId={categoryId} />
      {model.config?.topics.slice(0, 8).map((topic) => (
        <div key={topic.id}>
          <TopicSeries topicId={topic.id} />
          <TopicSection topic={topic} />
        </div>
      ))}
    </>
  );
}

export function DeskContinuation({ model }: DeskPartProps) {
  const t = useTranslations("editorial");
  const articles = model.rest.slice(6);
  if (!articles.length) return null;

  return (
    <section className="border-t border-neutral-200 p-4 md:p-6">
      <h2 className="font-sans text-xl font-bold tracking-tight text-ink">
        {t("more")}
      </h2>
      <ArticleTimeline articles={articles} />
    </section>
  );
}

export function DeskEmptyNotice({ model }: DeskPartProps) {
  const t = useTranslations("categoriesPage");
  return !model.selection.isLoading && !model.lead ? (
    <div className="px-4 py-5 md:p-5">
      <EmptyState message={t("noArticles")} />
    </div>
  ) : null;
}

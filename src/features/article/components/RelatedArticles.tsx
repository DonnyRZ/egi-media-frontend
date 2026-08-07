import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { getArticlesByCategoryPage } from "@/shared/repositories/article.repository";
import type { ArticleDetail, ContentLocale } from "@/shared/types/article.types";

interface RelatedArticlesProps {
  article: ArticleDetail;
  lang: ContentLocale;
}

const RELATED_ARTICLES_LIMIT = 4;

export async function RelatedArticles({ article, lang }: RelatedArticlesProps) {
  if (!article.category) return null;

  const [t, result] = await Promise.all([
    getTranslations({ locale: lang, namespace: "article" }),
    getArticlesByCategoryPage(article.category.id, lang, 1),
  ]);

  const related = result.items
    .filter((item) => item.id !== article.id)
    .slice(0, RELATED_ARTICLES_LIMIT);

  if (!related.length) return null;

  return (
    <section aria-labelledby="related-articles-heading" className="mt-12">
      <h2
        className="mb-6 border-b border-neutral-200 pb-2 text-lg font-bold uppercase tracking-wide text-ink"
        id="related-articles-heading"
      >
        {t("relatedHeading")}
      </h2>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {related.map((item) => (
          <ArticleCard article={item} key={item.id} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";

import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { GridFillers } from "@/shared/components/common/GridFillers";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
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
    <FrameModule ariaLabelledby="related-articles-heading">
      <FrameHeading
        id="related-articles-heading"
        title={t("relatedHeading")}
      />
      <div className="grid gap-px bg-neutral-200 sm:grid-cols-2">
        {related.map((item) => (
          <div className="bg-white p-5" key={item.id}>
            <ArticleCard article={item} variant="horizontal" />
          </div>
        ))}
        <GridFillers count={related.length} lgCols={2} />
      </div>
    </FrameModule>
  );
}

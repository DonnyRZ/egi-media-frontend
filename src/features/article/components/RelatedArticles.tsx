import { getTranslations } from "next-intl/server";

import { AdaptiveCardGrid } from "@/shared/components/common/AdaptiveCardGrid";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
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
      <AdaptiveCardGrid
        items={related}
        keyForItem={(item) => item.id}
        maxCols={2}
        renderItem={(item) => (
          <ArticleCard
            article={item}
            className="bg-white px-4 py-5 md:p-5"
            variant="horizontal"
          />
        )}
      />
    </FrameModule>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleBody } from "@/features/article/components/ArticleBody";
import { ArticleEngagement } from "@/features/article/components/ArticleEngagement";
import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { ArticleHero } from "@/features/article/components/ArticleHero";
import { ArticleLocaleShell } from "@/features/article/components/ArticleLocaleShell";
import { RelatedArticles } from "@/features/article/components/RelatedArticles";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { env } from "@/shared/config/env";
import { ApiError } from "@/shared/lib/errors";
import {
  getArticleById,
  getArticleBySlug,
} from "@/shared/repositories/article.repository";
import type { ArticleDetail, ContentLocale } from "@/shared/types/article.types";
import {
  isArticleId,
  normalizeArticleSlug,
} from "@/shared/utils/article-path";
import { toContentLocale } from "@/shared/utils/locale";

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function loadArticle(
  slugOrId: string,
  lang: ContentLocale,
): Promise<ArticleDetail> {
  const key = normalizeArticleSlug(slugOrId);
  if (isArticleId(key)) {
    return getArticleById(key, lang);
  }
  return getArticleBySlug(key, lang);
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = toContentLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });

  try {
    const article = await loadArticle(slug, lang);
    return {
      title: article.title,
      description: article.summary ?? t("siteDescription"),
    };
  } catch {
    return {
      title: t("articleFallbackTitle"),
      description: t("siteDescription"),
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const lang = toContentLocale(locale);

  let article: ArticleDetail;

  try {
    article = await loadArticle(slug, lang);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const shareUrl = `${env.siteUrl}/${locale}/articles/${article.id}`;

  return (
    <ArticleLocaleShell article={article}>
      <Section className="pt-8 lg:pt-12">
        <Container>
          <article className="mx-auto max-w-3xl">
            <ArticleHero article={article} />
            <div className="mt-8">
              <ArticleHeader article={article} />
            </div>
            <div className="mt-8">
              <ArticleEngagement
                articleId={article.id}
                initialShareCount={article.shareCount}
                initialViewCount={article.viewCount}
                shareUrl={shareUrl}
                title={article.title}
              />
            </div>
            <div className="mt-10">
              <ArticleBody content={article.content} />
            </div>
            <RelatedArticles article={article} lang={lang} />
          </article>
        </Container>
      </Section>
    </ArticleLocaleShell>
  );
}

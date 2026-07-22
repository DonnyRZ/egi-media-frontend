import {
  fetchArticleById,
  fetchArticleBySlug,
  fetchArticles,
  recordArticleShare,
  recordArticleView,
} from "@/shared/services/article.service";
import type { ArticleListParams } from "@/shared/types/api.types";
import type {
  ArticleDetail,
  ArticleListResult,
  ContentLocale,
  HeroNewsData,
  SharePlatform,
} from "@/shared/types/article.types";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import { LATEST_NEWS_PAGE_LIMIT } from "@/shared/constants/latest-news.constants";
import { TAXONOMY_ARTICLES_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

export async function getArticles(
  params: ArticleListParams,
): Promise<ArticleListResult> {
  return fetchArticles(params);
}

export async function getArticleById(
  id: string,
  lang: ContentLocale = "id",
): Promise<ArticleDetail> {
  return fetchArticleById(id, lang);
}

export async function getArticleBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<ArticleDetail> {
  return fetchArticleBySlug(slug, lang);
}

export async function trackArticleView(articleId: string): Promise<number | null> {
  return recordArticleView(articleId);
}

export async function trackArticleShare(
  articleId: string,
  platform: SharePlatform,
): Promise<number | null> {
  return recordArticleShare(articleId, platform);
}

export async function getHeroNews(lang: ContentLocale = "id"): Promise<HeroNewsData> {
  const [featuredResult, headlinesResult] = await Promise.all([
    fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.heroFeatured,
      placement: "homepage_hero",
      sort: "latest",
      lang,
    }),
    fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.heroHeadlines,
      placement: "headline",
      sort: "latest",
      lang,
    }),
  ]);

  return {
    featured: featuredResult.items[0] ?? null,
    headlines: headlinesResult.items,
  };
}

export async function getBreakingNews(
  lang: ContentLocale = "id",
): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.breakingNews,
    placement: "trending",
    sort: "latest",
    lang,
  });
}

export async function getLatestNews(
  lang: ContentLocale = "id",
): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.latestNews,
    placement: "latest_news",
    sort: "latest",
    lang,
  });
}

export async function getLatestNewsPage(
  lang: ContentLocale = "id",
  page = 1,
): Promise<ArticleListResult> {
  return fetchArticles({
    page,
    limit: LATEST_NEWS_PAGE_LIMIT,
    sort: "latest",
    lang,
  });
}

export async function getEditorsPicks(
  lang: ContentLocale = "id",
): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.editorsPicks,
    sort: "popular",
    lang,
  });
}

export async function getArticlesByCategoryPage(
  categoryId: string,
  lang: ContentLocale = "id",
  page = 1,
): Promise<ArticleListResult> {
  return fetchArticles({
    page,
    limit: TAXONOMY_ARTICLES_PAGE_LIMIT,
    category_id: categoryId,
    sort: "latest",
    lang,
  });
}

export async function getArticlesByTopicPage(
  topicId: string,
  lang: ContentLocale = "id",
  page = 1,
): Promise<ArticleListResult> {
  return fetchArticles({
    page,
    limit: TAXONOMY_ARTICLES_PAGE_LIMIT,
    topic_id: topicId,
    sort: "latest",
    lang,
  });
}

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
  const result = await fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.heroFeatured + HOMEPAGE_LIMITS.heroHeadlines,
    sort: "latest",
    lang,
  });

  const [featured, ...headlines] = result.items;

  return {
    featured: featured ?? null,
    headlines: headlines.slice(0, HOMEPAGE_LIMITS.heroHeadlines),
  };
}

export async function getBreakingNews(
  lang: ContentLocale = "id",
): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.breakingNews,
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

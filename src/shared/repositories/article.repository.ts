import { fetchArticles } from "@/shared/services/article.service";
import type { ArticleListParams } from "@/shared/types/api.types";
import type { ArticleListResult, HeroNewsData } from "@/shared/types/article.types";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";

export async function getArticles(
  params: ArticleListParams,
): Promise<ArticleListResult> {
  return fetchArticles(params);
}

export async function getHeroNews(): Promise<HeroNewsData> {
  const result = await fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.heroFeatured + HOMEPAGE_LIMITS.heroHeadlines,
    sort: "latest",
  });

  const [featured, ...headlines] = result.items;

  return {
    featured: featured ?? null,
    headlines: headlines.slice(0, HOMEPAGE_LIMITS.heroHeadlines),
  };
}

export async function getBreakingNews(): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.breakingNews,
    sort: "latest",
  });
}

export async function getLatestNews(): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.latestNews,
    sort: "latest",
  });
}

export async function getEditorsPicks(): Promise<ArticleListResult> {
  return fetchArticles({
    page: 1,
    limit: HOMEPAGE_LIMITS.editorsPicks,
    sort: "popular",
  });
}

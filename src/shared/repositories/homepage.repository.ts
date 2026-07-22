import {
  HOMEPAGE_LIMITS,
  HOMEPAGE_PLACEMENTS,
} from "@/shared/constants/homepage.constants";
import { fetchArticles } from "@/shared/services/article.service";
import { fetchCategories } from "@/shared/services/category.service";
import { fetchTopics } from "@/shared/services/topic.service";
import type { ArticlePlacement } from "@/shared/types/api.types";
import type { Article, ContentLocale } from "@/shared/types/article.types";
import type { CategoryNewsGroup } from "@/shared/types/category.types";
import type { HomepageNewsData } from "@/shared/types/homepage.types";
import type { TopicNewsGroup } from "@/shared/types/topic.types";
import { takeUniqueArticles } from "@/shared/utils/unique-articles";

async function fetchByPlacement(
  placement: ArticlePlacement,
  limit: number,
  lang: ContentLocale,
): Promise<Article[]> {
  const result = await fetchArticles({
    page: 1,
    limit,
    placement,
    sort: "latest",
    lang,
  });
  return result.items;
}

function collectIds(articles: Article[], into: Set<string>) {
  for (const article of articles) {
    into.add(article.id);
  }
}

async function buildCategoryGroups(
  lang: ContentLocale,
  usedIds: Set<string>,
): Promise<CategoryNewsGroup[]> {
  const categories = await fetchCategories({
    page: 1,
    limit: HOMEPAGE_LIMITS.taxonomyCandidates,
  });

  const groups: CategoryNewsGroup[] = [];

  for (const category of categories.items) {
    if (groups.length >= HOMEPAGE_LIMITS.categoryGroups) break;

    const result = await fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.taxonomyFetchLimit,
      category_id: category.id,
      sort: "latest",
      lang,
    });

    const articles = takeUniqueArticles(
      result.items,
      HOMEPAGE_LIMITS.categoryArticles,
      usedIds,
    );

    if (articles.length > 0) {
      groups.push({ category, articles });
    }
  }

  return groups;
}

async function buildTopicGroups(
  lang: ContentLocale,
  usedIds: Set<string>,
): Promise<TopicNewsGroup[]> {
  const topics = await fetchTopics({
    page: 1,
    limit: HOMEPAGE_LIMITS.taxonomyCandidates,
  });

  const groups: TopicNewsGroup[] = [];

  for (const topic of topics.items) {
    if (groups.length >= HOMEPAGE_LIMITS.topicGroups) break;

    const result = await fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.taxonomyFetchLimit,
      topic_id: topic.id,
      sort: "latest",
      lang,
    });

    const articles = takeUniqueArticles(
      result.items,
      HOMEPAGE_LIMITS.topicArticles,
      usedIds,
    );

    if (articles.length > 0) {
      groups.push({ topic, articles });
    }
  }

  return groups;
}

/**
 * Homepage feed driven by CMS placement tags.
 * Placement sections can intentionally share an article when it has multiple tags.
 * Taxonomy blocks still de-dupe against those IDs to reduce repetition.
 */
export async function getHomepageNews(
  lang: ContentLocale = "id",
): Promise<HomepageNewsData> {
  const [heroItems, headlines, trending, latest, popularPool] =
    await Promise.all([
      fetchByPlacement(
        HOMEPAGE_PLACEMENTS.hero,
        HOMEPAGE_LIMITS.heroFeatured,
        lang,
      ),
      fetchByPlacement(
        HOMEPAGE_PLACEMENTS.headline,
        HOMEPAGE_LIMITS.heroHeadlines,
        lang,
      ),
      fetchByPlacement(
        HOMEPAGE_PLACEMENTS.trending,
        HOMEPAGE_LIMITS.breakingNews,
        lang,
      ),
      fetchByPlacement(
        HOMEPAGE_PLACEMENTS.latestNews,
        HOMEPAGE_LIMITS.latestNews,
        lang,
      ),
      fetchArticles({
        page: 1,
        limit: HOMEPAGE_LIMITS.editorsPicks,
        sort: "popular",
        lang,
      }),
    ]);

  const usedIds = new Set<string>();
  collectIds(heroItems, usedIds);
  collectIds(headlines, usedIds);
  collectIds(trending, usedIds);
  collectIds(latest, usedIds);

  const topics = await buildTopicGroups(lang, usedIds);
  const categories = await buildCategoryGroups(lang, usedIds);

  return {
    hero: {
      featured: heroItems[0] ?? null,
      headlines,
    },
    breaking: trending,
    latest,
    categories,
    topics,
    editors: popularPool.items.slice(0, HOMEPAGE_LIMITS.editorsPicks),
  };
}

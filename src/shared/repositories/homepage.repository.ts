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

const EMPTY_ARTICLE_LIST = {
  items: [] as Article[],
  total: 0,
  page: 1,
  limit: 0,
  totalPages: 0,
};

async function safeFetchArticles(
  params: Parameters<typeof fetchArticles>[0],
): Promise<typeof EMPTY_ARTICLE_LIST> {
  try {
    const result = await fetchArticles(params);
    return {
      items: result?.items ?? [],
      total: result?.total ?? 0,
      page: result?.page ?? 1,
      limit: result?.limit ?? 0,
      totalPages: result?.totalPages ?? 0,
    };
  } catch {
    return EMPTY_ARTICLE_LIST;
  }
}

async function fetchByPlacement(
  placement: ArticlePlacement,
  limit: number,
  lang: ContentLocale,
): Promise<Article[]> {
  const result = await safeFetchArticles({
    page: 1,
    limit,
    placement,
    sort: "latest",
    lang,
  });
  return result.items;
}

async function buildCategoryGroups(
  lang: ContentLocale,
  usedIds: Set<string>,
): Promise<CategoryNewsGroup[]> {
  let categories;
  try {
    categories = await fetchCategories({
      page: 1,
      limit: HOMEPAGE_LIMITS.taxonomyCandidates,
    });
  } catch {
    return [];
  }

  const groups: CategoryNewsGroup[] = [];

  for (const category of categories?.items ?? []) {
    if (groups.length >= HOMEPAGE_LIMITS.categoryGroups) break;

    const result = await safeFetchArticles({
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
  let topics;
  try {
    topics = await fetchTopics({
      page: 1,
      limit: HOMEPAGE_LIMITS.taxonomyCandidates,
    });
  } catch {
    return [];
  }

  const groups: TopicNewsGroup[] = [];

  for (const topic of topics?.items ?? []) {
    if (groups.length >= HOMEPAGE_LIMITS.topicGroups) break;

    const result = await safeFetchArticles({
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
 * Homepage feed driven by CMS placement tags, with scoped taxonomy de-dup:
 * - Primary sections (hero, headlines, trending, latest) come from placements
 *   and may intentionally share an article when it has multiple tags.
 * - Taxonomy sections (category + topic) share a separate used-id set so they
 *   stay filled even on a small catalog.
 * - Category is built before topic so By Category is not starved.
 * - Section fetch failures degrade to empty arrays so one bad API cannot
 *   crash the whole homepage Error Boundary.
 */
export async function getHomepageNews(
  lang: ContentLocale = "id",
): Promise<HomepageNewsData> {
  const taxonomyUsedIds = new Set<string>();

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
      safeFetchArticles({
        page: 1,
        limit: HOMEPAGE_LIMITS.editorsPicks,
        sort: "popular",
        lang,
      }),
    ]);

  const categories = await buildCategoryGroups(lang, taxonomyUsedIds);
  const topics = await buildTopicGroups(lang, taxonomyUsedIds);

  return {
    hero: {
      featured: heroItems[0] ?? null,
      headlines: headlines ?? [],
    },
    breaking: trending ?? [],
    latest: latest ?? [],
    categories: categories ?? [],
    topics: topics ?? [],
    editors: (popularPool.items ?? []).slice(0, HOMEPAGE_LIMITS.editorsPicks),
  };
}

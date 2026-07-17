import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import { fetchArticles } from "@/shared/services/article.service";
import { fetchCategories } from "@/shared/services/category.service";
import { fetchTopics } from "@/shared/services/topic.service";
import type { ContentLocale } from "@/shared/types/article.types";
import type { CategoryNewsGroup } from "@/shared/types/category.types";
import type { HomepageNewsData } from "@/shared/types/homepage.types";
import type { TopicNewsGroup } from "@/shared/types/topic.types";
import { takeUniqueArticles } from "@/shared/utils/unique-articles";

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
 * Single homepage article feed with strict de-duplication:
 * each article ID appears in at most one section.
 *
 * Allocation order keeps taxonomy sections (category + topic)
 * from being starved by the general latest feed.
 */
export async function getHomepageNews(
  lang: ContentLocale = "id",
): Promise<HomepageNewsData> {
  const usedIds = new Set<string>();

  const [latestPool, popularPool] = await Promise.all([
    fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.articlePool,
      sort: "latest",
      lang,
    }),
    fetchArticles({
      page: 1,
      limit: HOMEPAGE_LIMITS.articlePool,
      sort: "popular",
      lang,
    }),
  ]);

  const heroCount =
    HOMEPAGE_LIMITS.heroFeatured + HOMEPAGE_LIMITS.heroHeadlines;
  const heroItems = takeUniqueArticles(latestPool.items, heroCount, usedIds);
  const [featured, ...headlines] = heroItems;

  // Topic then category so taxonomy sections get dedicated unique articles
  // (an article cannot appear in both).
  const topics = await buildTopicGroups(lang, usedIds);
  const categories = await buildCategoryGroups(lang, usedIds);

  const breaking = takeUniqueArticles(
    latestPool.items,
    HOMEPAGE_LIMITS.breakingNews,
    usedIds,
  );

  const latest = takeUniqueArticles(
    latestPool.items,
    HOMEPAGE_LIMITS.latestNews,
    usedIds,
  );

  // Popular keeps its own ranking (like before) and always shows a full list.
  const editors = popularPool.items.slice(0, HOMEPAGE_LIMITS.editorsPicks);

  return {
    hero: {
      featured: featured ?? null,
      headlines: headlines.slice(0, HOMEPAGE_LIMITS.heroHeadlines),
    },
    breaking,
    latest,
    categories,
    topics,
    editors,
  };
}

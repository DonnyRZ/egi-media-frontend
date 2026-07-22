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
 * Homepage article feed with scoped de-duplication:
 * - Primary feeds (hero, breaking, latest) never repeat the same article.
 * - Taxonomy sections (topic + category) share a separate used-id set so they
 *   stay filled even on a small catalog, without starving Latest News.
 * - An article may appear in both a primary feed and a taxonomy column —
 *   the same pattern used by Bloomberg / Semafor category rails.
 */
export async function getHomepageNews(
  lang: ContentLocale = "id",
): Promise<HomepageNewsData> {
  const primaryUsedIds = new Set<string>();
  const taxonomyUsedIds = new Set<string>();

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
  const heroItems = takeUniqueArticles(
    latestPool.items,
    heroCount,
    primaryUsedIds,
  );
  const [featured, ...headlines] = heroItems;

  const breaking = takeUniqueArticles(
    latestPool.items,
    HOMEPAGE_LIMITS.breakingNews,
    primaryUsedIds,
  );

  const latest = takeUniqueArticles(
    latestPool.items,
    HOMEPAGE_LIMITS.latestNews,
    primaryUsedIds,
  );

  // Category before topic so the By Category section is never empty when
  // both compete for the same small taxonomy pool.
  const categories = await buildCategoryGroups(lang, taxonomyUsedIds);
  const topics = await buildTopicGroups(lang, taxonomyUsedIds);

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

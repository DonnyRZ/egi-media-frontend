import { fetchTopics } from "@/shared/services/topic.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { Topic, TopicListResult } from "@/shared/types/topic.types";
import { TAXONOMY_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

export async function getTopics(
  params: TaxonomyListParams,
): Promise<TopicListResult> {
  return fetchTopics(params);
}

export async function getTopicsPage(page = 1): Promise<TopicListResult> {
  return fetchTopics({
    page,
    limit: TAXONOMY_PAGE_LIMIT,
  });
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const result = await fetchTopics({
    page: 1,
    limit: TAXONOMY_PAGE_LIMIT,
  });

  return result.items.find((topic) => topic.slug === slug) ?? null;
}

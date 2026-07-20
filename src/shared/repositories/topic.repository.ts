import {
  fetchTopicBySlug,
  fetchTopics,
} from "@/shared/services/topic.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { Topic, TopicListResult } from "@/shared/types/topic.types";
import { TAXONOMY_PAGE_LIMIT } from "@/shared/constants/taxonomy.constants";

export async function getTopics(
  params: TaxonomyListParams,
): Promise<TopicListResult> {
  return fetchTopics(params);
}

export async function getTopicsPage(
  page = 1,
  lang: ContentLocale = "id",
): Promise<TopicListResult> {
  return fetchTopics({
    page,
    limit: TAXONOMY_PAGE_LIMIT,
    lang,
  });
}

export async function getTopicBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<Topic | null> {
  return fetchTopicBySlug(slug, lang);
}

import { fetchTopics } from "@/shared/services/topic.service";
import type { TaxonomyListParams } from "@/shared/types/api.types";
import type { TopicListResult } from "@/shared/types/topic.types";

export async function getTopics(
  params: TaxonomyListParams,
): Promise<TopicListResult> {
  return fetchTopics(params);
}

import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapTopicListDto } from "@/shared/mappers/topic.mapper";
import type {
  PaginatedApiResponse,
  TaxonomyListParams,
} from "@/shared/types/api.types";
import type { TopicListResult } from "@/shared/types/topic.types";

interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function fetchTopics(
  params: TaxonomyListParams,
): Promise<TopicListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<TopicDto>>(
    API_ENDPOINTS.topics,
    { params },
  );

  return mapTopicListDto({
    items: response.data.data,
    meta: { total: response.data.meta?.total ?? 0 },
  });
}

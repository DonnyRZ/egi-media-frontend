import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapTopicDto, mapTopicListDto } from "@/shared/mappers/topic.mapper";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
  TaxonomyListParams,
} from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { Topic, TopicListResult } from "@/shared/types/topic.types";

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

export async function fetchTopicBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<Topic | null> {
  try {
    const response = await axiosClient.get<ApiSuccessResponse<TopicDto>>(
      API_ENDPOINTS.topicById(slug),
      { params: { lang } },
    );
    return mapTopicDto(response.data.data);
  } catch {
    return null;
  }
}

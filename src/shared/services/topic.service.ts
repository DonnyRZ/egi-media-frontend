import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import {
  mapTopicDetailDto,
  mapTopicListDto,
} from "@/shared/mappers/topic.mapper";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
  TaxonomyListParams,
} from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";
import type { TopicDetail, TopicListResult } from "@/shared/types/topic.types";

interface TopicDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  locale?: ContentLocale;
  available_locales?: ContentLocale[];
  translations?: Partial<
    Record<
      ContentLocale,
      { name: string; slug: string | null; description: string | null }
    >
  >;
  category_id?: string | null;
  category?: { id: string; name: string; slug?: string | null } | null;
}

export async function fetchTopics(
  params: TaxonomyListParams,
): Promise<TopicListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<TopicDto>>(
    API_ENDPOINTS.topics,
    { params },
  );

  return mapTopicListDto({
    items: response.data?.data ?? [],
    meta: { total: response.data?.meta?.total ?? 0 },
  });
}

export async function fetchTopicBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<TopicDetail | null> {
  try {
    const response = await axiosClient.get<ApiSuccessResponse<TopicDto>>(
      API_ENDPOINTS.topicById(slug),
      { params: { lang } },
    );
    return mapTopicDetailDto(response.data.data);
  } catch {
    return null;
  }
}

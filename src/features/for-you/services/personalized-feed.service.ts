import { PERSONALIZED_FEED_ENDPOINTS } from "@/features/for-you/constants/for-you.constants";
import {
  mapArticleListDto,
  type ArticleListItemDto,
} from "@/shared/mappers/article.mapper";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ArticleListResult, ContentLocale } from "@/shared/types/article.types";

interface PersonalizedListResponseDto {
  items: ArticleListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export async function fetchPersonalizedArticles(
  params: { page?: number; limit?: number } = {},
  lang: ContentLocale = "id",
): Promise<ArticleListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<PersonalizedListResponseDto>
  >(PERSONALIZED_FEED_ENDPOINTS.list, {
    params: { ...params, lang },
  });

  return mapArticleListDto(response.data.data);
}

import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import {
  mapArticleListDto,
  type ArticleListItemDto,
} from "@/shared/mappers/article.mapper";
import type { ApiSuccessResponse, ArticleListParams } from "@/shared/types/api.types";
import type { ArticleListResult } from "@/shared/types/article.types";

interface ArticleListResponseDto {
  items: ArticleListItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export async function fetchArticles(
  params: ArticleListParams,
): Promise<ArticleListResult> {
  const response = await axiosClient.get<ApiSuccessResponse<ArticleListResponseDto>>(
    API_ENDPOINTS.articles,
    { params },
  );

  return mapArticleListDto(response.data.data);
}

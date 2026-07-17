import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import {
  mapArticleDetailDto,
  mapArticleListDto,
  type ArticleDetailDto,
  type ArticleListItemDto,
} from "@/shared/mappers/article.mapper";
import type { ApiSuccessResponse, ArticleListParams } from "@/shared/types/api.types";
import type {
  ArticleDetail,
  ArticleListResult,
  ContentLocale,
  SharePlatform,
} from "@/shared/types/article.types";
import { normalizeArticleSlug } from "@/shared/utils/article-path";

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

export async function fetchArticleById(
  id: string,
  lang: ContentLocale = "id",
): Promise<ArticleDetail> {
  const response = await axiosClient.get<ApiSuccessResponse<ArticleDetailDto>>(
    API_ENDPOINTS.articleById(id),
    { params: { lang } },
  );

  return mapArticleDetailDto(response.data.data);
}

export async function fetchArticleBySlug(
  slug: string,
  lang: ContentLocale = "id",
): Promise<ArticleDetail> {
  const normalizedSlug = normalizeArticleSlug(slug);
  const response = await axiosClient.get<ApiSuccessResponse<ArticleDetailDto>>(
    API_ENDPOINTS.articleBySlug(normalizedSlug),
    { params: { lang } },
  );

  return mapArticleDetailDto(response.data.data);
}

export async function recordArticleView(articleId: string): Promise<number | null> {
  const response = await axiosClient.post<ApiSuccessResponse<{ view_count: number | null }>>(
    API_ENDPOINTS.articleView(articleId),
  );

  return response.data.data.view_count;
}

export async function recordArticleShare(
  articleId: string,
  platform: SharePlatform,
): Promise<number | null> {
  const response = await axiosClient.post<ApiSuccessResponse<{ share_count: number | null }>>(
    API_ENDPOINTS.articleShare(articleId),
    { platform },
  );

  return response.data.data.share_count;
}

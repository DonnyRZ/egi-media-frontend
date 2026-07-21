import {
  ALREADY_SAVED_STATUS,
  NOT_FOUND_STATUS,
  SAVED_ARTICLE_ENDPOINTS,
} from "@/features/saved-articles/constants/saved-article.constants";
import {
  mapSavedArticleList,
  type SavedArticleDto,
} from "@/features/saved-articles/mappers/saved-article.mapper";
import type {
  SavedArticleListParams,
  SavedArticleListResult,
} from "@/features/saved-articles/types/saved-article.types";
import { axiosClient } from "@/shared/lib/axios-client";
import { ApiError } from "@/shared/lib/errors";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { ContentLocale } from "@/shared/types/article.types";

interface SavedArticleListResponseDto {
  items: SavedArticleDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export async function fetchSavedArticles(
  params: SavedArticleListParams = {},
  lang: ContentLocale = "id",
): Promise<SavedArticleListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<SavedArticleListResponseDto>
  >(SAVED_ARTICLE_ENDPOINTS.list, { params: { ...params, lang } });

  return mapSavedArticleList(response.data.data);
}

export async function saveArticle(id: string): Promise<void> {
  try {
    await axiosClient.post(SAVED_ARTICLE_ENDPOINTS.save(id));
  } catch (error) {
    // Treat "already saved" as success so the toggle stays idempotent.
    if (error instanceof ApiError && error.statusCode === ALREADY_SAVED_STATUS) {
      return;
    }
    throw error;
  }
}

export async function unsaveArticle(id: string): Promise<void> {
  try {
    await axiosClient.delete(SAVED_ARTICLE_ENDPOINTS.save(id));
  } catch (error) {
    // Treat "not saved" as success so the toggle stays idempotent.
    if (error instanceof ApiError && error.statusCode === NOT_FOUND_STATUS) {
      return;
    }
    throw error;
  }
}

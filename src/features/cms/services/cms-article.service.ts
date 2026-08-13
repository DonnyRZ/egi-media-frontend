import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";
import {
  mapCmsArticleDetail,
  mapCmsArticleListItem,
  type CmsArticleDetailDto,
  type CmsArticleListItemDto,
} from "@/features/cms/mappers/cms.mapper";
import type {
  ArticleStatus,
  ArticleWritePayload,
  CmsArticleDetail,
  CmsArticleListResult,
  CmsMyArticlesParams,
} from "@/features/cms/types/cms.types";

interface CmsArticleListResponseDto {
  items: CmsArticleListItemDto[];
  meta: PaginatedMeta;
}

/**
 * Author's own articles across every status. Used for dashboard "my" stats.
 */
export async function fetchMyArticles(
  params: CmsMyArticlesParams,
): Promise<CmsArticleListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<CmsArticleListResponseDto>
  >(API_ENDPOINTS.articlesMe, {
    params: {
      page: params.page,
      limit: params.limit,
      status: params.status || undefined,
    },
  });

  const { items, meta } = response.data.data;
  return {
    items: items.map(mapCmsArticleListItem),
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.total_pages,
  };
}

/**
 * All articles across every author and status (editorial oversight). Available
 * to authors (view-all, edit-own) and superadmin (full control). Ownership is
 * enforced by the backend on edit/delete/status.
 */
export interface ManageArticlesParams extends CmsMyArticlesParams {
  search?: string;
  categoryId?: string;
  topicId?: string;
  tagId?: string;
  seriesId?: string;
}

export async function fetchManageArticles(
  params: ManageArticlesParams,
): Promise<CmsArticleListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<CmsArticleListResponseDto>
  >(API_ENDPOINTS.articlesManage, {
    params: {
      page: params.page,
      limit: params.limit,
      status: params.status || undefined,
      search: params.search || undefined,
      category_id: params.categoryId || undefined,
      topic_id: params.topicId || undefined,
      tag_id: params.tagId || undefined,
      series_id: params.seriesId || undefined,
    },
  });

  const { items, meta } = response.data.data;
  return {
    items: items.map(mapCmsArticleListItem),
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages: meta.total_pages,
  };
}

export async function fetchCmsArticleById(
  id: string,
): Promise<CmsArticleDetail> {
  const response = await axiosClient.get<ApiSuccessResponse<CmsArticleDetailDto>>(
    API_ENDPOINTS.articleById(id),
  );
  return mapCmsArticleDetail(response.data.data);
}

function toArticleDto(payload: ArticleWritePayload) {
  const dto: Record<string, unknown> = {};
  if (payload.title !== undefined) dto.title = payload.title;
  if (payload.content !== undefined) dto.content = payload.content;
  if (payload.summary !== undefined) dto.summary = payload.summary;
  if (payload.featuredImage !== undefined)
    dto.featured_image = payload.featuredImage || null;
  if (payload.categoryId !== undefined) dto.category_id = payload.categoryId;
  if (payload.seriesId !== undefined) dto.series_id = payload.seriesId;
  if (payload.status !== undefined) dto.status = payload.status;
  if (payload.publishedAt !== undefined) dto.published_at = payload.publishedAt;
  if (payload.topicId !== undefined) dto.topic_id = payload.topicId || null;
  if (payload.tagIds !== undefined) dto.tag_ids = payload.tagIds;
  if (payload.placements !== undefined) dto.placements = payload.placements;
  if (payload.translations && Object.keys(payload.translations).length > 0) {
    dto.translations = payload.translations;
  }
  return dto;
}

export async function createArticle(
  payload: ArticleWritePayload,
): Promise<string> {
  const response = await axiosClient.post<ApiSuccessResponse<{ id: string }>>(
    API_ENDPOINTS.articles,
    toArticleDto(payload),
  );
  return response.data.data.id;
}

export async function updateArticle(
  id: string,
  payload: ArticleWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.articleById(id), toArticleDto(payload));
}

export async function deleteArticle(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.articleById(id));
}

export async function changeArticleStatus(
  id: string,
  status: ArticleStatus,
  publishedAt?: string | null,
): Promise<void> {
  await axiosClient.patch(API_ENDPOINTS.articleStatus(id), {
    status,
    published_at: publishedAt ?? undefined,
  });
}

export async function updateArticlePlacements(
  id: string,
  placements: ArticleWritePayload["placements"],
  headlinePosition?: number | null,
): Promise<void> {
  await axiosClient.patch(API_ENDPOINTS.articlePlacements(id), {
    placements: placements ?? [],
    headline_position: headlinePosition ?? null,
  });
}

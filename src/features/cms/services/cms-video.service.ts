import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";

export interface CmsVideo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  isActive: boolean;
  createdAt: string | null;
}

interface CmsVideoDto {
  id: string;
  title: string;
  description: string | null;
  url: string;
  is_active?: boolean;
  created_at?: string | null;
}

function mapVideo(dto: CmsVideoDto): CmsVideo {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    url: dto.url,
    isActive: dto.is_active !== false,
    createdAt: dto.created_at ?? null,
  };
}

export interface CmsVideosParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CmsVideoListResult {
  items: CmsVideo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchCmsVideos(
  params: CmsVideosParams,
): Promise<CmsVideoListResult> {
  const response = await axiosClient.get<{
    data: CmsVideoDto[];
    meta: PaginatedMeta;
  }>(API_ENDPOINTS.youtubeVideos, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      active: "all",
    },
  });

  const items = response.data.data ?? [];
  const meta = response.data.meta;
  return {
    items: items.map(mapVideo),
    total: meta?.total ?? items.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 20,
    totalPages: meta?.total_pages ?? 1,
  };
}

export interface CmsVideoWritePayload {
  title: string;
  description?: string;
  url: string;
  isActive: boolean;
}

export async function createCmsVideo(
  payload: CmsVideoWritePayload,
): Promise<CmsVideo> {
  const response = await axiosClient.post<ApiSuccessResponse<CmsVideoDto>>(
    API_ENDPOINTS.youtubeVideos,
    {
      title: payload.title,
      description: payload.description || null,
      url: payload.url,
      is_active: payload.isActive,
    },
  );
  return mapVideo(response.data.data);
}

export async function updateCmsVideo(
  id: string,
  payload: CmsVideoWritePayload,
): Promise<CmsVideo> {
  const response = await axiosClient.put<ApiSuccessResponse<CmsVideoDto>>(
    API_ENDPOINTS.youtubeVideoById(id),
    {
      title: payload.title,
      description: payload.description || null,
      url: payload.url,
      is_active: payload.isActive,
    },
  );
  return mapVideo(response.data.data);
}

export async function deleteCmsVideo(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.youtubeVideoById(id));
}

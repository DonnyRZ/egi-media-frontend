import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";
import { isAdPlacement, type AdPlacement } from "@/shared/types/ads.types";

export type { AdPlacement };

export interface CmsAd {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  isActive: boolean;
  clicks: number;
  impressions: number;
  createdAt: string | null;
  updatedAt: string | null;
}

interface CmsAdDto {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  placement: string;
  is_active?: boolean;
  clicks?: number;
  impressions?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function mapAd(dto: CmsAdDto): CmsAd {
  return {
    id: dto.id,
    title: dto.title,
    imageUrl: dto.image_url,
    targetUrl: dto.target_url,
    placement: isAdPlacement(dto.placement) ? dto.placement : "IN_FEED",
    isActive: dto.is_active !== false,
    clicks: dto.clicks ?? 0,
    impressions: dto.impressions ?? 0,
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
  };
}

export interface CmsAdsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "all";
  placement?: AdPlacement | "all";
}

export interface CmsAdListResult {
  items: CmsAd[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchCmsAds(params: CmsAdsParams): Promise<CmsAdListResult> {
  const response = await axiosClient.get<{
    data: CmsAdDto[];
    meta: PaginatedMeta;
  }>(API_ENDPOINTS.ads, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      active: params.active ?? "all",
      placement: params.placement ?? "all",
    },
  });

  const items = (response.data.data ?? []).filter((dto) =>
    isAdPlacement(dto.placement),
  );
  const meta = response.data.meta;
  return {
    items: items.map(mapAd),
    total: meta?.total ?? items.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 20,
    totalPages: meta?.total_pages ?? 1,
  };
}

export interface CmsAdWritePayload {
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
}

function toDtoBody(payload: CmsAdWritePayload) {
  return {
    title: payload.title,
    image_url: payload.imageUrl,
    target_url: payload.targetUrl,
    is_active: payload.isActive,
  };
}

export async function updateCmsAd(
  id: string,
  payload: CmsAdWritePayload,
): Promise<CmsAd> {
  const response = await axiosClient.put<ApiSuccessResponse<CmsAdDto>>(
    API_ENDPOINTS.adById(id),
    toDtoBody(payload),
  );
  return mapAd(response.data.data);
}

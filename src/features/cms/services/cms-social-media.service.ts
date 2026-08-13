import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";
import type { SocialPlatform } from "@/features/footer/constants/social.constants";
import { isSocialPlatform } from "@/features/footer/constants/social.constants";

export interface CmsSocialMediaLink {
  id: string;
  platformName: string;
  url: string;
  iconName: SocialPlatform;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
}

interface CmsSocialMediaLinkDto {
  id: string;
  platform_name: string;
  url: string;
  icon_name: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function mapSocialMediaLink(dto: CmsSocialMediaLinkDto): CmsSocialMediaLink {
  const iconName = isSocialPlatform(dto.icon_name) ? dto.icon_name : "youtube";
  return {
    id: dto.id,
    platformName: dto.platform_name,
    url: dto.url,
    iconName,
    isActive: dto.is_active !== false,
    sortOrder: dto.sort_order ?? 0,
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
  };
}

export interface CmsSocialMediaLinksParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "all";
}

export interface CmsSocialMediaLinkListResult {
  items: CmsSocialMediaLink[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchCmsSocialMediaLinks(
  params: CmsSocialMediaLinksParams,
): Promise<CmsSocialMediaLinkListResult> {
  const response = await axiosClient.get<{
    data: CmsSocialMediaLinkDto[];
    meta: PaginatedMeta;
  }>(API_ENDPOINTS.socialMediaLinks, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      active: params.active ?? "all",
    },
  });

  const items = response.data.data ?? [];
  const meta = response.data.meta;
  return {
    items: items.map(mapSocialMediaLink),
    total: meta?.total ?? items.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 20,
    totalPages: meta?.total_pages ?? 1,
  };
}

export interface CmsSocialMediaLinkWritePayload {
  platformName: string;
  url: string;
  iconName: SocialPlatform;
  isActive: boolean;
  sortOrder: number;
}

function toDtoBody(payload: CmsSocialMediaLinkWritePayload) {
  return {
    platform_name: payload.platformName,
    url: payload.url,
    icon_name: payload.iconName,
    is_active: payload.isActive,
    sort_order: payload.sortOrder,
  };
}

export async function createCmsSocialMediaLink(
  payload: CmsSocialMediaLinkWritePayload,
): Promise<CmsSocialMediaLink> {
  const response = await axiosClient.post<ApiSuccessResponse<CmsSocialMediaLinkDto>>(
    API_ENDPOINTS.socialMediaLinks,
    toDtoBody(payload),
  );
  return mapSocialMediaLink(response.data.data);
}

export async function updateCmsSocialMediaLink(
  id: string,
  payload: CmsSocialMediaLinkWritePayload,
): Promise<CmsSocialMediaLink> {
  const response = await axiosClient.put<ApiSuccessResponse<CmsSocialMediaLinkDto>>(
    API_ENDPOINTS.socialMediaLinkById(id),
    toDtoBody(payload),
  );
  return mapSocialMediaLink(response.data.data);
}

export async function deleteCmsSocialMediaLink(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.socialMediaLinkById(id));
}

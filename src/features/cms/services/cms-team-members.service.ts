import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";

export interface CmsTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
}

interface CmsTeamMemberDto {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo_url: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

function mapTeamMember(dto: CmsTeamMemberDto): CmsTeamMember {
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role,
    bio: dto.bio ?? null,
    photoUrl: dto.photo_url,
    isActive: dto.is_active !== false,
    sortOrder: dto.sort_order ?? 0,
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
  };
}

export interface CmsTeamMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "all";
}

export interface CmsTeamMemberListResult {
  items: CmsTeamMember[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchCmsTeamMembers(
  params: CmsTeamMembersParams,
): Promise<CmsTeamMemberListResult> {
  const response = await axiosClient.get<{
    data: CmsTeamMemberDto[];
    meta: PaginatedMeta;
  }>(API_ENDPOINTS.teamMembers, {
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
    items: items.map(mapTeamMember),
    total: meta?.total ?? items.length,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 20,
    totalPages: meta?.total_pages ?? 1,
  };
}

export interface CmsTeamMemberWritePayload {
  name: string;
  role: string;
  bio?: string | null;
  photoUrl: string;
  isActive: boolean;
  sortOrder: number;
}

function toDtoBody(payload: CmsTeamMemberWritePayload) {
  return {
    name: payload.name,
    role: payload.role,
    bio: payload.bio || null,
    photo_url: payload.photoUrl,
    is_active: payload.isActive,
    sort_order: payload.sortOrder,
  };
}

export async function createCmsTeamMember(
  payload: CmsTeamMemberWritePayload,
): Promise<CmsTeamMember> {
  const response = await axiosClient.post<ApiSuccessResponse<CmsTeamMemberDto>>(
    API_ENDPOINTS.teamMembers,
    toDtoBody(payload),
  );
  return mapTeamMember(response.data.data);
}

export async function updateCmsTeamMember(
  id: string,
  payload: CmsTeamMemberWritePayload,
): Promise<CmsTeamMember> {
  const response = await axiosClient.put<ApiSuccessResponse<CmsTeamMemberDto>>(
    API_ENDPOINTS.teamMemberById(id),
    toDtoBody(payload),
  );
  return mapTeamMember(response.data.data);
}

export async function deleteCmsTeamMember(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.teamMemberById(id));
}

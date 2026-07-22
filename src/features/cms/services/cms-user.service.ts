import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse, PaginatedMeta } from "@/shared/types/api.types";
import { mapCmsUser, type CmsUserDto } from "@/features/cms/mappers/cms.mapper";
import type { CmsUserListResult } from "@/features/cms/types/cms.types";

export interface CmsUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

interface CmsUserListResponseDto {
  items: CmsUserDto[];
  meta: PaginatedMeta;
}

export async function fetchUsers(
  params: CmsUsersParams,
): Promise<CmsUserListResult> {
  // Backend envelope for user list is `data: { items, meta }` (not `data: [] + meta`).
  const response = await axiosClient.get<
    ApiSuccessResponse<CmsUserListResponseDto>
  >(API_ENDPOINTS.users, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      role: params.role || undefined,
    },
  });

  const { items, meta } = response.data.data;
  return {
    items: (items ?? []).map(mapCmsUser),
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 10,
    totalPages: meta?.total_pages ?? 1,
  };
}

export interface UpdateUserPayload {
  fullName?: string;
  role?: string;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<void> {
  await axiosClient.patch(API_ENDPOINTS.userById(id), {
    full_name: payload.fullName,
    role: payload.role,
  });
}

export async function deleteUser(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.userById(id));
}

export interface AddAuthorPayload {
  email: string;
  password: string;
  fullName: string;
  role: "author" | "superadmin";
}

export async function addAuthor(payload: AddAuthorPayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.adminUsers, {
    email: payload.email,
    password: payload.password,
    full_name: payload.fullName,
    role: payload.role,
  });
}

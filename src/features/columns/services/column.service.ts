import {
  mapColumnDetailDto,
  mapColumnListDto,
} from "@/features/columns/mappers/column.mapper";
import {
  COLUMN_ALREADY_SAVED_STATUS,
  COLUMN_NOT_SAVED_STATUS,
} from "@/features/columns/constants/column.constants";
import type {
  ColumnDetail,
  ColumnListParams,
  ColumnListResult,
  ColumnWritePayload,
  MyColumnsParams,
} from "@/features/columns/types/column.types";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import { ApiError } from "@/shared/lib/errors";
import type {
  ApiSuccessResponse,
} from "@/shared/types/api.types";
import type { SharePlatform } from "@/shared/types/article.types";

interface ColumnListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured_image?: string | null;
  status: ColumnDetail["status"];
  rejection_reason?: string | null;
  published_at?: string | null;
  created_at: string;
  saved_at?: string | null;
  author: {
    id: string;
    full_name: string;
    role?: string | null;
  };
}

interface ColumnDetailDto extends ColumnListItemDto {
  content: string;
  translations?: ColumnDetail["translations"];
  view_count?: number;
  share_count?: number;
}

interface ColumnMutationDto {
  id: string;
  slug: string;
  status?: ColumnDetail["status"];
}

export async function fetchColumns(
  params: ColumnListParams,
): Promise<ColumnListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<{
      items: ColumnListItemDto[];
      meta: {
        total: number;
        page?: number;
        limit?: number;
        total_pages?: number;
      };
    }>
  >(API_ENDPOINTS.columns, { params });

  return mapColumnListDto(response.data.data);
}

export async function fetchMyColumns(
  params: MyColumnsParams,
): Promise<ColumnListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<{
      items: ColumnListItemDto[];
      meta: {
        total: number;
        page?: number;
        limit?: number;
        total_pages?: number;
      };
    }>
  >(API_ENDPOINTS.columnsMe, { params });

  return mapColumnListDto(response.data.data);
}

export async function fetchSavedColumns(
  params: { page?: number; limit?: number; lang?: ColumnListParams["lang"] } = {},
): Promise<ColumnListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<{
      items: ColumnListItemDto[];
      meta: {
        total: number;
        page?: number;
        limit?: number;
        total_pages?: number;
      };
    }>
  >(API_ENDPOINTS.columnsSaved, { params });

  return mapColumnListDto(response.data.data);
}

export async function fetchColumnBySlug(
  slug: string,
  lang: ColumnListParams["lang"] = "id",
): Promise<ColumnDetail> {
  const response = await axiosClient.get<ApiSuccessResponse<ColumnDetailDto>>(
    API_ENDPOINTS.columnBySlug(slug),
    { params: { lang } },
  );

  return mapColumnDetailDto(response.data.data);
}

export async function fetchMyColumnById(
  id: string,
  lang: ColumnListParams["lang"] = "id",
): Promise<ColumnDetail> {
  const response = await axiosClient.get<ApiSuccessResponse<ColumnDetailDto>>(
    API_ENDPOINTS.columnMeById(id),
    { params: { lang } },
  );

  return mapColumnDetailDto(response.data.data);
}

export async function createColumn(
  payload: ColumnWritePayload,
): Promise<ColumnMutationDto> {
  const response = await axiosClient.post<ApiSuccessResponse<ColumnMutationDto>>(
    API_ENDPOINTS.columns,
    payload,
  );

  return response.data.data;
}

export async function updateColumn(
  id: string,
  payload: Omit<ColumnWritePayload, "status">,
): Promise<ColumnMutationDto> {
  const response = await axiosClient.put<ApiSuccessResponse<ColumnMutationDto>>(
    API_ENDPOINTS.columnById(id),
    payload,
  );

  return response.data.data;
}

export async function deleteColumn(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.columnById(id));
}

export async function submitColumn(id: string): Promise<ColumnMutationDto> {
  const response = await axiosClient.post<ApiSuccessResponse<ColumnMutationDto>>(
    API_ENDPOINTS.columnSubmit(id),
  );

  return response.data.data;
}

export async function recordColumnView(
  columnId: string,
): Promise<number | null> {
  const response = await axiosClient.post<
    ApiSuccessResponse<{ view_count: number | null }>
  >(API_ENDPOINTS.columnView(columnId));

  return response.data.data.view_count;
}

export async function recordColumnShare(
  columnId: string,
  platform: SharePlatform,
): Promise<number | null> {
  const response = await axiosClient.post<
    ApiSuccessResponse<{ share_count: number | null }>
  >(API_ENDPOINTS.columnShare(columnId), { platform });

  return response.data.data.share_count;
}

export async function saveColumn(columnId: string): Promise<void> {
  try {
    await axiosClient.post(API_ENDPOINTS.columnSave(columnId));
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.statusCode === COLUMN_ALREADY_SAVED_STATUS
    ) {
      return;
    }
    throw error;
  }
}

export async function unsaveColumn(columnId: string): Promise<void> {
  try {
    await axiosClient.delete(API_ENDPOINTS.columnSave(columnId));
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.statusCode === COLUMN_NOT_SAVED_STATUS
    ) {
      return;
    }
    throw error;
  }
}

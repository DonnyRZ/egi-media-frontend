import {
  mapColumnDetailDto,
  mapColumnListDto,
} from "@/features/columns/mappers/column.mapper";
import type {
  ColumnDetail,
  ColumnListResult,
  ColumnStatus,
  ColumnWritePayload,
} from "@/features/columns/types/column.types";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

export interface ManageColumnsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ColumnStatus | "";
}

interface ColumnListResponseDto {
  items: Parameters<typeof mapColumnListDto>[0]["items"];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    total_pages?: number;
  };
}

export async function fetchManageColumns(
  params: ManageColumnsParams,
): Promise<ColumnListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<ColumnListResponseDto>
  >(API_ENDPOINTS.columnsManage, {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search || undefined,
      status: params.status || undefined,
    },
  });

  return mapColumnListDto(response.data.data);
}

export async function fetchCmsColumnById(id: string): Promise<ColumnDetail> {
  const response = await axiosClient.get<
    ApiSuccessResponse<Parameters<typeof mapColumnDetailDto>[0]>
  >(API_ENDPOINTS.columnMeById(id));
  return mapColumnDetailDto(response.data.data);
}

export async function updateCmsColumn(
  id: string,
  payload: Omit<ColumnWritePayload, "status">,
): Promise<{ id: string; slug: string }> {
  const response = await axiosClient.put<
    ApiSuccessResponse<{ id: string; slug: string }>
  >(API_ENDPOINTS.columnById(id), payload);
  return response.data.data;
}

export async function approveCmsColumn(
  id: string,
): Promise<{ id: string; status: string }> {
  const response = await axiosClient.post<
    ApiSuccessResponse<{ id: string; status: string }>
  >(API_ENDPOINTS.columnApprove(id));
  return response.data.data;
}

export async function rejectCmsColumn(
  id: string,
  rejectionReason: string,
): Promise<{ id: string; status: string }> {
  const response = await axiosClient.post<
    ApiSuccessResponse<{ id: string; status: string }>
  >(API_ENDPOINTS.columnReject(id), {
    rejection_reason: rejectionReason,
  });
  return response.data.data;
}

import { mapColumnCommentListDto } from "@/features/columns/mappers/column-comment.mapper";
import type {
  ColumnCommentListResult,
  CreateColumnCommentPayload,
} from "@/features/columns/types/column-comment.types";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { ApiSuccessResponse } from "@/shared/types/api.types";

interface ColumnCommentDto {
  id: string;
  column_id: string;
  parent_id?: string | null;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    role?: string | null;
  };
}

export async function fetchColumnComments(
  columnId: string,
  params: { page?: number; limit?: number } = {},
): Promise<ColumnCommentListResult> {
  const response = await axiosClient.get<
    ApiSuccessResponse<{
      items: ColumnCommentDto[];
      meta: {
        total: number;
        page?: number;
        limit?: number;
        total_pages?: number;
      };
    }>
  >(API_ENDPOINTS.columnComments(columnId), { params });

  return mapColumnCommentListDto(response.data.data);
}

export async function createColumnComment(
  columnId: string,
  payload: CreateColumnCommentPayload,
): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.columnComments(columnId), {
    content: payload.content,
    parent_id: payload.parentId ?? null,
  });
}

export async function deleteColumnComment(
  columnId: string,
  commentId: string,
): Promise<void> {
  await axiosClient.delete(
    API_ENDPOINTS.columnCommentById(columnId, commentId),
  );
}

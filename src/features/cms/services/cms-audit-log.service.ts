import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { PaginatedApiResponse } from "@/shared/types/api.types";
import {
  mapAuditLog,
  type AuditLogDto,
} from "@/features/cms/mappers/cms.mapper";
import type { AuditLogListResult } from "@/features/cms/types/cms.types";

export interface AuditLogParams {
  page?: number;
  limit?: number;
  action?: string;
  search?: string;
  userId?: string;
}

/**
 * Editorial audit trail. Superadmin-only endpoint; callers should gate by role.
 */
export async function fetchAuditLogs(
  params: AuditLogParams,
): Promise<AuditLogListResult> {
  const response = await axiosClient.get<PaginatedApiResponse<AuditLogDto>>(
    API_ENDPOINTS.auditLogs,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        action: params.action || undefined,
        search: params.search || undefined,
        user_id: params.userId || undefined,
      },
    },
  );

  const meta = response.data.meta;
  return {
    items: (response.data.data ?? []).map(mapAuditLog),
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? params.limit ?? 20,
    totalPages: meta?.total_pages ?? 1,
  };
}

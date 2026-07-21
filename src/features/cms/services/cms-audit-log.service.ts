import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { PaginatedApiResponse } from "@/shared/types/api.types";
import {
  mapAuditLog,
  type AuditLogDto,
} from "@/features/cms/mappers/cms.mapper";
import type { AuditLog } from "@/features/cms/types/cms.types";

export interface AuditLogParams {
  page?: number;
  limit?: number;
}

/**
 * Recent editorial activity. Superadmin-only endpoint; callers should guard by
 * role before invoking (authors receive 403).
 */
export async function fetchAuditLogs(
  params: AuditLogParams,
): Promise<AuditLog[]> {
  const response = await axiosClient.get<PaginatedApiResponse<AuditLogDto>>(
    API_ENDPOINTS.auditLogs,
    { params: { page: params.page ?? 1, limit: params.limit ?? 8 } },
  );
  return (response.data.data ?? []).map(mapAuditLog);
}

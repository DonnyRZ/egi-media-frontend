"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import {
  fetchAuditLogs,
  type AuditLogParams,
} from "@/features/cms/services/cms-audit-log.service";

export function useCmsAuditLogs(params: AuditLogParams, enabled = true) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.auditLogs.list(params),
    queryFn: () => fetchAuditLogs(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

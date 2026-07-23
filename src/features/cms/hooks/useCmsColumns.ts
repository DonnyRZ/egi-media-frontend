"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchCmsColumnById,
  fetchManageColumns,
  type ManageColumnsParams,
} from "@/features/cms/services/cms-column.service";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useCmsColumns(params: ManageColumnsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.columns.manage(params as Record<string, unknown>),
    queryFn: () => fetchManageColumns(params),
  });
}

export function useCmsColumn(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.columns.mineDetail(id, "id"),
    queryFn: () => fetchCmsColumnById(id),
    enabled: Boolean(id),
  });
}

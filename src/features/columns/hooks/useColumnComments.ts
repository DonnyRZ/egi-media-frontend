"use client";

import { useQuery } from "@tanstack/react-query";

import { getColumnCommentsPage } from "@/features/columns/repositories/column-comment.repository";
import {
  QUERY_GC_TIME,
  QUERY_STALE_TIME,
} from "@/shared/constants/homepage.constants";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useColumnComments(columnId: string, page = 1) {
  return useQuery({
    queryKey: QUERY_KEYS.columns.comments(columnId, { page }),
    queryFn: () => getColumnCommentsPage(columnId, page),
    enabled: Boolean(columnId),
    staleTime: QUERY_STALE_TIME.homepage,
    gcTime: QUERY_GC_TIME.homepage,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import { fetchViralIssues } from "@/features/cms/services/viral-issue.service";

export function useViralIssues(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CMS_QUERY_KEYS.newsFeed.viral,
    queryFn: fetchViralIssues,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

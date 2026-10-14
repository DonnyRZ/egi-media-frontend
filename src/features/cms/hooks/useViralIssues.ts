"use client";

import { useQuery } from "@tanstack/react-query";

import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import { fetchViralIssues, type RadarParams } from "@/features/cms/services/viral-issue.service";

export function useViralIssues(options?: { enabled?: boolean; windowHours?: number } & RadarParams) {
  const windowHours = options?.windowHours ?? 24;
  const method=options?.candidate ? "candidate" : options?.legacy ? "legacy" : "default";
  return useQuery({
    queryKey: [...CMS_QUERY_KEYS.newsFeed.viral(windowHours), options?.page ?? 1, options?.search ?? "", options?.category ?? "", options?.trend ?? "", method],
    queryFn: () => fetchViralIssues(windowHours, options),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    placeholderData: (data, previous) => previous?.queryKey.at(-1) === method ? data : undefined,
  });
}

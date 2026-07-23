"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  approveCmsColumn,
  rejectCmsColumn,
  updateCmsColumn,
} from "@/features/cms/services/cms-column.service";
import { CMS_QUERY_KEYS } from "@/features/cms/constants/cms.constants";
import type { ColumnWritePayload } from "@/features/columns/types/column.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useCmsColumnMutations() {
  const queryClient = useQueryClient();

  async function invalidateColumns() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.columns.all }),
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.auditLogs.all }),
    ]);
  }

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<ColumnWritePayload, "status">;
    }) => updateCmsColumn(id, payload),
    onSuccess: invalidateColumns,
  });

  const approve = useMutation({
    mutationFn: (id: string) => approveCmsColumn(id),
    onSuccess: invalidateColumns,
  });

  const reject = useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) => rejectCmsColumn(id, rejectionReason),
    onSuccess: invalidateColumns,
  });

  return { update, approve, reject };
}

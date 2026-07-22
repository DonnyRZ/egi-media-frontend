"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createColumnEntry,
  deleteColumnEntry,
  submitColumnEntry,
  updateColumnEntry,
} from "@/features/columns/repositories/column.repository";
import type { ColumnWritePayload } from "@/features/columns/types/column.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys.constants";

export function useColumnMutations() {
  const queryClient = useQueryClient();

  async function invalidateColumns() {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.columns.all });
  }

  const create = useMutation({
    mutationFn: (payload: ColumnWritePayload) => createColumnEntry(payload),
    onSuccess: invalidateColumns,
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<ColumnWritePayload, "status">;
    }) => updateColumnEntry(id, payload),
    onSuccess: invalidateColumns,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteColumnEntry(id),
    onSuccess: invalidateColumns,
  });

  const submit = useMutation({
    mutationFn: (id: string) => submitColumnEntry(id),
    onSuccess: invalidateColumns,
  });

  return { create, update, remove, submit };
}

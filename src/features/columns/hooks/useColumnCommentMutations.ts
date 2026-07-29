"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  postColumnComment,
  removeColumnComment,
} from "@/features/columns/repositories/column-comment.repository";
import type { CreateColumnCommentPayload } from "@/features/columns/types/column-comment.types";

export function useColumnCommentMutations(columnId: string) {
  const queryClient = useQueryClient();

  async function invalidate() {
    await queryClient.invalidateQueries({
      queryKey: ["columns", "comments", columnId],
    });
  }

  const create = useMutation({
    mutationFn: (payload: CreateColumnCommentPayload) =>
      postColumnComment(columnId, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (commentId: string) =>
      removeColumnComment(columnId, commentId),
    onSuccess: invalidate,
  });

  return { create, remove };
}

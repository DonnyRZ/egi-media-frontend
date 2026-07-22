import { COLUMN_COMMENTS_PAGE_LIMIT } from "@/features/columns/constants/column.constants";
import {
  createColumnComment,
  deleteColumnComment,
  fetchColumnComments,
} from "@/features/columns/services/column-comment.service";
import type { ColumnCommentListResult } from "@/features/columns/types/column-comment.types";

export async function getColumnCommentsPage(
  columnId: string,
  page = 1,
): Promise<ColumnCommentListResult> {
  return fetchColumnComments(columnId, {
    page,
    limit: COLUMN_COMMENTS_PAGE_LIMIT,
  });
}

export async function postColumnComment(
  columnId: string,
  content: string,
): Promise<void> {
  return createColumnComment(columnId, content);
}

export async function removeColumnComment(
  columnId: string,
  commentId: string,
): Promise<void> {
  return deleteColumnComment(columnId, commentId);
}

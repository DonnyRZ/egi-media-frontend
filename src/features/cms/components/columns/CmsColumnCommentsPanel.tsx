"use client";

import { useMemo, useState } from "react";

import { useColumnCommentMutations } from "@/features/columns/hooks/useColumnCommentMutations";
import { useColumnComments } from "@/features/columns/hooks/useColumnComments";
import { buildCommentTree } from "@/features/columns/mappers/column-comment.mapper";
import type {
  ColumnComment,
  ColumnCommentNode,
} from "@/features/columns/types/column-comment.types";
import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { cn } from "@/shared/lib/cn";

interface CmsColumnCommentsPanelProps {
  columnId: string;
  columnStatus: string;
}

function ModerationComment({
  comment,
  depth,
  onDelete,
  deletingId,
}: {
  comment: ColumnCommentNode;
  depth: number;
  onDelete: (comment: ColumnComment) => void;
  deletingId: string | null;
}) {
  return (
    <li
      className={cn(
        "border-b border-neutral-200 py-4 last:border-b-0 dark:border-neutral-800",
        depth > 0 && "ml-4 border-l border-neutral-200 pl-4 dark:border-neutral-700",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {comment.user.fullName}
            {depth > 0 ? (
              <span className="ml-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Reply
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            {comment.content}
          </p>
        </div>
        <Button
          disabled={deletingId === comment.id}
          onClick={() => onDelete(comment)}
          size="sm"
          type="button"
          variant="danger"
        >
          Delete
        </Button>
      </div>

      {comment.replies.length > 0 ? (
        <ul className="mt-2">
          {comment.replies.map((reply) => (
            <ModerationComment
              comment={reply}
              deletingId={deletingId}
              depth={depth + 1}
              key={reply.id}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function CmsColumnCommentsPanel({
  columnId,
  columnStatus,
}: CmsColumnCommentsPanelProps) {
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useColumnComments(columnId, 1, {
    enabled: columnStatus === "published",
  });
  const { remove } = useColumnCommentMutations(columnId);
  const [deleteTarget, setDeleteTarget] = useState<ColumnComment | null>(null);

  const tree = useMemo(
    () => (data?.items.length ? buildCommentTree(data.items) : []),
    [data?.items],
  );

  const isPublished = columnStatus === "published";

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await remove.mutateAsync(deleteTarget.id);
      toast.success("Comment deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Could not delete comment",
      );
    }
  }

  return (
    <>
      <Card className="mt-4">
        <CardBody className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Comments
              </h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Moderate threaded discussion on this column.
              </p>
            </div>
            {data ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {data.total} total
              </p>
            ) : null}
          </div>

          {!isPublished ? (
            <EmptyState
              title="Not published yet"
              description="Comments become available after the column is published."
            />
          ) : null}

          {isPublished && isLoading ? (
            <LoadingState label="Loading comments…" />
          ) : null}

          {isPublished && isError ? (
            <ErrorState
              description="Could not load comments for this column."
              action={
                <Button
                  onClick={() => void refetch()}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Retry
                </Button>
              }
            />
          ) : null}

          {isPublished && !isLoading && !isError && tree.length === 0 ? (
            <EmptyState
              title="No comments"
              description="Readers have not commented on this column yet."
            />
          ) : null}

          {isPublished && !isLoading && !isError && tree.length > 0 ? (
            <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              {tree.map((comment) => (
                <ModerationComment
                  comment={comment}
                  deletingId={remove.isPending ? deleteTarget?.id ?? null : null}
                  depth={0}
                  key={comment.id}
                  onDelete={setDeleteTarget}
                />
              ))}
            </ul>
          ) : null}
        </CardBody>
      </Card>

      <ConfirmDialog
        danger
        confirmLabel="Delete"
        loading={remove.isPending}
        message="Delete this comment and any nested replies? This cannot be undone from the public site."
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title="Delete comment?"
      />
    </>
  );
}

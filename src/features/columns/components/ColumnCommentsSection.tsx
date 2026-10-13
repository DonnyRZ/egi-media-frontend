"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormatter, useTranslations } from "next-intl";
import { z } from "zod";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useColumnCommentMutations } from "@/features/columns/hooks/useColumnCommentMutations";
import { useColumnComments } from "@/features/columns/hooks/useColumnComments";
import { buildCommentTree } from "@/features/columns/mappers/column-comment.mapper";
import type {
  ColumnComment,
  ColumnCommentNode,
} from "@/features/columns/types/column-comment.types";
import { canDeleteColumnComment } from "@/features/columns/utils/column-comment-permissions";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { TextArea } from "@/shared/components/ui/TextArea";
import { DATE_FORMAT } from "@/shared/constants/format.constants";
import { ApiError } from "@/shared/lib/errors";
import { cn } from "@/shared/lib/cn";

interface ColumnCommentsSectionProps {
  columnId: string;
  columnAuthorId: string;
}

interface CommentFormValues {
  content: string;
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="space-y-2 border-b border-neutral-100 pb-4" key={index}>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function useCommentSchema() {
  const t = useTranslations("columnsPage.comments");
  return useMemo(
    () =>
      z.object({
        content: z
          .string()
          .trim()
          .min(1, t("validationRequired"))
          .max(2000, t("validationMax")),
      }),
    [t],
  );
}

function InlineReplyForm({
  parentName,
  isPending,
  errorMessage,
  onCancel,
  onSubmit,
}: {
  parentName: string;
  isPending: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onSubmit: (content: string) => Promise<void>;
}) {
  const t = useTranslations("columnsPage.comments");
  const schema = useCommentSchema();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  const { ref: contentRef, ...contentField } = register("content");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <form
      className="mt-4 space-y-3 border border-neutral-200 bg-white p-4"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values.content.trim());
      })}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-600">
        <p>{t("replyingTo", { name: parentName })}</p>
        <button
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-ink"
          onClick={onCancel}
          type="button"
        >
          {t("cancelReply")}
        </button>
      </div>
      <TextArea
        error={errors.content?.message}
        label={t("replyFormLabel")}
        placeholder={t("replyFormPlaceholder")}
        rows={3}
        {...contentField}
        ref={(element) => {
          contentRef(element);
          textareaRef.current = element;
        }}
      />
      {errorMessage ? (
        <p className="text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button className="rounded-none" disabled={isPending} type="submit">
          {isPending ? t("submitting") : t("submitReply")}
        </Button>
        <button
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-ink"
          onClick={onCancel}
          type="button"
        >
          {t("cancelReply")}
        </button>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  depth,
  activeReplyId,
  onReply,
  onCancelReply,
  onSubmitReply,
  onDelete,
  canDelete,
  canReply,
  replyPending,
  replyError,
}: {
  comment: ColumnCommentNode;
  depth: number;
  activeReplyId: string | null;
  onReply: (comment: ColumnComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (comment: ColumnComment) => void;
  canDelete: (comment: ColumnComment) => boolean;
  canReply: boolean;
  replyPending: boolean;
  replyError: string | null;
}) {
  const t = useTranslations("columnsPage.comments");
  const format = useFormatter();
  const isReplying = activeReplyId === comment.id;

  return (
    <li
      className={cn(
        depth > 0 && "border-l-2 border-neutral-200",
      )}
      style={depth > 0 ? { marginLeft: Math.min(depth, 4) * 16 } : undefined}
    >
      <div className={cn("px-4 py-5 md:p-5", depth > 0 ? "bg-neutral-50/60" : "editorial-inset-free max-md:px-0")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              {comment.user.fullName}
            </p>
            <time
              className="mt-0.5 block text-xs uppercase tracking-wide text-neutral-500"
              dateTime={comment.createdAt}
            >
              {format.dateTime(new Date(comment.createdAt), DATE_FORMAT)}
            </time>
          </div>
          {canDelete(comment) ? (
            <button
              className="text-sm font-medium text-neutral-500 transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => onDelete(comment)}
              type="button"
            >
              {t("delete")}
            </button>
          ) : null}
        </div>
        <p className="editorial-summary mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
          {comment.content}
        </p>
        {canReply && !isReplying ? (
          <div className="mt-3">
            <button
              className="text-sm font-semibold text-primary-700 transition-colors hover:text-accent"
              onClick={() => onReply(comment)}
              type="button"
            >
              {t("reply")}
            </button>
          </div>
        ) : null}

        {isReplying ? (
          <InlineReplyForm
            errorMessage={replyError}
            isPending={replyPending}
            onCancel={onCancelReply}
            onSubmit={(content) => onSubmitReply(comment.id, content)}
            parentName={comment.user.fullName}
          />
        ) : null}
      </div>

      {comment.replies.length > 0 ? (
        <ul className="divide-y divide-neutral-100">
          {comment.replies.map((reply) => (
            <CommentItem
              activeReplyId={activeReplyId}
              canDelete={canDelete}
              canReply={canReply}
              comment={reply}
              depth={depth + 1}
              key={reply.id}
              onCancelReply={onCancelReply}
              onDelete={onDelete}
              onReply={onReply}
              onSubmitReply={onSubmitReply}
              replyError={replyError}
              replyPending={replyPending}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function ColumnCommentsSection({
  columnId,
  columnAuthorId,
}: ColumnCommentsSectionProps) {
  const t = useTranslations("columnsPage.comments");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch } =
    useColumnComments(columnId);
  const { create, remove } = useColumnCommentMutations(columnId);
  const [deleteTarget, setDeleteTarget] = useState<ColumnComment | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const tree = useMemo(
    () => (data?.items.length ? buildCommentTree(data.items) : []),
    [data?.items],
  );

  function canDeleteComment(comment: ColumnComment): boolean {
    return canDeleteColumnComment({
      viewerId: user?.id,
      viewerRole: user?.role,
      columnAuthorId,
      commentAuthorId: comment.user.id,
    });
  }

  const schema = useCommentSchema();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  const createErrorMessage =
    create.error instanceof ApiError
      ? create.error.message
      : create.error
        ? t("errors.createFailed")
        : null;

  async function onSubmitStandalone(values: CommentFormValues) {
    await create.mutateAsync({
      content: values.content.trim(),
      parentId: null,
    });
    reset({ content: "" });
  }

  async function onSubmitReply(parentId: string, content: string) {
    await create.mutateAsync({ content, parentId });
    setActiveReplyId(null);
  }

  function cancelReply() {
    setActiveReplyId(null);
  }

  return (
    <div className="editorial-gutter bg-white px-4 py-5 md:p-5 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2
            className="editorial-section-title font-sans text-2xl font-bold text-ink"
            id="column-comments-heading"
          >
            {t("heading")}
          </h2>
          {data ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t("count", { count: data.total })}
            </p>
          ) : null}
        </div>

        {isHydrated && isAuthenticated && !activeReplyId ? (
          <form
            className="mb-8 space-y-3 border border-neutral-200 bg-white p-5"
            noValidate
            onSubmit={handleSubmit((values) => void onSubmitStandalone(values))}
          >
            <TextArea
              error={errors.content?.message}
              label={t("formLabel")}
              placeholder={t("formPlaceholder")}
              rows={4}
              {...register("content")}
            />
            {createErrorMessage ? (
              <p className="text-sm text-error" role="alert">
                {createErrorMessage}
              </p>
            ) : null}
            <Button
              className="rounded-none"
              disabled={create.isPending}
              type="submit"
            >
              {create.isPending ? t("submitting") : t("submit")}
            </Button>
          </form>
        ) : null}

        {isHydrated && isAuthenticated && activeReplyId ? (
          <p className="mb-6 text-sm text-neutral-500">{t("replyingHint")}</p>
        ) : null}

        {isHydrated && !isAuthenticated ? (
          <div className="mb-8 border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            <p>{t("signInPrompt")}</p>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-accent"
              href="/login"
            >
              {t("signInCta")} →
            </Link>
          </div>
        ) : null}

        {isLoading ? <CommentsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !tree.length ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && tree.length ? (
          <ul className="divide-y divide-neutral-100 bg-white">
            {tree.map((comment) => (
              <CommentItem
                activeReplyId={activeReplyId}
                canDelete={canDeleteComment}
                canReply={Boolean(isHydrated && isAuthenticated)}
                comment={comment}
                depth={0}
                key={comment.id}
                onCancelReply={cancelReply}
                onDelete={setDeleteTarget}
                onReply={(target) => setActiveReplyId(target.id)}
                onSubmitReply={onSubmitReply}
                replyError={activeReplyId ? createErrorMessage : null}
                replyPending={create.isPending}
              />
            ))}
          </ul>
        ) : null}

        {remove.error ? (
          <p className="mt-3 text-sm text-error" role="alert">
            {remove.error instanceof ApiError
              ? remove.error.message
              : t("errors.deleteFailed")}
          </p>
        ) : null}

        <ConfirmDialog
          cancelLabel={t("cancel")}
          confirmLabel={t("delete")}
          isPending={remove.isPending}
          message={t("deleteMessage")}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (!deleteTarget || !canDeleteComment(deleteTarget)) {
              setDeleteTarget(null);
              return;
            }
            void remove
              .mutateAsync(deleteTarget.id)
              .then(() => {
                setDeleteTarget(null);
              })
              .catch(() => undefined);
          }}
          open={Boolean(deleteTarget)}
          title={t("deleteTitle")}
          tone="danger"
        />
      </div>
    </div>
  );
}

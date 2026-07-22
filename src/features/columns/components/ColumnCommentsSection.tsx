"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormatter, useTranslations } from "next-intl";
import { z } from "zod";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useColumnCommentMutations } from "@/features/columns/hooks/useColumnCommentMutations";
import { useColumnComments } from "@/features/columns/hooks/useColumnComments";
import type { ColumnComment } from "@/features/columns/types/column-comment.types";
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

export function ColumnCommentsSection({
  columnId,
  columnAuthorId,
}: ColumnCommentsSectionProps) {
  const t = useTranslations("columnsPage");
  const format = useFormatter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch } =
    useColumnComments(columnId);
  const { create, remove } = useColumnCommentMutations(columnId);
  const [deleteTarget, setDeleteTarget] = useState<ColumnComment | null>(null);

  function canDeleteComment(comment: ColumnComment): boolean {
    return canDeleteColumnComment({
      viewerId: user?.id,
      viewerRole: user?.role,
      columnAuthorId,
      commentAuthorId: comment.user.id,
    });
  }

  const schema = useMemo(
    () =>
      z.object({
        content: z
          .string()
          .trim()
          .min(1, t("comments.validationRequired"))
          .max(2000, t("comments.validationMax")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: CommentFormValues) {
    await create.mutateAsync(values.content.trim());
    reset({ content: "" });
  }

  return (
    <section aria-labelledby="column-comments-heading" className="mt-12 border-t border-neutral-200 pt-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2
          className="font-serif text-2xl font-bold text-ink"
          id="column-comments-heading"
        >
          {t("comments.heading")}
        </h2>
        {data ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {t("comments.count", { count: data.total })}
          </p>
        ) : null}
      </div>

      {isHydrated && isAuthenticated ? (
        <form
          className="mb-8 space-y-3 border border-neutral-200 bg-white p-5"
          noValidate
          onSubmit={handleSubmit((values) => void onSubmit(values))}
        >
          <TextArea
            error={errors.content?.message}
            label={t("comments.formLabel")}
            placeholder={t("comments.formPlaceholder")}
            rows={4}
            {...register("content")}
          />
          {create.error ? (
            <p className="text-sm text-error" role="alert">
              {create.error instanceof ApiError
                ? create.error.message
                : t("comments.errors.createFailed")}
            </p>
          ) : null}
          <Button
            className="rounded-none"
            disabled={create.isPending}
            type="submit"
          >
            {create.isPending ? t("comments.submitting") : t("comments.submit")}
          </Button>
        </form>
      ) : isHydrated ? (
        <div className="mb-8 border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          <p>{t("comments.signInPrompt")}</p>
          <Link
            className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-accent"
            href="/login"
          >
            {t("comments.signInCta")} →
          </Link>
        </div>
      ) : null}

      {isLoading ? <CommentsSkeleton /> : null}

      {isError ? (
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      ) : null}

      {!isLoading && !isError && !data?.items.length ? (
        <EmptyState message={t("comments.empty")} />
      ) : null}

      {!isLoading && !isError && data?.items.length ? (
        <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
          {data.items.map((comment) => (
            <li className="p-5" key={comment.id}>
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
                {isHydrated && canDeleteComment(comment) ? (
                  <button
                    className="text-xs font-semibold uppercase tracking-wide text-neutral-500 transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    disabled={remove.isPending}
                    onClick={() => setDeleteTarget(comment)}
                    type="button"
                  >
                    {t("comments.delete")}
                  </button>
                ) : null}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {remove.error ? (
        <p className="mt-3 text-sm text-error" role="alert">
          {remove.error instanceof ApiError
            ? remove.error.message
            : t("comments.errors.deleteFailed")}
        </p>
      ) : null}

      <ConfirmDialog
        cancelLabel={t("comments.cancel")}
        confirmLabel={t("comments.delete")}
        isPending={remove.isPending}
        message={t("comments.deleteMessage")}
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
        title={t("comments.deleteTitle")}
        tone="danger"
      />
    </section>
  );
}

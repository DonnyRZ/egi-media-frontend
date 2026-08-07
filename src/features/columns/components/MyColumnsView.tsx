"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";

import { ColumnStatusBadge } from "@/features/columns/components/ColumnStatusBadge";
import { ColumnsSignInPrompt } from "@/features/columns/components/ColumnsSignInPrompt";
import {
  COLUMN_EDITABLE_STATUSES,
  COLUMN_SUBMITTABLE_STATUSES,
} from "@/features/columns/constants/column.constants";
import { useColumnMutations } from "@/features/columns/hooks/useColumnMutations";
import { useMyColumns } from "@/features/columns/hooks/useMyColumns";
import type { ColumnListItem } from "@/features/columns/types/column.types";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Button } from "@/shared/components/ui/Button";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { DATE_FORMAT } from "@/shared/constants/format.constants";

function canEdit(column: ColumnListItem): boolean {
  return (COLUMN_EDITABLE_STATUSES as readonly string[]).includes(column.status);
}

function canSubmit(column: ColumnListItem): boolean {
  return (COLUMN_SUBMITTABLE_STATUSES as readonly string[]).includes(
    column.status,
  );
}

export function MyColumnsView() {
  const t = useTranslations("columnsPage");
  const format = useFormatter();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, isError, error, refetch } = useMyColumns(page);
  const { remove, submit } = useColumnMutations();
  const [deleteTarget, setDeleteTarget] = useState<ColumnListItem | null>(null);

  if (!isHydrated) {
    return (
      <Section>
        <Container>
          <Skeleton className="h-40 w-full" />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <ColumnsSignInPrompt />
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-2">
          <div>
            <Link
              className="text-sm font-semibold text-primary-700 hover:text-accent"
              href="/kolom"
            >
              ← {t("backToColumns")}
            </Link>
            <h2 className="mt-2 text-lg font-bold uppercase tracking-wide text-ink">
              {t("myColumnsHeading")}
            </h2>
          </div>
          <Link href="/kolom/tulis">
            <Button className="rounded-none" type="button">
              {t("writeCta")}
            </Button>
          </Link>
        </div>

        {isLoading ? <Skeleton className="h-48 w-full" /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !data?.items.length ? (
          <EmptyState message={t("myColumnsEmpty")} />
        ) : null}

        {!isLoading && !isError && data?.items.length ? (
          <div className="space-y-8">
            <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
              {data.items.map((column) => (
                <li
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                  key={column.id}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <ColumnStatusBadge status={column.status} />
                      <time
                        className="text-xs uppercase tracking-wide text-neutral-500"
                        dateTime={column.createdAt}
                      >
                        {format.dateTime(
                          new Date(column.createdAt),
                          DATE_FORMAT,
                        )}
                      </time>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-ink">
                      {column.status === "published" ? (
                        <Link
                          className="hover:text-accent"
                          href={`/kolom/${column.slug}`}
                        >
                          {column.title}
                        </Link>
                      ) : (
                        column.title
                      )}
                    </h3>
                    {column.summary ? (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                        {column.summary}
                      </p>
                    ) : null}
                    {column.status === "rejected" && column.rejectionReason ? (
                      <p className="mt-2 text-sm text-red-700">
                        {t("rejectionReason", {
                          reason: column.rejectionReason,
                        })}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canEdit(column) ? (
                      <Link href={`/kolom/saya/${column.id}/edit`}>
                        <Button
                          className="rounded-none"
                          type="button"
                          variant="secondary"
                        >
                          {t("actions.edit")}
                        </Button>
                      </Link>
                    ) : null}
                    {canSubmit(column) ? (
                      <Button
                        className="rounded-none"
                        disabled={submit.isPending}
                        onClick={() => void submit.mutateAsync(column.id)}
                        type="button"
                      >
                        {t("actions.submit")}
                      </Button>
                    ) : null}
                    <Button
                      className="rounded-none"
                      onClick={() => setDeleteTarget(column)}
                      type="button"
                      variant="ghost"
                    >
                      {t("actions.delete")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              basePath="/kolom/saya"
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </div>
        ) : null}

        <ConfirmDialog
          cancelLabel={t("actions.cancel")}
          confirmLabel={t("actions.delete")}
          isPending={remove.isPending}
          message={t("deleteMessage")}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (!deleteTarget) return;
            void remove.mutateAsync(deleteTarget.id).then(() => {
              setDeleteTarget(null);
            });
          }}
          open={Boolean(deleteTarget)}
          title={t("deleteTitle")}
          tone="danger"
        />
      </Container>
    </Section>
  );
}

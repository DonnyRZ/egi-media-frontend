"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Card } from "@/features/cms/components/ui/Card";
import { EmptyState, ErrorState, LoadingState } from "@/features/cms/components/ui/StateViews";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { ArticleFilters, type ArticleSortKey } from "@/features/cms/components/articles/ArticleFilters";
import { ArticleStatusTabs } from "@/features/cms/components/articles/ArticleStatusTabs";
import { ArticleTable } from "@/features/cms/components/articles/ArticleTable";
import { BulkActionsBar } from "@/features/cms/components/articles/BulkActionsBar";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { ScheduleModal } from "@/features/cms/components/articles/ScheduleModal";
import { Icons } from "@/features/cms/components/ui/Icons";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import { useCmsArticles } from "@/features/cms/hooks/useCmsArticles";
import { useArticleMutations } from "@/features/cms/hooks/useArticleMutations";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { filterAndSortArticles } from "@/features/cms/utils/article-list.utils";
import type {
  ArticleStatus,
  CmsArticleListItem,
} from "@/features/cms/types/cms.types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function ArticleListView() {
  const toast = useToast();
  const { canPublish, isSuperadmin } = usePermissions();
  const currentUserId = useAuthStore((state) => state.user?.id ?? null);
  const { changeStatus, remove } = useArticleMutations();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ArticleStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<ArticleSortKey>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<CmsArticleListItem | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [scheduleIds, setScheduleIds] = useState<string[] | null>(null);

  const search = useDebouncedValue(searchInput, 300);
  const { data, isLoading, isError } = useCmsArticles({
    page,
    limit: CMS_DEFAULT_PAGE_SIZE,
    status,
  });

  const visible = useMemo(
    () => filterAndSortArticles(data?.items ?? [], search, sort),
    [data?.items, search, sort],
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const editableIds = useMemo(
    () =>
      visible
        .filter((a) => isSuperadmin || a.author.id === currentUserId)
        .map((a) => a.id),
    [visible, isSuperadmin, currentUserId],
  );

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === editableIds.length ? new Set() : new Set(editableIds),
    );

  async function applyStatus(
    ids: string[],
    next: ArticleStatus,
    publishedAt?: string,
  ) {
    const results = await Promise.allSettled(
      ids.map((id) => changeStatus.mutateAsync({ id, status: next, publishedAt })),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const rejected = results.find((r) => r.status === "rejected") as
      | PromiseRejectedResult
      | undefined;
    const failed = results.length - ok;
    if (ok) toast.success(`${ok} article(s) updated`);
    if (failed) {
      toast.error(
        errorMessage(rejected?.reason, `${failed} article(s) could not be updated`),
      );
    }
    setSelected(new Set());
  }

  function handleRowStatus(article: CmsArticleListItem, next: ArticleStatus) {
    if (next === "scheduled") {
      setScheduleIds([article.id]);
      return;
    }
    void applyStatus([article.id], next);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Article deleted");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete article"));
    } finally {
      setPendingDelete(null);
    }
  }

  async function confirmBulkDelete() {
    await Promise.allSettled([...selected].map((id) => remove.mutateAsync(id)));
    toast.success("Selected articles deleted");
    setSelected(new Set());
    setBulkDeleteOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Articles"
        description="Create, review, and publish editorial content."
        actions={
          <Link
            href="/cms/articles/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            <Icons.plus className="h-4 w-4" /> New article
          </Link>
        }
      />

      <Card>
        <ArticleStatusTabs
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
            setSelected(new Set());
          }}
        />

        <ArticleFilters
          search={searchInput}
          sort={sort}
          onSearch={setSearchInput}
          onSort={setSort}
        />

        <BulkActionsBar
          count={selected.size}
          canPublish={canPublish}
          onPublish={() => applyStatus([...selected], "published")}
          onArchive={() => applyStatus([...selected], "archived")}
          onDelete={() => setBulkDeleteOpen(true)}
          onClear={() => setSelected(new Set())}
        />

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="Try adjusting filters, or create your first article."
          />
        ) : (
          <>
            <ArticleTable
              articles={visible}
              selectedIds={selected}
              currentUserId={currentUserId}
              isSuperadmin={isSuperadmin}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onChangeStatus={handleRowStatus}
              onDelete={setPendingDelete}
            />
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 1}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete article"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title="Delete selected articles"
        message={`Delete ${selected.size} selected article(s)? This cannot be undone.`}
        confirmLabel="Delete all"
        danger
        loading={remove.isPending}
        onConfirm={confirmBulkDelete}
        onClose={() => setBulkDeleteOpen(false)}
      />

      <ScheduleModal
        open={Boolean(scheduleIds)}
        loading={changeStatus.isPending}
        onClose={() => setScheduleIds(null)}
        onConfirm={(iso) => {
          if (scheduleIds) void applyStatus(scheduleIds, "scheduled", iso);
          setScheduleIds(null);
        }}
      />
    </>
  );
}

"use client";

import { useState } from "react";

import { Card } from "@/features/cms/components/ui/Card";
import { EmptyState, ErrorState, LoadingState } from "@/features/cms/components/ui/StateViews";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { ColumnStatusTabs } from "@/features/cms/components/columns/ColumnStatusTabs";
import { ColumnTable } from "@/features/cms/components/columns/ColumnTable";
import { ColumnRejectDialog } from "@/features/cms/components/columns/ColumnRejectDialog";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { Input } from "@/features/cms/components/ui/Input";
import { Icons } from "@/features/cms/components/ui/Icons";
import { CMS_COLUMN_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/column.constants";
import { useCmsColumns } from "@/features/cms/hooks/useCmsColumns";
import { useCmsColumnMutations } from "@/features/cms/hooks/useCmsColumnMutations";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import type { ColumnListItem } from "@/features/columns/types/column.types";
import type { ColumnStatusFilter } from "@/features/cms/components/columns/ColumnStatusTabs";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function ColumnListView() {
  const toast = useToast();
  const { approve, reject } = useCmsColumnMutations();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ColumnStatusFilter>("pending_approval");
  const [searchInput, setSearchInput] = useState("");
  const [pendingApprove, setPendingApprove] = useState<ColumnListItem | null>(
    null,
  );
  const [pendingReject, setPendingReject] = useState<ColumnListItem | null>(
    null,
  );

  const search = useDebouncedValue(searchInput, 300);
  const { data, isLoading, isError } = useCmsColumns({
    page,
    limit: CMS_COLUMN_DEFAULT_PAGE_SIZE,
    status,
    search,
  });

  async function confirmApprove() {
    if (!pendingApprove) return;
    try {
      await approve.mutateAsync(pendingApprove.id);
      toast.success(
        "Column approved. Translation started — track progress in the bell. It appears on /kolom when EN+UZ are ready.",
      );
    } catch (error) {
      toast.error(errorMessage(error, "Could not approve column"));
    } finally {
      setPendingApprove(null);
    }
  }

  async function confirmReject(reason: string) {
    if (!pendingReject) return;
    try {
      await reject.mutateAsync({
        id: pendingReject.id,
        rejectionReason: reason,
      });
      toast.success("Column rejected");
    } catch (error) {
      toast.error(errorMessage(error, "Could not reject column"));
    } finally {
      setPendingReject(null);
    }
  }

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Contributor Columns"
        description="Review and moderate member-submitted opinion columns."
      />

      <Card>
        <ColumnStatusTabs
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />

        <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Icons.search className="h-4 w-4 shrink-0 text-neutral-400" />
          <Input
            aria-label="Search columns"
            className="border-0 bg-transparent px-0 shadow-none focus:ring-0"
            placeholder="Search by title or contributor…"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? <LoadingState label="Loading columns…" /> : null}
        {isError ? (
          <ErrorState description="Could not load contributor columns." />
        ) : null}
        {!isLoading && !isError && (data?.items.length ?? 0) === 0 ? (
          <EmptyState
            title="No columns found"
            description="There are no submissions matching this filter."
          />
        ) : null}
        {!isLoading && !isError && (data?.items.length ?? 0) > 0 ? (
          <>
            <ColumnTable
              columns={data?.items ?? []}
              onApprove={setPendingApprove}
              onReject={setPendingReject}
            />
            <Pagination
              page={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingApprove)}
        title="Approve & publish"
        message={`Approve “${pendingApprove?.title ?? ""}”? English and Oʻzbekcha will be translated in the background. It appears on the public site when ready.`}
        confirmLabel="Approve & Publish"
        loading={approve.isPending}
        onConfirm={() => void confirmApprove()}
        onClose={() => setPendingApprove(null)}
      />

      <ColumnRejectDialog
        key={pendingReject?.id ?? "closed"}
        open={Boolean(pendingReject)}
        title={pendingReject?.title ?? ""}
        loading={reject.isPending}
        onConfirm={(reason) => void confirmReject(reason)}
        onClose={() => setPendingReject(null)}
      />
    </RouteGuard>
  );
}

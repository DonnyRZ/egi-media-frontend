"use client";

import { useMemo, useState } from "react";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Card } from "@/features/cms/components/ui/Card";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Input } from "@/features/cms/components/ui/Input";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import { Select } from "@/features/cms/components/ui/Select";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import { useCmsAuditLogs } from "@/features/cms/hooks/useCmsAuditLogs";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import {
  AUDIT_ACTION_FILTER_OPTIONS,
  getAuditActionLabel,
  getAuditActionTone,
} from "@/features/cms/utils/audit-action";
import { AUDIT_RESOURCE_TYPE_FILTER_OPTIONS } from "@/features/cms/utils/audit-resource";
import { formatAbsoluteDateTime } from "@/shared/utils/format";

const ROLE_TONE: Record<string, "info" | "success" | "neutral" | "muted"> = {
  superadmin: "success",
  author: "info",
  member: "neutral",
  visitor: "muted",
};

export function AuditLogsView() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search);
  const params = useMemo(
    () => ({
      page,
      limit: CMS_DEFAULT_PAGE_SIZE,
      search: debouncedSearch,
      action,
      resourceType,
    }),
    [page, debouncedSearch, action, resourceType],
  );

  const { data, isLoading, isError } = useCmsAuditLogs(params);
  const logs = data?.items ?? [];

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Audit Logs"
        description="Full newsroom activity history for editorial accountability."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[12rem] flex-1">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="pl-9"
            placeholder="Search by user name…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="sm:w-52"
          placeholder="All actions"
          options={[...AUDIT_ACTION_FILTER_OPTIONS]}
          value={action}
          onChange={(event) => {
            setAction(event.target.value);
            setPage(1);
          }}
        />
        <Select
          className="sm:w-52"
          placeholder="All resource types"
          options={[...AUDIT_RESOURCE_TYPE_FILTER_OPTIONS]}
          value={resourceType}
          onChange={(event) => {
            setResourceType(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <Card>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : logs.length === 0 ? (
          <EmptyState title="No activity found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date &amp; time</th>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-neutral-500 dark:text-neutral-400">
                      {formatAbsoluteDateTime(log.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        {log.actorName ?? "Unknown"}
                      </div>
                      {log.actorRole ? (
                        <div className="mt-1">
                          <Badge tone={ROLE_TONE[log.actorRole] ?? "neutral"}>
                            {log.actorRole}
                          </Badge>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={getAuditActionTone(log.action)}>
                        {getAuditActionLabel(log.action)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-neutral-700 dark:text-neutral-300">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="muted">{log.resourceType}</Badge>
                        {log.recordLabel ? (
                          <span>&lsquo;{log.recordLabel}&rsquo;</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </RouteGuard>
  );
}

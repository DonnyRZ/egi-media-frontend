"use client";

import { Badge, TranslationStatusBadge } from "@/features/cms/components/ui/Badge";
import { ColumnRowActions } from "@/features/cms/components/columns/ColumnRowActions";
import { COLUMN_STATUS_META } from "@/features/cms/constants/column.constants";
import { formatPublishedDate } from "@/shared/utils/format";
import type { ColumnListItem } from "@/features/columns/types/column.types";

interface ColumnTableProps {
  columns: ColumnListItem[];
  onApprove: (column: ColumnListItem) => void;
  onReject: (column: ColumnListItem) => void;
}

const HEAD_CELL =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-400";

export function ColumnTable({ columns, onApprove, onReject }: ColumnTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className={HEAD_CELL}>Title</th>
            <th className={`${HEAD_CELL} hidden md:table-cell`}>
              Contributor
            </th>
            <th className={`${HEAD_CELL} hidden lg:table-cell`}>
              Submitted
            </th>
            <th className={HEAD_CELL}>Status</th>
            <th className={`${HEAD_CELL} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {columns.map((column) => {
            const statusMeta = COLUMN_STATUS_META[column.status];
            return (
              <tr
                key={column.id}
                className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
              >
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {column.title}
                  </p>
                  {column.summary ? (
                    <p className="truncate text-xs text-neutral-400">
                      {column.summary}
                    </p>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {column.author.fullName}
                  </p>
                  {column.author.email ? (
                    <p className="truncate text-xs text-neutral-400">
                      {column.author.email}
                    </p>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-500 lg:table-cell">
                  {formatPublishedDate(column.createdAt) || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                    <TranslationStatusBadge status={column.translationStatus} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ColumnRowActions
                    column={column}
                    onApprove={() => onApprove(column)}
                    onReject={() => onReject(column)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

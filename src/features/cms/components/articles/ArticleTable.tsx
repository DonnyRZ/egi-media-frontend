"use client";

import { formatPublishedDate } from "@/shared/utils/format";
import {
  PlacementBadges,
  StatusBadge,
  TranslationStatusBadge,
} from "@/features/cms/components/ui/Badge";
import { ArticleRowActions } from "@/features/cms/components/articles/ArticleRowActions";
import type {
  ArticleStatus,
  CmsArticleListItem,
} from "@/features/cms/types/cms.types";

interface ArticleTableProps {
  articles: CmsArticleListItem[];
  selectedIds: Set<string>;
  currentUserId: string | null;
  isSuperadmin: boolean;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onChangeStatus: (article: CmsArticleListItem, status: ArticleStatus) => void;
  onManagePlacement: (article: CmsArticleListItem) => void;
  onDelete: (article: CmsArticleListItem) => void;
}

const HEAD_CELL =
  "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-400";

export function ArticleTable({
  articles,
  selectedIds,
  currentUserId,
  isSuperadmin,
  onToggle,
  onToggleAll,
  onChangeStatus,
  onManagePlacement,
  onDelete,
}: ArticleTableProps) {
  const canEditArticle = (article: CmsArticleListItem) =>
    isSuperadmin || article.author.id === currentUserId;

  const editable = articles.filter(canEditArticle);
  const allSelected =
    editable.length > 0 && editable.every((a) => selectedIds.has(a.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b border-neutral-200 dark:border-neutral-800">
          <tr>
            <th className="w-10 px-4 py-3">
              <input
                aria-label="Select all"
                type="checkbox"
                className="h-4 w-4 accent-accent"
                checked={allSelected}
                onChange={onToggleAll}
              />
            </th>
            <th className={HEAD_CELL}>Title</th>
            <th className={`${HEAD_CELL} hidden lg:table-cell`}>Author</th>
            <th className={`${HEAD_CELL} hidden md:table-cell`}>Category</th>
            <th className={HEAD_CELL}>Status</th>
            <th className={`${HEAD_CELL} hidden md:table-cell`}>Views</th>
            <th className={`${HEAD_CELL} hidden xl:table-cell`}>Placements</th>
            <th className={`${HEAD_CELL} hidden lg:table-cell`}>Last edited</th>
            <th className={`${HEAD_CELL} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {articles.map((article) => {
            const canEdit = canEditArticle(article);
            return (
              <tr
                key={article.id}
                className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
              >
                <td className="px-4 py-3">
                  <input
                    aria-label={`Select ${article.title}`}
                    type="checkbox"
                    className="h-4 w-4 accent-accent disabled:opacity-40"
                    checked={selectedIds.has(article.id)}
                    disabled={!canEdit}
                    onChange={() => onToggle(article.id)}
                  />
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {article.title}
                  </p>
                  {article.summary ? (
                    <p className="truncate text-xs text-neutral-400">
                      {article.summary}
                    </p>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-500 lg:table-cell">
                  {article.author.fullName}
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-500 md:table-cell">
                  {article.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge status={article.status} />
                    <TranslationStatusBadge status={article.translationStatus} />
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-sm tabular-nums text-neutral-600 md:table-cell dark:text-neutral-300">
                  {article.viewCount.toLocaleString()}
                </td>
                <td className="hidden px-4 py-3 xl:table-cell">
                  <PlacementBadges
                    placements={article.placements}
                    headlinePosition={article.headlinePosition}
                  />
                </td>
                <td className="hidden px-4 py-3 text-sm text-neutral-500 lg:table-cell">
                  {formatPublishedDate(article.updatedAt) ||
                    formatPublishedDate(article.createdAt) ||
                    "—"}
                </td>
                <td className="px-4 py-3">
                  <ArticleRowActions
                    article={article}
                    canEdit={canEdit}
                    isSuperadmin={isSuperadmin}
                    onChangeStatus={(status) => onChangeStatus(article, status)}
                    onManagePlacement={() => onManagePlacement(article)}
                    onDelete={() => onDelete(article)}
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

"use client";

import { useState } from "react";
import Link from "next/link";

import { Badge, StatusBadge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Spinner } from "@/features/cms/components/ui/StateViews";
import { cn } from "@/shared/lib/cn";
import {
  useTaxonomyArticles,
  type TaxonomyKind,
} from "@/features/cms/hooks/useCmsTaxonomy";
import type { CmsTaxonomyItem } from "@/features/cms/services/cms-taxonomy.service";

interface TaxonomyItemRowProps {
  kind: TaxonomyKind;
  item: CmsTaxonomyItem;
  canManage: boolean;
  onEdit: (item: CmsTaxonomyItem) => void;
  onDelete: (item: CmsTaxonomyItem) => void;
}

export function TaxonomyItemRow({
  kind,
  item,
  canManage,
  onEdit,
  onDelete,
}: TaxonomyItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading } = useTaxonomyArticles(kind, item.id, expanded);
  const articles = data?.items ?? [];
  const hasArticles = item.articleCount > 0;

  return (
    <li className="px-5 py-3">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          disabled={!hasArticles}
          onClick={() => setExpanded((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left disabled:cursor-default"
        >
          {hasArticles ? (
            <Icons.chevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
                expanded ? "rotate-180" : "",
              )}
            />
          ) : (
            <span className="h-4 w-4 shrink-0" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {item.name}
            </span>
            {kind === "topic" && item.category ? (
              <span className="mt-0.5 block truncate text-xs text-neutral-400">
                Category: {item.category.name}
              </span>
            ) : null}
            {kind === "series" && item.topic ? (
              <span className="mt-0.5 block truncate text-xs text-neutral-400">
                Topic: {item.topic.name}
              </span>
            ) : null}
            {item.description ? (
              <span className="block truncate text-xs text-neutral-400">
                {item.description}
              </span>
            ) : item.slug ? (
              <span className="block truncate text-xs text-neutral-400">
                /{item.slug}
              </span>
            ) : null}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <Badge tone={hasArticles ? "info" : "muted"}>
            {item.articleCount} article{item.articleCount === 1 ? "" : "s"}
          </Badge>
          {canManage ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                <Icons.edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(item)}
                title={
                  hasArticles ? "Remove articles before deleting" : "Delete"
                }
              >
                <Icons.trash className="h-4 w-4 text-error" />
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div className="mt-2 space-y-1 pl-6">
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-neutral-400">
              <Spinner className="h-3.5 w-3.5" /> Loading articles…
            </div>
          ) : articles.length === 0 ? (
            <p className="py-2 text-xs text-neutral-400">No articles.</p>
          ) : (
            articles.map((article) => (
              <Link
                key={article.id}
                href={`/cms/articles/${article.id}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
              >
                <span className="truncate">{article.title}</span>
                <StatusBadge status={article.status} />
              </Link>
            ))
          )}
        </div>
      ) : null}
    </li>
  );
}

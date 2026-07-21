"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Icons } from "@/features/cms/components/ui/Icons";
import {
  ALLOWED_STATUS_TRANSITIONS,
  AUTHOR_ALLOWED_TRANSITIONS,
  STATUS_ACTION_META,
} from "@/features/cms/constants/cms.constants";
import type {
  ArticleStatus,
  CmsArticleListItem,
} from "@/features/cms/types/cms.types";

interface ArticleRowActionsProps {
  article: CmsArticleListItem;
  canEdit: boolean;
  isSuperadmin: boolean;
  onChangeStatus: (status: ArticleStatus) => void;
  onDelete: () => void;
}

export function ArticleRowActions({
  article,
  canEdit,
  isSuperadmin,
  onChangeStatus,
  onDelete,
}: ArticleRowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const transitions = ALLOWED_STATUS_TRANSITIONS[article.status].filter(
    (status) => isSuperadmin || AUTHOR_ALLOWED_TRANSITIONS.includes(status),
  );

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Author viewing someone else's article: read-only, no actions.
  if (!canEdit) {
    return (
      <div className="flex justify-end">
        <Link
          href={`/cms/articles/${article.id}`}
          aria-label={`View ${article.title}`}
          className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
        >
          <Icons.eye className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        aria-label="Row actions"
        className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-9 z-10 w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <Link
            href={`/cms/articles/${article.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            onClick={() => setOpen(false)}
          >
            <Icons.edit className="h-4 w-4" /> Edit
          </Link>

          {transitions.map((status) => {
            const meta = STATUS_ACTION_META[status];
            const ActionIcon = Icons[meta.icon];
            return (
              <button
                key={status}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                onClick={() => {
                  setOpen(false);
                  onChangeStatus(status);
                }}
                type="button"
              >
                <ActionIcon className="h-4 w-4" />
                {meta.label}
              </button>
            );
          })}

          <button
            className="flex w-full items-center gap-2 border-t border-neutral-100 px-3 py-2 text-left text-sm text-error hover:bg-red-50 dark:border-neutral-800 dark:hover:bg-red-950/40"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            type="button"
          >
            <Icons.trash className="h-4 w-4" /> Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

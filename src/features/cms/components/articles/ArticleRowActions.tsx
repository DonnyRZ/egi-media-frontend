"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
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
  onManagePlacement: () => void;
  onDelete: () => void;
}

interface MenuCoords {
  top: number;
  right: number;
}

const MENU_GAP_PX = 4;

const MENU_ITEM =
  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800";

function getTriggerCoords(trigger: HTMLElement): MenuCoords {
  const rect = trigger.getBoundingClientRect();
  return {
    top: rect.bottom + MENU_GAP_PX,
    right: window.innerWidth - rect.right,
  };
}

interface ActionsMenuProps {
  articleId: string;
  transitions: ArticleStatus[];
  coords: MenuCoords;
  menuRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onChangeStatus: (status: ArticleStatus) => void;
  onManagePlacement: () => void;
  onDelete: () => void;
}

function ActionsMenu({
  articleId,
  transitions,
  coords,
  menuRef,
  onClose,
  onChangeStatus,
  onManagePlacement,
  onDelete,
}: ActionsMenuProps) {
  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
      style={{ top: coords.top, right: coords.right }}
    >
      <Link
        href={`/cms/articles/${articleId}`}
        className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        onClick={onClose}
      >
        <Icons.edit className="h-4 w-4" /> Edit
      </Link>

      <button
        className={MENU_ITEM}
        onClick={() => {
          onClose();
          onManagePlacement();
        }}
        type="button"
      >
        <Icons.tag className="h-4 w-4" /> Manage Placement
      </button>

      {transitions.map((status) => {
        const meta = STATUS_ACTION_META[status];
        const ActionIcon = Icons[meta.icon];
        return (
          <button
            key={status}
            className={MENU_ITEM}
            onClick={() => {
              onClose();
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
          onClose();
          onDelete();
        }}
        type="button"
      >
        <Icons.trash className="h-4 w-4" /> Delete
      </button>
    </div>,
    document.body,
  );
}

export function ArticleRowActions({
  article,
  canEdit,
  isSuperadmin,
  onChangeStatus,
  onManagePlacement,
  onDelete,
}: ArticleRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const transitions = ALLOWED_STATUS_TRANSITIONS[article.status].filter(
    (status) => isSuperadmin || AUTHOR_ALLOWED_TRANSITIONS.includes(status),
  );

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function updatePosition() {
      if (!triggerRef.current) return;
      setCoords(getTriggerCoords(triggerRef.current));
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

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
    <div className="flex justify-end">
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="menu"
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

      {open && coords ? (
        <ActionsMenu
          articleId={article.id}
          transitions={transitions}
          coords={coords}
          menuRef={menuRef}
          onClose={() => setOpen(false)}
          onChangeStatus={onChangeStatus}
          onManagePlacement={onManagePlacement}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  );
}

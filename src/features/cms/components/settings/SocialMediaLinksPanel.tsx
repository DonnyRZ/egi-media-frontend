"use client";

import { useMemo, useState } from "react";

import { SocialMediaFormModal } from "@/features/cms/components/settings/SocialMediaFormModal";
import { Badge } from "@/features/cms/components/ui/Badge";
import { Button } from "@/features/cms/components/ui/Button";
import { Card } from "@/features/cms/components/ui/Card";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { Icons } from "@/features/cms/components/ui/Icons";
import { Input } from "@/features/cms/components/ui/Input";
import { Pagination } from "@/features/cms/components/ui/Pagination";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import {
  useCmsSocialMediaLinks,
  useSocialMediaLinkMutations,
} from "@/features/cms/hooks/useCmsSocialMedia";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import type { SocialMediaLinkFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsSocialMediaLink } from "@/features/cms/services/cms-social-media.service";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { SocialIcon } from "@/features/footer/components/SocialIcons";

export function SocialMediaLinksPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CmsSocialMediaLink | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsSocialMediaLink | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(search);
  const params = useMemo(
    () => ({
      page,
      limit: CMS_DEFAULT_PAGE_SIZE,
      search: debouncedSearch,
      active: "all" as const,
    }),
    [page, debouncedSearch],
  );
  const { data, isLoading, isError } = useCmsSocialMediaLinks(params);
  const { save, remove } = useSocialMediaLinkMutations();
  const links = data?.items ?? [];

  async function submit(values: SocialMediaLinkFormValues) {
    try {
      await save.mutateAsync({
        id: editing?.id,
        payload: {
          platformName: values.platformName,
          url: values.url,
          iconName: values.iconName,
          isActive: values.isActive,
          sortOrder: values.sortOrder,
        },
      });
      toast.success(editing ? "Social link updated" : "Social link added");
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save social link",
      );
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Social link deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete social link",
      );
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Icons.plus className="h-4 w-4" /> Add link
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-100 p-4 dark:border-neutral-800">
          <Input
            placeholder="Search platform or URL…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? <LoadingState label="Loading social links…" /> : null}
        {isError ? <ErrorState title="Could not load social links" /> : null}
        {!isLoading && !isError && links.length === 0 ? (
          <EmptyState title="No social links yet" />
        ) : null}

        {!isLoading && !isError && links.length > 0 ? (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {links.map((link) => (
              <li
                key={link.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    <SocialIcon className="h-4 w-4" platform={link.iconName} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {link.platformName}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{link.url}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Order {link.sortOrder}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={link.isActive ? "success" : "neutral"}>
                    {link.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(link);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPendingDelete(link)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {data && data.totalPages > 1 ? (
          <div className="border-t border-neutral-100 p-4 dark:border-neutral-800">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </Card>

      <SocialMediaFormModal
        open={formOpen}
        saving={save.isPending}
        link={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={(values) => void submit(values)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete social link?"
        message={
          pendingDelete
            ? `Remove ${pendingDelete.platformName} from the footer?`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}

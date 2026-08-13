"use client";

import { useMemo, useState } from "react";

import { TeamMemberFormModal } from "@/features/cms/components/settings/TeamMemberFormModal";
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
  useCmsTeamMembers,
  useTeamMemberMutations,
} from "@/features/cms/hooks/useCmsTeamMembers";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import type { TeamMemberFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsTeamMember } from "@/features/cms/services/cms-team-members.service";
import { useToast } from "@/features/cms/stores/cms-toast.store";

export function TeamMembersPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CmsTeamMember | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsTeamMember | null>(null);

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
  const { data, isLoading, isError } = useCmsTeamMembers(params);
  const { save, remove } = useTeamMemberMutations();
  const members = data?.items ?? [];

  async function submit(values: TeamMemberFormValues) {
    try {
      await save.mutateAsync({
        id: editing?.id,
        payload: {
          name: values.name,
          role: values.role,
          bio: values.bio || null,
          photoUrl: values.photoUrl,
          isActive: values.isActive,
          sortOrder: values.sortOrder,
        },
      });
      toast.success(editing ? "Team member updated" : "Team member added");
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save team member",
      );
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Team member deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete team member",
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
          <Icons.plus className="h-4 w-4" /> Add member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-neutral-100 p-4 dark:border-neutral-800">
          <Input
            placeholder="Search name or role…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading ? <LoadingState label="Loading team members…" /> : null}
        {isError ? <ErrorState title="Could not load team members" /> : null}
        {!isLoading && !isError && members.length === 0 ? (
          <EmptyState title="No team members yet" />
        ) : null}

        {!isLoading && !isError && members.length > 0 ? (
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photoUrl}
                    alt=""
                    className="h-12 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{member.role}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Order {member.sortOrder}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={member.isActive ? "success" : "neutral"}>
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(member);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPendingDelete(member)}
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
              total={data.total}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </Card>

      <TeamMemberFormModal
        open={formOpen}
        saving={save.isPending}
        member={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={(values) => void submit(values)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete team member?"
        message={
          pendingDelete
            ? `Remove ${pendingDelete.name} from the About page roster?`
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

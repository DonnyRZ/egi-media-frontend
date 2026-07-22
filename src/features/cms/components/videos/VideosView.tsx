"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/features/cms/components/layout/PageHeader";
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
import { VideoFormModal } from "@/features/cms/components/videos/VideoFormModal";
import { CMS_DEFAULT_PAGE_SIZE } from "@/features/cms/constants/cms.constants";
import { useCmsVideos, useVideoMutations } from "@/features/cms/hooks/useCmsVideos";
import { useDebouncedValue } from "@/features/cms/hooks/useDebouncedValue";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import type { VideoFormValues } from "@/features/cms/schemas/cms.schemas";
import type { CmsVideo } from "@/features/cms/services/cms-video.service";
import {
  formatAbsoluteDateTime,
  getYoutubeThumbnail,
} from "@/shared/utils/format";

export function VideosView() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CmsVideo | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CmsVideo | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const params = useMemo(
    () => ({ page, limit: CMS_DEFAULT_PAGE_SIZE, search: debouncedSearch }),
    [page, debouncedSearch],
  );
  const { data, isLoading, isError } = useCmsVideos(params);
  const { save, remove } = useVideoMutations();
  const videos = data?.items ?? [];

  async function submit(values: VideoFormValues) {
    try {
      await save.mutateAsync({
        id: editing?.id,
        payload: {
          title: values.title,
          description: values.description,
          url: values.url,
          isActive: values.isActive,
        },
      });
      toast.success(editing ? "Video updated" : "Video added");
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save video");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Video deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete video");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Videos"
        description="Manage featured YouTube videos shown on the EGI Media homepage."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Icons.plus className="h-4 w-4" /> Add video
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative max-w-md">
          <Icons.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            className="pl-9"
            placeholder="Search videos…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Card>
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : videos.length === 0 ? (
          <EmptyState title="No videos yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Video</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Added</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {videos.map((video) => {
                  const thumb = getYoutubeThumbnail(video.url);
                  return (
                    <tr key={video.id}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumb}
                              alt=""
                              className="h-12 w-20 shrink-0 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
                              <Icons.video className="h-5 w-5 text-neutral-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                              {video.title}
                            </p>
                            <p className="truncate text-xs text-neutral-400">
                              {video.url}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={video.isActive ? "success" : "muted"}>
                          {video.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {formatAbsoluteDateTime(video.createdAt) || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditing(video);
                              setFormOpen(true);
                            }}
                          >
                            <Icons.edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPendingDelete(video)}
                          >
                            <Icons.trash className="h-4 w-4 text-error" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      <VideoFormModal
        open={formOpen}
        saving={save.isPending}
        video={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={submit}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete video"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}

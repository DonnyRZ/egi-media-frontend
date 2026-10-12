"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchCmsVideos,
  fetchCmsVideoById,
} from "@/features/cms/services/cms-video.service";
import {
  mediaCatalogSchema,
  EMPTY_MEDIA_CATALOG,
  type MediaCatalogValues,
} from "@/features/cms/schemas/media-catalog.schema";
import type {
  MediaResource,
  MediaResourceWrite,
} from "@/shared/types/editorial.types";
type Kind = "programs" | "collections";
function initialValues(initial: MediaResource | null): MediaCatalogValues {
  return initial
    ? {
        ...EMPTY_MEDIA_CATALOG,
        ...initial,
        description: initial.description || "",
        poster_url: initial.poster_url || "",
        format: initial.format || "horizontal",
        video_ids: initial.video_ids || [],
        nameEn: initial.translations?.en?.name || "",
        descriptionEn: initial.translations?.en?.description || "",
        nameUz: initial.translations?.uz?.name || "",
        descriptionUz: initial.translations?.uz?.description || "",
      }
    : EMPTY_MEDIA_CATALOG;
}
function catalogPayload(kind: Kind, v: MediaCatalogValues): MediaResourceWrite {
  const translations: MediaResourceWrite["translations"] = {};
  if (v.nameEn.trim())
    translations.en = { name: v.nameEn.trim(), description: v.descriptionEn };
  if (v.nameUz.trim())
    translations.uz = { name: v.nameUz.trim(), description: v.descriptionUz };
  return {
    name: v.name,
    slug: v.slug,
    description: v.description,
    sort_order: v.sort_order,
    is_active: v.is_active,
    ...(kind === "programs"
      ? { poster_url: v.poster_url || null }
      : { format: v.format, video_ids: v.video_ids }),
    translations,
  };
}
function useSelectedVideos(ids: string[], enabled: boolean) {
  return useQuery({
    queryKey: ["cms-collection-selected", ids],
    enabled: enabled && ids.length > 0,
    queryFn: async () => {
      const result = await Promise.allSettled(
        ids.map((id) => fetchCmsVideoById(id)),
      );
      return {
        items: result.flatMap((x) =>
          x.status === "fulfilled" ? [x.value] : [],
        ),
        failed: result.some((x) => x.status === "rejected"),
      };
    },
  });
}
function useCollectionChoices(enabled: boolean, ids: string[]) {
  const [search, setSearch] = useState("");
  const videos = useQuery({
    queryKey: ["cms-collection-options", search],
    queryFn: () => fetchCmsVideos({ limit: 100, search }),
    enabled,
  });
  const selected = useSelectedVideos(ids, enabled);
  const videoChoices = Array.from(
    new Map(
      [...(videos.data?.items || []), ...(selected.data?.items || [])].map(
        (v) => [v.id, v],
      ),
    ).values(),
  );
  return {
    search,
    setSearch,
    videos,
    videoChoices,
    selectedFailure: selected.data?.failed || selected.isError,
    retrySelected: () => void selected.refetch(),
  };
}
function moveVideo(ids: string[], index: number, step: number) {
  const copy = [...ids],
    next = index + step;
  if (next < 0 || next >= copy.length) return copy;
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}
function useRestoreCatalog(
  initial: MediaResource | null,
  open: boolean,
  reset: (values: MediaCatalogValues) => void,
  setUploadBusy: (busy: boolean) => void,
) {
  useEffect(() => {
    if (open) {
      reset(initialValues(initial));
      setUploadBusy(false);
    }
  }, [initial, open, reset, setUploadBusy]);
}
export function useMediaCatalogForm(
  kind: Kind,
  initial: MediaResource | null,
  open: boolean,
  onSubmit: (payload: MediaResourceWrite) => void,
) {
  const form = useForm<MediaCatalogValues>({
    resolver: zodResolver(mediaCatalogSchema),
    defaultValues: EMPTY_MEDIA_CATALOG,
  });
  const values = form.watch();
  const [uploadBusy, setUploadBusy] = useState(false);
  const choices = useCollectionChoices(
    open && kind === "collections",
    values.video_ids,
  );
  useRestoreCatalog(initial, open, form.reset, setUploadBusy);
  const submit = (v: MediaCatalogValues) => onSubmit(catalogPayload(kind, v));
  const move = (index: number, step: number) =>
    form.setValue("video_ids", moveVideo(values.video_ids, index, step), {
      shouldDirty: true,
      shouldValidate: true,
    });
  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    setValue: form.setValue,
    errors: form.formState.errors,
    values,
    uploadBusy,
    setUploadBusy,
    submit,
    move,
    ...choices,
  };
}

"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/features/cms/hooks/usePermissions";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import {
  fetchCmsVideos,
  fetchCmsVideoById,
} from "@/features/cms/services/cms-video.service";
import {
  fetchMediaCatalog,
  fetchMediaResource,
  saveMediaResource,
  fetchVideoSettings,
  saveVideoSettings,
} from "@/shared/services/editorial.service";
import type {
  MediaResource,
  MediaResourceWrite,
} from "@/shared/types/editorial.types";
type Kind = "programs" | "collections";
function useCatalogState() {
  const [kind, setKind] = useState<Kind>("programs");
  const [form, setForm] = useState<{ initial: MediaResource | null } | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const [hero, setHero] = useState("");
  return { kind, setKind, form, setForm, saved, setSaved, hero, setHero };
}
function useCatalogQueries(kind: Kind, enabled: boolean) {
  const catalog = useQuery({
    queryKey: ["cms-media-catalog", kind],
    queryFn: () => fetchMediaCatalog(kind, "id", true),
    enabled,
  });
  const settings = useQuery({
    queryKey: ["cms-video-settings"],
    queryFn: fetchVideoSettings,
    enabled,
  });
  const videos = useQuery({
    queryKey: ["cms-hero-options"],
    queryFn: () => fetchCmsVideos({ limit: 100 }),
    enabled,
  });
  const selectedHero = useQuery({
    queryKey: ["cms-selected-hero", settings.data?.hero_video_id],
    queryFn: () => fetchCmsVideoById(settings.data!.hero_video_id!),
    enabled: enabled && Boolean(settings.data?.hero_video_id),
  });
  const heroChoices = Array.from(
    new Map(
      [
        ...(videos.data?.items || []),
        ...(selectedHero.data ? [selectedHero.data] : []),
      ].map((v) => [v.id, v]),
    ).values(),
  );
  return { catalog, settings, videos, heroChoices };
}
function useCatalogSave(
  state: ReturnType<typeof useCatalogState>,
  afterSave: () => Promise<void>,
) {
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: MediaResourceWrite) =>
      saveMediaResource(state.kind, state.form?.initial?.id || null, payload),
    onSuccess: afterSave,
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Could not save media"),
  });
}
function useCatalogActions(state: ReturnType<typeof useCatalogState>) {
  const toast = useToast();
  const client = useQueryClient();
  async function saved() {
    await client.invalidateQueries();
    state.setSaved(true);
    toast.success("Media catalog saved");
  }
  const save = useCatalogSave(state, async () => {
    await saved();
    state.setForm(null);
  });
  const hero = useMutation({
    mutationFn: () => saveVideoSettings(state.hero || null),
    onSuccess: saved,
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Could not save hero"),
  });
  async function edit(id: string) {
    try {
      state.setForm({
        initial: await fetchMediaResource(state.kind, id, "id", true),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load media");
    }
  }
  return {
    edit,
    save: (payload: MediaResourceWrite) => save.mutate(payload),
    saveHero: () => hero.mutate(),
    saving: save.isPending || hero.isPending,
  };
}
export function useMediaCatalog() {
  const { isSuperadmin } = usePermissions();
  const state = useCatalogState();
  const queries = useCatalogQueries(state.kind, isSuperadmin);
  const actions = useCatalogActions(state);
  const setHero = state.setHero;
  useEffect(() => {
    setHero(queries.settings.data?.hero_video_id || "");
  }, [queries.settings.data, setHero]);
  return { isSuperadmin, state, queries, actions };
}

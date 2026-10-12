"use client";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { useMediaCatalog } from "@/features/cms/hooks/useMediaCatalog";
import { MediaCatalogForm } from "@/features/cms/components/videos/MediaCatalogForm";
import {
  CatalogHeroPanel,
  CatalogTabs,
  CatalogResourceList,
  CatalogSaveFeedback,
} from "@/features/cms/components/videos/MediaCatalogPanels";
export function MediaCatalogView() {
  const model = useMediaCatalog();
  if (!model.isSuperadmin) return <p>Superadmin access required.</p>;
  const { state, actions } = model;
  return (
    <>
      <PageHeader
        title="Video Programs & Collections"
        description="Manage Original Series posters, ordered video collections and the horizontal Video hero. Empty programs/collections stay hidden on the public page."
      />
      <CatalogHeroPanel model={model} />
      <CatalogTabs model={model} />
      <CatalogResourceList model={model} />
      <CatalogSaveFeedback model={model} />
      <MediaCatalogForm
        kind={state.kind}
        initial={state.form?.initial || null}
        open={Boolean(state.form)}
        saving={actions.saving}
        onClose={() => state.setForm(null)}
        onSubmit={actions.save}
      />
    </>
  );
}

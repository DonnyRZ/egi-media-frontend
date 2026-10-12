"use client";
import { Modal } from "@/features/cms/components/ui/Modal";
import { Button } from "@/features/cms/components/ui/Button";
import { useMediaCatalogForm } from "@/features/cms/hooks/useMediaCatalogForm";
import {
  CatalogBasicFields,
  CatalogPosterFields,
  CatalogOrderFields,
  CatalogTranslationFields,
} from "@/features/cms/components/videos/CatalogFormFields";
import { CollectionVideoFields } from "@/features/cms/components/videos/CollectionVideoFields";
import type {
  MediaResource,
  MediaResourceWrite,
} from "@/shared/types/editorial.types";
interface MediaCatalogFormProps {
  kind: "programs" | "collections";
  initial: MediaResource | null;
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: MediaResourceWrite) => void;
}
export function MediaCatalogForm({
  kind,
  initial,
  open,
  saving,
  onClose,
  onSubmit,
}: MediaCatalogFormProps) {
  const form = useMediaCatalogForm(kind, initial, open, onSubmit);
  const footer = (
    <CatalogFormFooter saving={saving} form={form} onClose={onClose} />
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${initial ? "Edit" : "New"} ${kind === "programs" ? "program" : "collection"}`}
      footer={footer}
    >
      <div className="space-y-4">
        <CatalogBasicFields form={form} />
        {kind === "programs" ? (
          <CatalogPosterFields form={form} />
        ) : (
          <CollectionVideoFields form={form} />
        )}
        <CatalogOrderFields form={form} />
        <CatalogTranslationFields form={form} />
      </div>
    </Modal>
  );
}
function CatalogFormFooter({
  saving,
  form,
  onClose,
}: {
  saving: boolean;
  form: ReturnType<typeof useMediaCatalogForm>;
  onClose: () => void;
}) {
  return (
    <>
      <Button variant="secondary" disabled={saving} onClick={onClose}>
        Cancel
      </Button>
      <Button
        loading={saving}
        disabled={form.uploadBusy}
        onClick={form.handleSubmit(form.submit)}
      >
        Save
      </Button>
    </>
  );
}

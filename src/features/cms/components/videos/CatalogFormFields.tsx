"use client";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { ImageUpload } from "@/features/cms/components/media/ImageUpload";
import { MediaPreview } from "@/features/cms/components/media/MediaPreview";
import type { useMediaCatalogForm } from "@/features/cms/hooks/useMediaCatalogForm";
export interface CatalogFieldsProps {
  form: ReturnType<typeof useMediaCatalogForm>;
}
export function CatalogBasicFields({ form }: CatalogFieldsProps) {
  return (
    <>
      <Field label="Name" error={form.errors.name?.message}>
        <Input {...form.register("name")} />
      </Field>
      <Field label="Slug" error={form.errors.slug?.message}>
        <Input {...form.register("slug")} />
      </Field>
      <Field label="Description" error={form.errors.description?.message}>
        <Textarea {...form.register("description")} />
      </Field>
    </>
  );
}
export function CatalogPosterFields({ form }: CatalogFieldsProps) {
  return (
    <>
      <Field label="Poster URL · 2:3" error={form.errors.poster_url?.message}>
        <Input {...form.register("poster_url")} />
      </Field>
      <ImageUpload
        onBusyChange={form.setUploadBusy}
        onUploaded={(url) =>
          form.setValue("poster_url", url, { shouldDirty: true })
        }
      />
      <MediaPreview
        src={form.values.poster_url || null}
        title={form.values.name}
        ratio="2:3"
      />
    </>
  );
}
export function CatalogOrderFields({ form }: CatalogFieldsProps) {
  return (
    <>
      <Field label="Order" error={form.errors.sort_order?.message}>
        <Input
          type="number"
          {...form.register("sort_order", { valueAsNumber: true })}
        />
      </Field>
      <label className="flex gap-2">
        <input type="checkbox" {...form.register("is_active")} />
        Active
      </label>
    </>
  );
}
const TRANSLATIONS = [
  { key: "nameEn", label: "English name", multiline: false },
  { key: "descriptionEn", label: "English description", multiline: true },
  { key: "nameUz", label: "Uzbek name", multiline: false },
  { key: "descriptionUz", label: "Uzbek description", multiline: true },
] as const;
export function CatalogTranslationFields({ form }: CatalogFieldsProps) {
  return (
    <details>
      <summary className="cursor-pointer font-semibold">
        English / O‘zbekcha
      </summary>
      <div className="mt-4 space-y-4">
        {TRANSLATIONS.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            error={form.errors[field.key]?.message}
          >
            {field.multiline ? (
              <Textarea {...form.register(field.key)} />
            ) : (
              <Input {...form.register(field.key)} />
            )}
          </Field>
        ))}
      </div>
    </details>
  );
}

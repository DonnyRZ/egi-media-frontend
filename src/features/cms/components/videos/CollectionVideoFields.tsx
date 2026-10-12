"use client";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { Select } from "@/features/cms/components/ui/Select";
import { Button } from "@/features/cms/components/ui/Button";
import type { CatalogFieldsProps } from "@/features/cms/components/videos/CatalogFormFields";
function CollectionLoadNotices({ form }: CatalogFieldsProps) {
  return (
    <>
      {form.videos.isLoading ? <p>Loading videos…</p> : null}
      {form.videos.isError ? (
        <p role="alert">Could not load video choices.</p>
      ) : null}
      {form.selectedFailure ? (
        <p role="alert">
          Could not load selected videos.{" "}
          <button
            type="button"
            className="underline"
            onClick={form.retrySelected}
          >
            Retry
          </button>
        </p>
      ) : null}
    </>
  );
}
function CollectionVideoChoices({ form }: CatalogFieldsProps) {
  const choices = form.videoChoices.filter(
    (v) =>
      v.status === "published" && v.isActive && v.format === form.values.format,
  );
  function toggle(id: string, checked: boolean) {
    form.setValue(
      "video_ids",
      checked
        ? [...form.values.video_ids, id]
        : form.values.video_ids.filter((v) => v !== id),
      { shouldDirty: true, shouldValidate: true },
    );
  }
  return (
    <div className="max-h-60 overflow-y-auto rounded border border-neutral-300 p-3 dark:border-neutral-700">
      <CollectionLoadNotices form={form} />
      {choices.map((v) => (
        <label key={v.id} className="flex items-start gap-2 py-2 text-sm">
          <input
            type="checkbox"
            checked={form.values.video_ids.includes(v.id)}
            onChange={(e) => toggle(v.id, e.target.checked)}
          />
          {v.title}
        </label>
      ))}
    </div>
  );
}
function CollectionOrderRow({
  form,
  id,
  index,
}: CatalogFieldsProps & { id: string; index: number }) {
  const title =
    form.videoChoices.find((v) => v.id === id)?.title || "Video unavailable";
  return (
    <li className="flex items-center gap-2 text-sm">
      <span className="min-w-0 flex-1">
        {index + 1}. {title}
      </span>
      <CollectionOrderActions form={form} id={id} index={index} title={title} />
    </li>
  );
}
function CollectionOrderActions({
  form,
  id,
  index,
  title,
}: CatalogFieldsProps & { id: string; index: number; title: string }) {
  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="min-h-11 min-w-11"
        aria-label={`Move up ${title}`}
        disabled={index === 0}
        onClick={() => form.move(index, -1)}
      >
        ↑
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="min-h-11 min-w-11"
        aria-label={`Move down ${title}`}
        disabled={index === form.values.video_ids.length - 1}
        onClick={() => form.move(index, 1)}
      >
        ↓
      </Button>
      <CollectionRemoveButton form={form} id={id} />
    </>
  );
}
function CollectionRemoveButton({
  form,
  id,
}: CatalogFieldsProps & { id: string }) {
  const remove = () =>
    form.setValue(
      "video_ids",
      form.values.video_ids.filter((v) => v !== id),
      { shouldDirty: true, shouldValidate: true },
    );
  return (
    <Button size="sm" variant="secondary" onClick={remove}>
      Remove
    </Button>
  );
}
export function CollectionVideoFields({ form }: CatalogFieldsProps) {
  function changeFormat(value: "horizontal" | "short") {
    form.setValue("format", value, { shouldDirty: true });
    form.setValue("video_ids", [], { shouldDirty: true, shouldValidate: true });
  }
  return (
    <>
      <Field label="Format">
        <Select
          {...form.register("format")}
          options={[
            { value: "horizontal", label: "Horizontal · 16:9" },
            { value: "short", label: "Shorts · 9:16" },
          ]}
          onChange={(e) =>
            changeFormat(e.target.value as "horizontal" | "short")
          }
        />
      </Field>
      <Field label="Find published videos">
        <Input
          value={form.search}
          onChange={(e) => form.setSearch(e.target.value)}
        />
      </Field>
      <CollectionVideoChoices form={form} />
      <ol className="space-y-2">
        {form.values.video_ids.map((id, index) => (
          <CollectionOrderRow key={id} form={form} id={id} index={index} />
        ))}
      </ol>
      {form.errors.video_ids ? (
        <p role="alert">{form.errors.video_ids.message}</p>
      ) : null}
    </>
  );
}

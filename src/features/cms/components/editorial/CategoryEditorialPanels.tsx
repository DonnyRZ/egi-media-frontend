"use client";
import { Link } from "@/i18n/navigation";
import { Field } from "@/features/cms/components/ui/Field";
import { Select } from "@/features/cms/components/ui/Select";
import { Input } from "@/features/cms/components/ui/Input";
import { Button } from "@/features/cms/components/ui/Button";
import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { MediaPreview } from "@/features/cms/components/media/MediaPreview";
import { ErrorState } from "@/shared/components/common/ErrorState";
import type { Dispatch, SetStateAction } from "react";
import type { useCategoryEditorialForm } from "@/features/cms/hooks/useCategoryEditorialForm";
interface CategoryPanelProps {
  model: ReturnType<typeof useCategoryEditorialForm>;
}
interface SlotFieldsProps {
  label: string;
  values: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  choices: { value: string; label: string }[];
  disabled: boolean;
}
function CategorySlotFields({
  label,
  values,
  onChange,
  choices,
  disabled,
}: SlotFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {values.map((id, i) => (
        <Field key={i} label={`${label} ${i + 1}`}>
          <Select
            disabled={disabled}
            value={id}
            options={choices}
            onChange={(e) =>
              onChange((current) =>
                current.map((value, index) =>
                  index === i ? e.target.value : value,
                ),
              )
            }
          />
        </Field>
      ))}
    </div>
  );
}
function CategoryLoadErrors({ model }: CategoryPanelProps) {
  return (
    <>
      {model.config.isError ? (
        <ErrorState onRetry={() => void model.config.refetch()} />
      ) : null}
      {model.options.isError ? (
        <ErrorState onRetry={() => void model.options.refetch()} />
      ) : null}
    </>
  );
}
function CategoryPositions({ model }: CategoryPanelProps) {
  return (
    <>
      <Field label="Find published stories">
        <Input
          disabled={model.saving}
          value={model.search}
          onChange={(e) => model.setSearch(e.target.value)}
        />
      </Field>
      <CategoryLoadErrors model={model} />
      <Field label="Lead">
        <Select
          disabled={model.saving}
          value={model.lead}
          options={model.choices}
          onChange={(e) => model.setLead(e.target.value)}
        />
      </Field>
      <CategorySlotFields
        label="Supporting"
        values={model.support}
        onChange={model.setSupport}
        choices={model.choices}
        disabled={model.saving}
      />
      <CategorySlotFields
        label="Editor’s Pick"
        values={model.editors}
        onChange={model.setEditors}
        choices={model.choices}
        disabled={model.saving}
      />
      <CategorySaveActions model={model} />
    </>
  );
}
function CategorySaveActions({ model }: CategoryPanelProps) {
  return (
    <>
      <Button
        loading={model.saving}
        disabled={
          model.config.isLoading ||
          model.options.isLoading ||
          model.config.isError
        }
        onClick={() => void model.save()}
      >
        Save layout
      </Button>
      {model.saveError ? (
        <p role="alert" className="text-sm text-error">
          {model.saveError}
        </p>
      ) : null}
      {model.saved ? (
        <p role="status">
          Saved.{" "}
          <Link
            className="underline"
            href={`/categories/${model.category}`}
            target="_blank"
          >
            View category →
          </Link>
        </p>
      ) : null}
    </>
  );
}
export function CategoryLayoutPanel({ model }: CategoryPanelProps) {
  const options = [
    { value: "", label: "Choose category" },
    ...(model.categories.data?.items || []).map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];
  return (
    <Card>
      <CardBody className="space-y-4">
        <Field label="Category">
          <Select
            disabled={model.saving}
            value={model.category}
            onChange={(e) => model.changeCategory(e.target.value)}
            options={options}
          />
        </Field>
        {model.categories.isError ? (
          <ErrorState onRetry={() => void model.categories.refetch()} />
        ) : null}
        {model.category ? <CategoryPositions model={model} /> : null}
      </CardBody>
    </Card>
  );
}
export function CategoryEditorialPreview({ model }: CategoryPanelProps) {
  if (!model.previewLead) return null;
  const lead = model.previewLead;
  return (
    <div className="editorial-public-preview mt-6 overflow-hidden border border-neutral-200 bg-white text-ink">
      <p className="p-4 text-sm font-semibold">
        Preview · published content only
      </p>
      <MediaPreview
        defaultVariant="lead"
        src={lead.featuredImage}
        title={lead.title}
        summary={lead.summary || ""}
      />
      <ol className="divide-y divide-neutral-200 px-4">
        {model.previewSupport.map((article, i) => (
          <li className="py-3 text-sm" key={article.id}>
            {i + 1}. {article.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { Controller, type Control } from "react-hook-form";

import { PlacementCheckboxes } from "@/features/cms/components/articles/PlacementCheckboxes";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { Field } from "@/features/cms/components/ui/Field";
import { Select } from "@/features/cms/components/ui/Select";
import { MultiSelect, type Option } from "@/features/cms/components/ui/MultiSelect";
import { FeaturedImagePicker } from "@/features/cms/components/media/FeaturedImagePicker";
import type { ArticleFormValues } from "@/features/cms/schemas/cms.schemas";

interface ArticleSettingsSidebarProps {
  control: Control<ArticleFormValues>;
  categories: Option[];
  series: Option[];
  topics: Option[];
  tags: Option[];
}

export function ArticleSettingsSidebar({
  control,
  categories,
  series,
  topics,
  tags,
}: ArticleSettingsSidebarProps) {
  return (
    <>
      <Card>
        <CardHeader title="Placement" />
        <CardBody>
          <Field
            label="Where this article appears"
            hint="Independent of Draft / Published status. Latest News is selected by default."
          >
            <Controller
              control={control}
              name="placements"
              render={({ field }) => (
                <PlacementCheckboxes
                  idPrefix="form-placement"
                  value={field.value ?? ["latest_news"]}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Organize" />
        <CardBody className="space-y-5">
          <Field label="Featured image">
            <Controller
              control={control}
              name="featuredImage"
              render={({ field }) => (
                <FeaturedImagePicker
                  value={field.value}
                  onChange={(url) => field.onChange(url ?? "")}
                />
              )}
            />
          </Field>

          <Field label="Category" htmlFor="category">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  id="category"
                  placeholder="No category"
                  options={categories}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          <Field label="Series" htmlFor="series">
            <Controller
              control={control}
              name="seriesId"
              render={({ field }) => (
                <Select
                  id="series"
                  placeholder="No series"
                  options={series}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>

          <Field label="Topics">
            <Controller
              control={control}
              name="topicIds"
              render={({ field }) => (
                <MultiSelect
                  options={topics}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Select topics…"
                  emptyLabel="No topics yet — ask a superadmin to add some"
                />
              )}
            />
          </Field>

          <Field label="Tags">
            <Controller
              control={control}
              name="tagIds"
              render={({ field }) => (
                <MultiSelect
                  options={tags}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Select tags…"
                  emptyLabel="No tags yet — ask a superadmin to add some"
                />
              )}
            />
          </Field>
        </CardBody>
      </Card>
    </>
  );
}

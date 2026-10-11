"use client";

import { Controller, useWatch, type Control, type FieldErrors, type UseFormSetValue } from "react-hook-form";

import { PlacementCheckboxes } from "@/features/cms/components/articles/PlacementCheckboxes";
import { Card, CardBody, CardHeader } from "@/features/cms/components/ui/Card";
import { Field } from "@/features/cms/components/ui/Field";
import { Select } from "@/features/cms/components/ui/Select";
import { MultiSelect, type Option } from "@/features/cms/components/ui/MultiSelect";
import { FeaturedImagePicker } from "@/features/cms/components/media/FeaturedImagePicker";
import {
  useCascadingTaxonomyOptions,
  type SeriesOption,
  type TopicOption,
} from "@/features/cms/hooks/useCascadingTaxonomyOptions";
import type { ArticleFormValues } from "@/features/cms/schemas/cms.schemas";

interface ArticleSettingsSidebarProps {
  control: Control<ArticleFormValues>;
  errors: FieldErrors<ArticleFormValues>;
  setValue: UseFormSetValue<ArticleFormValues>;
  categories: Option[];
  series: SeriesOption[];
  topics: TopicOption[];
  tags: Option[];
}

export function ArticleSettingsSidebar({
  control,
  errors,
  setValue,
  categories,
  series,
  topics,
  tags,
}: ArticleSettingsSidebarProps) {
  const categoryId = useWatch({ control, name: "categoryId" });
  const topicId = useWatch({ control, name: "topicId" });
  const headlinePosition = useWatch({ control, name: "headlinePosition" });
  const {
    filteredTopics,
    filteredSeries,
    topicsDisabled,
    seriesDisabled,
  } = useCascadingTaxonomyOptions({
    categoryId,
    topicId,
    topics,
    series,
  });

  return (
    <>
      <Card>
        <CardHeader title="Placement" />
        <CardBody>
          <Field
            label="Where this article appears"
            error={errors.headlinePosition?.message ?? errors.placements?.message}
            hint="Independent of Draft / Published status. Latest News is selected by default."
          >
            <Controller
              control={control}
              name="placements"
              render={({ field }) => (
                <PlacementCheckboxes
                  idPrefix="form-placement"
                  value={field.value ?? ["latest_news"]}
                  headlinePosition={headlinePosition ?? null}
                  onChange={field.onChange}
                  onHeadlinePositionChange={(position) =>
                    setValue("headlinePosition", position)
                  }
                />
              )}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Organize" />
        <CardBody className="space-y-5">
          <Field label="Featured image" error={errors.featuredImage?.message}>
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
                  placeholder="Select category"
                  options={categories}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    setValue("topicId", "");
                    setValue("seriesId", "");
                  }}
                />
              )}
            />
          </Field>

          <Field
            label="Topic"
            htmlFor="topic"
            hint={
              topicsDisabled
                ? "Select a category first"
                : "Only topics under the selected category"
            }
          >
            <Controller
              control={control}
              name="topicId"
              render={({ field }) => (
                <Select
                  id="topic"
                  disabled={topicsDisabled}
                  placeholder={
                    topicsDisabled ? "Select a category first" : "Select topic"
                  }
                  options={filteredTopics}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    setValue("seriesId", "");
                  }}
                />
              )}
            />
          </Field>

          <Field
            label="Series"
            htmlFor="series"
            hint={
              seriesDisabled
                ? "Select a topic first"
                : "Only series under the selected topic"
            }
          >
            <Controller
              control={control}
              name="seriesId"
              render={({ field }) => (
                <Select
                  id="series"
                  disabled={seriesDisabled}
                  placeholder={
                    seriesDisabled ? "Select a topic first" : "No series"
                  }
                  options={filteredSeries}
                  value={field.value ?? ""}
                  onChange={field.onChange}
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

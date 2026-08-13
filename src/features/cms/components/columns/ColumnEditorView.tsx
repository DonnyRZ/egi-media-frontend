"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RouteGuard } from "@/features/cms/components/auth/RouteGuard";
import { PageHeader } from "@/features/cms/components/layout/PageHeader";
import { Card, CardBody } from "@/features/cms/components/ui/Card";
import { Field } from "@/features/cms/components/ui/Field";
import { Input } from "@/features/cms/components/ui/Input";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { ColumnRejectDialog } from "@/features/cms/components/columns/ColumnRejectDialog";
import { ColumnEditorSidebar } from "@/features/cms/components/columns/ColumnEditorSidebar";
import { ColumnLocaleFields } from "@/features/cms/components/columns/ColumnLocaleFields";
import { CmsColumnCommentsPanel } from "@/features/cms/components/columns/CmsColumnCommentsPanel";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/features/cms/components/ui/StateViews";
import { useCmsColumn } from "@/features/cms/hooks/useCmsColumns";
import { useCmsColumnMutations } from "@/features/cms/hooks/useCmsColumnMutations";
import {
  cmsColumnEditorSchema,
  type CmsColumnEditorValues,
} from "@/features/cms/schemas/cms-column.schema";
import { useToast } from "@/features/cms/stores/cms-toast.store";
import { PLACEHOLDER_IMAGE_BASE } from "@/shared/constants/site.constants";
import type {
  ColumnTranslation,
  ColumnWritePayload,
} from "@/features/columns/types/column.types";

interface ColumnEditorViewProps {
  columnId: string;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function buildTranslations(
  values: CmsColumnEditorValues,
): ColumnWritePayload["translations"] {
  const translations: Partial<Record<"en" | "uz", ColumnTranslation>> = {};

  if (values.titleEn?.trim() && values.contentEn?.trim()) {
    translations.en = {
      title: values.titleEn.trim(),
      summary: values.summaryEn?.trim() || null,
      content: values.contentEn.trim(),
    };
  }
  if (values.titleUz?.trim() && values.contentUz?.trim()) {
    translations.uz = {
      title: values.titleUz.trim(),
      summary: values.summaryUz?.trim() || null,
      content: values.contentUz.trim(),
    };
  }

  return Object.keys(translations).length > 0 ? translations : undefined;
}

export function ColumnEditorView({ columnId }: ColumnEditorViewProps) {
  const router = useRouter();
  const toast = useToast();
  const detail = useCmsColumn(columnId);
  const { update, approve, reject } = useCmsColumnMutations();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const defaultValues = useMemo<CmsColumnEditorValues | undefined>(() => {
    if (!detail.data) return undefined;
    const image = detail.data.featuredImage;
    const usableImage =
      image && !image.startsWith(PLACEHOLDER_IMAGE_BASE) ? image : "";
    return {
      title: detail.data.title,
      summary: detail.data.summary ?? "",
      content: detail.data.content,
      featuredImage: usableImage,
      titleEn: detail.data.translations.en?.title ?? "",
      summaryEn: detail.data.translations.en?.summary ?? "",
      contentEn: detail.data.translations.en?.content ?? "",
      titleUz: detail.data.translations.uz?.title ?? "",
      summaryUz: detail.data.translations.uz?.summary ?? "",
      contentUz: detail.data.translations.uz?.content ?? "",
    };
  }, [detail.data]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<CmsColumnEditorValues>({
    resolver: zodResolver(cmsColumnEditorSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const canModerate = detail.data?.status === "pending_approval";

  async function saveValues(values: CmsColumnEditorValues) {
    const payload: Omit<ColumnWritePayload, "status"> = {
      title: values.title.trim(),
      content: values.content.trim(),
      summary: values.summary?.trim() || null,
      featured_image: values.featuredImage?.trim() || null,
      translations: buildTranslations(values),
    };
    await update.mutateAsync({ id: columnId, payload });
  }

  async function onSave(values: CmsColumnEditorValues) {
    try {
      await saveValues(values);
      toast.success("Column saved");
    } catch (error) {
      toast.error(errorMessage(error, "Could not save column"));
    }
  }

  async function confirmApprove() {
    try {
      if (isDirty) await saveValues(getValues());
      await approve.mutateAsync(columnId);
      toast.success(
        "Column approved. Translation started — track progress in the bell. It appears on /kolom when EN+UZ are ready.",
      );
      setApproveOpen(false);
      router.push("/cms/columns");
    } catch (error) {
      toast.error(errorMessage(error, "Could not approve column"));
    }
  }

  async function confirmReject(reason: string) {
    try {
      await reject.mutateAsync({ id: columnId, rejectionReason: reason });
      toast.success("Column rejected");
      setRejectOpen(false);
      router.push("/cms/columns");
    } catch (error) {
      toast.error(errorMessage(error, "Could not reject column"));
    }
  }

  return (
    <RouteGuard requireSuperadmin>
      <PageHeader
        title="Review column"
        description="Read, edit, then approve or reject this submission."
        actions={
          <Link
            href="/cms/columns"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            ← Back to list
          </Link>
        }
      />

      {detail.isLoading ? <LoadingState label="Loading column…" /> : null}
      {detail.isError ? (
        <ErrorState description="Could not load this column." />
      ) : null}
      {!detail.isLoading && !detail.isError && !detail.data ? (
        <EmptyState
          title="Column not found"
          description="It may have been deleted."
        />
      ) : null}

      {detail.data ? (
        <>
          <form
            className="grid gap-4 lg:grid-cols-[1fr_280px]"
            onSubmit={handleSubmit((values) => void onSave(values))}
          >
            <Card>
              <CardBody className="space-y-4">
                <ColumnLocaleFields
                  control={control}
                  register={register}
                  errors={errors}
                />
                <Field
                  label="Featured image URL"
                  htmlFor="featuredImage"
                  error={errors.featuredImage?.message}
                >
                  <Input id="featuredImage" {...register("featuredImage")} />
                </Field>
              </CardBody>
            </Card>

            <ColumnEditorSidebar
              column={detail.data}
              canModerate={Boolean(canModerate)}
              saving={update.isPending}
              approving={approve.isPending}
              onApprove={() => setApproveOpen(true)}
              onReject={() => setRejectOpen(true)}
            />
          </form>

          <CmsColumnCommentsPanel
            columnId={columnId}
            columnStatus={detail.data.status}
          />
        </>
      ) : null}

      <ConfirmDialog
        open={approveOpen}
        title="Approve & publish"
        message="Approve this column? English and Oʻzbekcha will be translated in the background. It appears on the public site when ready."
        confirmLabel="Approve & Publish"
        loading={approve.isPending || update.isPending}
        onConfirm={() => void confirmApprove()}
        onClose={() => setApproveOpen(false)}
      />

      <ColumnRejectDialog
        open={rejectOpen}
        title={detail.data?.title ?? ""}
        loading={reject.isPending}
        onConfirm={(reason) => void confirmReject(reason)}
        onClose={() => setRejectOpen(false)}
      />
    </RouteGuard>
  );
}

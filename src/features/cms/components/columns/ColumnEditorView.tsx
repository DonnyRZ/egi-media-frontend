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
import { Textarea } from "@/features/cms/components/ui/Textarea";
import { ConfirmDialog } from "@/features/cms/components/ui/ConfirmDialog";
import { ColumnRejectDialog } from "@/features/cms/components/columns/ColumnRejectDialog";
import { ColumnEditorSidebar } from "@/features/cms/components/columns/ColumnEditorSidebar";
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
import type { ColumnWritePayload } from "@/features/columns/types/column.types";

interface ColumnEditorViewProps {
  columnId: string;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
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
    };
  }, [detail.data]);

  const {
    register,
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
      toast.success("Column approved and published");
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
        <form
          className="grid gap-4 lg:grid-cols-[1fr_280px]"
          onSubmit={handleSubmit((values) => void onSave(values))}
        >
          <Card>
            <CardBody className="space-y-4">
              <Field label="Title" htmlFor="title" required error={errors.title?.message}>
                <Input id="title" invalid={Boolean(errors.title)} {...register("title")} />
              </Field>
              <Field label="Summary" htmlFor="summary" error={errors.summary?.message}>
                <Textarea id="summary" rows={3} {...register("summary")} />
              </Field>
              <Field label="Content" htmlFor="content" required error={errors.content?.message}>
                <Textarea id="content" rows={16} {...register("content")} />
              </Field>
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
      ) : null}

      <ConfirmDialog
        open={approveOpen}
        title="Approve & publish"
        message="Publish this column to the main site now?"
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

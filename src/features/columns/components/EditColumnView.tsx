"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { ColumnForm } from "@/features/columns/components/ColumnForm";
import { ColumnsSignInPrompt } from "@/features/columns/components/ColumnsSignInPrompt";
import { COLUMN_EDITABLE_STATUSES } from "@/features/columns/constants/column.constants";
import { useMyColumnDetail } from "@/features/columns/hooks/useMyColumnDetail";
import type { ColumnFormValues } from "@/features/columns/schemas/column.schema";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { PLACEHOLDER_IMAGE_BASE } from "@/shared/constants/site.constants";

interface EditColumnViewProps {
  columnId: string;
}

export function EditColumnView({ columnId }: EditColumnViewProps) {
  const t = useTranslations("columnsPage");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const detail = useMyColumnDetail(columnId);

  const canEdit =
    detail.data &&
    (COLUMN_EDITABLE_STATUSES as readonly string[]).includes(detail.data.status);

  const defaultValues = useMemo<ColumnFormValues | undefined>(() => {
    if (!detail.data) return undefined;
    const en = detail.data.translations.en;
    const uz = detail.data.translations.uz;
    const idLocale = detail.data.translations.id;
    const image = detail.data.featuredImage;
    const usableImage =
      image && !image.startsWith(PLACEHOLDER_IMAGE_BASE) ? image : "";

    return {
      title: idLocale?.title ?? detail.data.title,
      summary: idLocale?.summary ?? detail.data.summary ?? "",
      content: idLocale?.content ?? detail.data.content,
      featuredImage: usableImage,
      titleEn: en?.title ?? "",
      summaryEn: en?.summary ?? "",
      contentEn: en?.content ?? "",
      titleUz: uz?.title ?? "",
      summaryUz: uz?.summary ?? "",
      contentUz: uz?.content ?? "",
    };
  }, [detail.data]);

  if (!isHydrated || detail.isLoading) {
    return (
      <Section>
        <Container>
          <Skeleton className="h-64 w-full" />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <ColumnsSignInPrompt />
        </Container>
      </Section>
    );
  }

  if (detail.isError) {
    return (
      <Section>
        <Container>
          <ErrorState
            message={detail.error?.message}
            onRetry={() => void detail.refetch()}
          />
        </Container>
      </Section>
    );
  }

  if (!detail.data) {
    return (
      <Section>
        <Container>
          <EmptyState message={t("notFound")} />
        </Container>
      </Section>
    );
  }

  if (!canEdit) {
    return (
      <Section>
        <Container>
          <EmptyState message={t("cannotEditPublished")} />
          <div className="mt-4 text-center">
            <Link
              className="text-sm font-semibold text-primary-700"
              href="/kolom/saya"
            >
              ← {t("backToMyColumns")}
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="max-w-4xl">
        <Link
          className="text-sm font-semibold text-primary-700 hover:text-accent"
          href="/kolom/saya"
        >
          ← {t("backToMyColumns")}
        </Link>
        <h1 className="mt-3 font-sans text-3xl font-bold text-ink">
          {t("editHeadline")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          {t("editLede")}
        </p>

        {defaultValues ? (
          <div className="mt-8">
            <ColumnForm
              columnId={columnId}
              defaultValues={defaultValues}
              mode="edit"
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

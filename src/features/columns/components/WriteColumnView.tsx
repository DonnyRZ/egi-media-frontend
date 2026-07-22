"use client";

import { useTranslations } from "next-intl";

import { ColumnForm } from "@/features/columns/components/ColumnForm";
import { ColumnsSignInPrompt } from "@/features/columns/components/ColumnsSignInPrompt";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export function WriteColumnView() {
  const t = useTranslations("columnsPage");
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isHydrated) {
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

  return (
    <Section>
      <Container className="max-w-4xl">
        <Link
          className="text-sm font-semibold text-primary-700 hover:text-accent"
          href="/kolom/saya"
        >
          ← {t("backToMyColumns")}
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">
          {t("writeHeadline")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          {t("writeLede")}
        </p>
        <div className="mt-8">
          <ColumnForm mode="create" />
        </div>
      </Container>
    </Section>
  );
}

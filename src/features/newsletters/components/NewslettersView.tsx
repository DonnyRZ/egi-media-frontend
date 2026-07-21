"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { NewsletterCard } from "@/features/newsletters/components/NewsletterCard";
import { NewslettersSignInPrompt } from "@/features/newsletters/components/NewslettersSignInPrompt";
import { useNewsletterSubscriptions } from "@/features/newsletters/hooks/useNewsletterSubscriptions";
import { useNewslettersPage } from "@/features/newsletters/hooks/useNewslettersPage";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="space-y-3 border border-neutral-200 p-5" key={index}>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-28" />
        </div>
      ))}
    </div>
  );
}

export function NewslettersView() {
  const t = useTranslations("newslettersPage");
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, isError, error, refetch } = useNewslettersPage(page);
  const { isSubscribed, isPending, errorFor, toggle } =
    useNewsletterSubscriptions();

  if (!isHydrated) {
    return (
      <Section>
        <Container>
          <GridSkeleton />
        </Container>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section>
        <Container>
          <NewslettersSignInPrompt />
        </Container>
      </Section>
    );
  }

  const hasItems = Boolean(data?.items.length);

  return (
    <Section>
      <Container>
        <div className="mb-6 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
          <h2 className="text-lg font-bold uppercase tracking-wide text-ink">
            {t("listingHeading")}
          </h2>
          {data ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t("count", { count: data.total })}
            </p>
          ) : null}
        </div>

        {isLoading ? <GridSkeleton /> : null}

        {isError ? (
          <ErrorState message={error?.message} onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && !hasItems ? (
          <EmptyState message={t("empty")} />
        ) : null}

        {!isLoading && !isError && hasItems && data ? (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((newsletter) => (
                <NewsletterCard
                  errorMessage={errorFor(newsletter.id)}
                  isPending={isPending(newsletter.id)}
                  isSubscribed={isSubscribed(newsletter.id)}
                  key={newsletter.id}
                  newsletter={newsletter}
                  onToggle={toggle}
                />
              ))}
            </div>
            <Pagination
              basePath="/newsletters"
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NotificationsHero } from "@/features/notifications/components/NotificationsHero";
import { NotificationsView } from "@/features/notifications/components/NotificationsView";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface NotificationsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: NotificationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("notificationsTitle"),
    description: t("notificationsDescription"),
  };
}

function ViewFallback() {
  return (
    <Section>
      <Container>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Container>
    </Section>
  );
}

export default async function NotificationsPage({
  params,
}: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <NotificationsHero />
      <Suspense fallback={<ViewFallback />}>
        <NotificationsView />
      </Suspense>
    </>
  );
}

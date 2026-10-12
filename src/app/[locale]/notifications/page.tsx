import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NotificationsHero } from "@/features/notifications/components/NotificationsHero";
import { NotificationsView } from "@/features/notifications/components/NotificationsView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
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
    <FrameModule>
      <div className="divide-y divide-neutral-100 bg-white">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="flex items-start gap-4 px-4 py-4 md:px-5" key={index}>
            <Skeleton className="h-10 w-10 flex-none rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </FrameModule>
  );
}

export default async function NotificationsPage({
  params,
}: NotificationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageFrame>
      <NotificationsHero />
      <Suspense fallback={<ViewFallback />}>
        <NotificationsView />
      </Suspense>
    </PageFrame>
  );
}

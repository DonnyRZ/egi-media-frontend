import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MyColumnsView } from "@/features/columns/components/MyColumnsView";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { Skeleton } from "@/shared/components/ui/Skeleton";

interface MyColumnsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: MyColumnsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("columnsMineTitle"),
    description: t("columnsDescription"),
  };
}

function ViewFallback() {
  return (
    <PageFrame>
      <FrameModule>
        <div className="bg-white p-5">
          <Skeleton className="h-16 w-48" />
          <Skeleton className="mt-4 h-10 w-2/3" />
        </div>
      </FrameModule>
      <FrameModule>
        <div className="bg-white p-5">
          <Skeleton className="h-48 w-full" />
        </div>
      </FrameModule>
    </PageFrame>
  );
}

export default async function MyColumnsPage({ params }: MyColumnsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<ViewFallback />}>
      <MyColumnsView />
    </Suspense>
  );
}

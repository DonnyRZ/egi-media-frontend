"use client";

import { useTranslations } from "next-intl";

import { useTopicCatalog } from "@/features/topic-subscriptions/hooks/useTopicCatalog";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function ForYouEmptyState() {
  const t = useTranslations("forYou");
  const e=useTranslations("editorial");
  const catalog=useTopicCatalog();

  return (
    <div className="bg-white px-4 py-5">
      <h3 className="font-sans text-xl font-bold text-ink">{t("emptyTitle")}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">
        {catalog.data?.total?t("emptyMessage"):e("noTopics")}
      </p>
      <Link className="mt-5 inline-block" href={catalog.data?.total ? "/settings/topics" : "/latest"}>
        <Button type="button">{catalog.data?.total?t("emptyCta"):e("latest")}</Button>
      </Link>
    </div>
  );
}

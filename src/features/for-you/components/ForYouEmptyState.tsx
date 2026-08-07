"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function ForYouEmptyState() {
  const t = useTranslations("forYou");

  return (
    <div className="bg-white px-6 py-10 text-center">
      <h3 className="font-serif text-xl font-bold text-ink">{t("emptyTitle")}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-600">
        {t("emptyMessage")}
      </p>
      <Link className="mt-5 inline-block" href="/settings/topics">
        <Button type="button">{t("emptyCta")}</Button>
      </Link>
    </div>
  );
}

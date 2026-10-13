"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function NotificationsSignInPrompt() {
  const t = useTranslations("notificationsPage");

  return (
    <div className="mx-auto max-w-md rounded-xl border border-neutral-300 bg-white p-8 text-center shadow-sm">
      <h2 className="editorial-section-title text-lg font-semibold text-neutral-900">
        {t("signInTitle")}
      </h2>
      <p className="mt-2 text-sm text-neutral-500">{t("signInMessage")}</p>
      <Link className="mt-5 inline-block" href="/login">
        <Button type="button">{t("signInCta")}</Button>
      </Link>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";

export function TopicSubscriptionsSignInPrompt() {
  const t = useTranslations("topicSubscriptionsPage");

  return (
    <div className="mx-auto max-w-md border border-neutral-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-neutral-900">{t("signInTitle")}</h2>
      <p className="mt-2 text-sm text-neutral-500">{t("signInMessage")}</p>
      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/login">
          <Button type="button">{t("signInCta")}</Button>
        </Link>
        <Link href="/register">
          <Button type="button" variant="secondary">
            {t("signUpCta")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

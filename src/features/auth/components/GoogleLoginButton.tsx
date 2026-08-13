"use client";

import { useLocale, useTranslations } from "next-intl";

import { googleOAuthStartUrl } from "@/features/auth/lib/oauth-next";
import { Button } from "@/shared/components/ui/Button";

interface GoogleLoginButtonProps {
  next?: string;
}

export function GoogleLoginButton({ next }: GoogleLoginButtonProps) {
  const t = useTranslations("auth");
  const locale = useLocale();

  function handleGoogleLogin() {
    window.location.assign(googleOAuthStartUrl(locale, next));
  }

  return (
    <Button
      className="w-full rounded-none border border-neutral-300 bg-white text-ink hover:bg-neutral-50"
      onClick={handleGoogleLogin}
      type="button"
      variant="secondary"
    >
      <span className="mr-2 inline-flex h-4 w-4 items-center justify-center font-serif text-sm font-bold text-[#4285F4]">
        G
      </span>
      {t("continueWithGoogle")}
    </Button>
  );
}

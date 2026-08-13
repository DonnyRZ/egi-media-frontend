"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { AuthSuccessDialog } from "@/features/auth/components/AuthSuccessDialog";
import { safeOAuthNext } from "@/features/auth/lib/oauth-next";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useRouter } from "@/i18n/navigation";

function useGoogleOAuthSession() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const next = safeOAuthNext(searchParams.get("next"));

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const expiresIn = Number(searchParams.get("expires_in"));
    const resolvedExpiresIn =
      Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 7 * 24 * 60 * 60;

    if (!accessToken || !refreshToken) {
      setError(t("errors.googleFailed"));
      return;
    }

    void setSession({
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: resolvedExpiresIn,
    })
      .then(() => {
        if (next) {
          router.replace(next);
          router.refresh();
          return;
        }
        setShowSuccess(true);
      })
      .catch(() => setError(t("errors.googleFailed")));
  }, [next, router, searchParams, setSession, t]);

  return { error, next, showSuccess, router };
}

export function GoogleCallbackView() {
  const t = useTranslations("auth");
  const { error, next, showSuccess, router } = useGoogleOAuthSession();

  if (next) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-sm text-white">
        <p>{error ?? t("googleLoadingBody")}</p>
      </div>
    );
  }

  return (
    <AuthShell subtitle={t("googleLoadingBody")} title={t("googleLoadingTitle")}>
      <div className="space-y-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-ink">
          {error ? t("googleFailedTitle") : t("googleLoadingTitle")}
        </h2>
        <p className="text-sm text-neutral-600">{error ?? t("googleLoadingBody")}</p>
      </div>
      <AuthSuccessDialog
        body={t("loginSuccessBody")}
        confirmLabel={t("continueToHome")}
        onContinue={() => {
          router.replace("/");
          router.refresh();
        }}
        open={showSuccess}
        title={t("loginSuccessTitle")}
      />
    </AuthShell>
  );
}

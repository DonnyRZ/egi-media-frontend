"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/Button";
import { useOutsideClick } from "@/shared/hooks/useOutsideClick";
import { useUiStore } from "@/shared/stores/ui.store";

export function AuthUserMenu() {
  const t = useTranslations("auth");
  const tHeader = useTranslations("header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));

  if (!isHydrated) {
    return (
      <span aria-hidden="true" className="inline-block h-4 w-16 bg-white/20" />
    );
  }

  if (!user) {
    return (
      <Link className="text-sm font-semibold text-neutral-300 hover:text-white" href="/login">
        {tHeader("signIn")}
      </Link>
    );
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.replace("/login");
    router.refresh();
  }

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 text-left text-neutral-300 hover:text-white"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex h-7 w-7 items-center justify-center bg-white text-[10px] font-bold text-ink">
          {initials || "U"}
        </span>
        <span className="hidden max-w-[9rem] truncate text-xs font-semibold uppercase tracking-wide sm:inline">
          {user.fullName}
        </span>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-56 border border-neutral-200 bg-white py-2 shadow-md"
          role="menu"
        >
          <div className="border-b border-neutral-100 px-4 py-2">
            <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
          <Link
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            href="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            {t("profile")}
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            href="/settings/topics"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            {t("topicPreferences")}
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            href="/for-you"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            {t("forYou")}
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            href="/saved"
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            {t("saved")}
          </Link>
          <button
            className="block w-full border-t border-neutral-100 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            onClick={() => void handleLogout()}
            role="menuitem"
            type="button"
          >
            {t("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AuthMobileActions() {
  const t = useTranslations("auth");
  const tHeader = useTranslations("header");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);

  if (!isHydrated) return null;

  if (!user) {
    return (
      <Link
        className="block py-2 text-sm font-semibold uppercase tracking-wide text-neutral-200"
        href="/login"
        onClick={() => setMobileMenuOpen(false)}
      >
        {tHeader("signIn")}
      </Link>
    );
  }

  return (
    <div className="space-y-2 border-t border-neutral-800 pt-3">
      <p className="text-sm font-semibold text-white">{user.fullName}</p>
      <p className="text-xs text-neutral-400">{user.email}</p>
      <Link
        className="block py-1 text-sm font-semibold uppercase tracking-wide text-neutral-200"
        href="/profile"
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("profile")}
      </Link>
      <Link
        className="block py-1 text-sm font-semibold uppercase tracking-wide text-neutral-200"
        href="/settings/topics"
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("topicPreferences")}
      </Link>
      <Link
        className="block py-1 text-sm font-semibold uppercase tracking-wide text-neutral-200"
        href="/for-you"
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("forYou")}
      </Link>
      <Link
        className="block py-1 text-sm font-semibold uppercase tracking-wide text-neutral-200"
        href="/saved"
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("saved")}
      </Link>
      <Button
        className="w-full rounded-none"
        onClick={() => {
          void (async () => {
            setMobileMenuOpen(false);
            await logout();
            router.replace("/login");
            router.refresh();
          })();
        }}
        type="button"
        variant="secondary"
      >
        {t("signOut")}
      </Button>
    </div>
  );
}

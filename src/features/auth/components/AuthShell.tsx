"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  kicker?: string;
}

export function AuthShell({ children, title, subtitle, kicker }: AuthShellProps) {
  const t = useTranslations("auth");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[linear-gradient(180deg,#f8f7f4_0%,#ffffff_45%,#f3f1ec_100%)]">
      <Container className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-16">
        <section className="max-w-xl">
          <p className="kicker">{kicker ?? t("kicker")}</p>
          <h1 className="editorial-page-title mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="editorial-summary mt-4 max-w-md text-sm leading-7 text-neutral-600 lg:text-base">
            {subtitle}
          </p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {SITE_NAME}
          </p>
        </section>

        <section className="border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
          {children}
        </section>
      </Container>

      <Container className="pb-10">
        <p className="text-center text-xs text-neutral-500">
          <Link className="font-semibold text-neutral-700 hover:text-accent" href="/">
            ← {t("backHome")}
          </Link>
        </p>
      </Container>
    </div>
  );
}

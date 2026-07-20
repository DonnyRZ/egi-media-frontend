import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { Footer } from "@/features/footer/components/Footer";
import { Header } from "@/features/header/components/Header";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { SITE_NAME } from "@/shared/constants/site.constants";
import { env } from "@/shared/config/env";
import { routing } from "@/i18n/routing";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = t("siteDescription");

  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    metadataBase: new URL(env.siteUrl),
    openGraph: {
      title: SITE_NAME,
      description,
      url: env.siteUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${sourceSerif.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

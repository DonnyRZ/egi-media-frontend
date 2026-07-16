import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/features/footer/components/Footer";
import { Header } from "@/features/header/components/Header";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/constants/site.constants";
import { env } from "@/shared/config/env";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(env.siteUrl),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: env.siteUrl,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

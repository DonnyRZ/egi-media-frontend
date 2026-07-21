import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { CmsBootstrap } from "@/features/cms/components/CmsBootstrap";
import { Toaster } from "@/features/cms/components/ui/Toaster";
import { QueryProvider } from "@/shared/providers/QueryProvider";

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
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Editorial CMS | EGI Media",
  description: "Internal editorial content management for EGI Media.",
  robots: { index: false, follow: false },
};

// Applied before paint to avoid a light/dark flash on first load.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('cms_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}`;

export default function CmsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`cms-root ${inter.variable} ${sourceSerif.variable} font-sans`}>
        <QueryProvider>
          <AuthProvider>
            <CmsBootstrap />
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

"use client";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../../messages/id.json";
export function EditorialCmsProvider({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider
      locale="id"
      messages={messages}
      timeZone="Asia/Tashkent"
    >
      {children}
    </NextIntlClientProvider>
  );
}

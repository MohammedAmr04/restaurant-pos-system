"use client";

import { NextIntlClientProvider } from "next-intl";
import arMessages from "../../messages/ar.json";

export function TranslationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="ar" messages={arMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

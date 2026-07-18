import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";
import { TranslationsProvider } from "@/providers/translations-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "نظام نقطة بيع المطعم",
  description: "نظام إدارة مطاعم متكامل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <TranslationsProvider>
          <Providers>
            {children}
            <Toaster
              position="top-center"
              dir="rtl"
              richColors
              closeButton
              duration={3000}
              toastOptions={{
                style: {
                  fontFamily: "inherit",
                },
              }}
            />
          </Providers>
        </TranslationsProvider>
      </body>
    </html>
  );
}

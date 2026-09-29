import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { I18nProvider } from "@/i18n/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "iyiCRM",
    template: "%s | iyiCRM",
  },
  description: "iyiCRM - Kurumsal Yönetim Platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

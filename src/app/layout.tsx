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
    default: "NDT Servis",
    template: "%s NDT Servis",
  },
  description: "NDT Servis Management System",
  icons: {
    icon: "https://www.ndtservis.com/theme/ndt-servis-logo.svg"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

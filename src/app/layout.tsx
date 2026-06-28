import "./globals.css";
import { Inter } from "next/font/google";

import { I18nProvider } from "@/i18n/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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

import { cache } from "react";
import { cookies } from "next/headers";
import { LOCALE_STORAGE_KEY, isLocale, defaultLocale, messages } from "@/i18n/config";

export const getLocale = cache(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_STORAGE_KEY);
  const val = localeCookie?.value;
  return (val && isLocale(val) ? val : defaultLocale) as keyof typeof messages;
});

export async function getT<K extends keyof typeof messages[typeof defaultLocale]>(
  namespace: K
) {
  const locale = await getLocale();
  return (key: string) =>
    (messages[locale][namespace] as Record<string, string>)[key] ?? key;
}

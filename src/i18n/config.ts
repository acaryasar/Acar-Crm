import de from "./messages/de.json";
import en from "./messages/en.json";
import fr from "./messages/fr.json";
import ru from "./messages/ru.json";
import tr from "./messages/tr.json";

export const locales = ["en", "de", "fr", "ru", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_STORAGE_KEY = "Acar-Crm-locale";

export const messages: Record<Locale, typeof en> = {
  en,
  de,
  fr,
  ru,
  tr,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && isLocale(stored) ? stored : defaultLocale;
}

// @lumen/i18n — locale catalogs for LUMEN.
// Phase 1: en + es. Phase 2: 10 more (see ROADMAP.md).

import en from "./messages/en.json" with { type: "json" };
import es from "./messages/es.json" with { type: "json" };

export const messages = { en, es } as const;
export type Locale = keyof typeof messages;
export const SUPPORTED_LOCALES = ["en", "es"] as const;
export const DEFAULT_LOCALE: Locale = "en";

/** Resolve a locale from an Accept-Language string. Falls back to default. */
export function resolveLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const parts = acceptLanguage.split(",").map((p) => p.trim().split(";")[0]!.toLowerCase());
  for (const part of parts) {
    const tag = part.split("-")[0]!;
    if (SUPPORTED_LOCALES.includes(tag as Locale)) return tag as Locale;
  }
  return DEFAULT_LOCALE;
}

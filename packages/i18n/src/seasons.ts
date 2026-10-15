// Liturgical season + day-title localization.
// Engine in @lumen/liturgy generates English; this maps for non-English locales.

import type { Locale } from "./index.ts";

const SEASON_NAMES: Record<Locale, Record<string, string>> = {
  en: {
    advent: "Advent",
    christmas: "Christmas",
    ordinary_time: "Ordinary Time",
    lent: "Lent",
    triduum: "Sacred Paschal Triduum",
    easter: "Easter",
  },
  es: {
    advent: "Adviento",
    christmas: "Navidad",
    ordinary_time: "Tiempo Ordinario",
    lent: "Cuaresma",
    triduum: "Triduo Pascual",
    easter: "Pascua",
  },
};

export function seasonName(season: string, locale: Locale): string {
  return SEASON_NAMES[locale]?.[season] ?? SEASON_NAMES.en[season] ?? season;
}

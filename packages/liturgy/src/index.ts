// @lumen/liturgy — liturgical calendar engine.
//
// Implements the Roman Rite (Ordinary Form) temporal cycle for any civil date.
// Universal Norms for the Liturgical Year (Normae Universales de Anno Liturgico, 1969).
//
// Scope of v1:
//   ✓ Computus (Easter) via Anonymous Gregorian / Meeus–Jones–Butcher
//   ✓ Movable feasts derived from Easter (Ash Weds, Triduum, Ascension, Pentecost, Trinity, Christ the King)
//   ✓ Advent, Christmas, Lent, Triduum, Easter, Ordinary Time
//   ✓ Sunday lectionary cycle A/B/C
//   ✓ Weekday lectionary cycle I/II
//   ✓ Title generation in English
//   ✓ Liturgical color
// Out of scope for v1 (deliberately):
//   • Proper of saints (memorial overrides) — needs sanctoral data file
//   • Extraordinary Form calendar
//   • Eastern Catholic calendars
//   • Local proper calendars (US, country-specific)
//   • Transferred solemnities (e.g., US Ascension → Sunday)
// Add these in @lumen/liturgy@v2.

export * from "./types.ts";
export * from "./computus.ts";
export * from "./calendar.ts";

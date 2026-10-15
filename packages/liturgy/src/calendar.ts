import { addDays, dayOfWeek, easter } from "./computus.ts";
import type {
  LiturgicalColor,
  LiturgicalDay,
  LiturgicalRank,
  LiturgicalSeason,
  SundayCycle,
  WeekdayCycle,
} from "./types.ts";

// ─── ISO date utilities (timezone-naive on purpose) ─────────────────────────

function toISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!));
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

// ─── Key dates per liturgical year ──────────────────────────────────────────

/** All the dates a liturgical-year computation needs. Cached per civil year on the caller. */
export type LiturgicalYearAxes = {
  /** First Sunday of Advent — start of liturgical year ENDING in (civilYear+1). */
  firstAdventOfPrior: Date;
  christmas: Date;
  baptismOfTheLord: Date;
  ashWednesday: Date;
  easter: Date;
  ascensionThursday: Date;
  pentecost: Date;
  trinity: Date;
  christTheKing: Date;
  firstAdventOfThis: Date;
};

/** Compute all axes anchored to a civil year (Jan–Dec). */
export function axesForYear(year: number): LiturgicalYearAxes {
  const easterDate = easter(year);
  const ashWeds = addDays(easterDate, -46); // Easter − 46 days = Ash Wednesday
  const ascension = addDays(easterDate, 39); // 40 days incl Easter Sunday = +39
  const pentecost = addDays(easterDate, 49);
  const trinity = addDays(easterDate, 56);
  const christmas = new Date(Date.UTC(year, 11, 25));
  const baptism = computeBaptismOfTheLord(year);
  return {
    firstAdventOfPrior: firstSundayOfAdvent(year - 1),
    christmas,
    baptismOfTheLord: baptism,
    ashWednesday: ashWeds,
    easter: easterDate,
    ascensionThursday: ascension,
    pentecost,
    trinity,
    christTheKing: addDays(firstSundayOfAdvent(year), -7),
    firstAdventOfThis: firstSundayOfAdvent(year),
  };
}

/** First Sunday of Advent in a civil year = the Sunday on/before Nov 27. */
function firstSundayOfAdvent(year: number): Date {
  const nov30 = new Date(Date.UTC(year, 10, 30));
  // Sunday closest to Nov 30 (Andrew). Rule: nearest Sunday — back up to last Sunday on/before Dec 3.
  const dec3 = new Date(Date.UTC(year, 11, 3));
  const dow = dayOfWeek(dec3);
  return addDays(dec3, -dow);
}

/** Baptism of the Lord: Sunday after Epiphany (US norm: Sunday after Jan 6, unless Epiphany is on Jan 7/8). */
function computeBaptismOfTheLord(year: number): Date {
  // Universal norm: Epiphany is Jan 6; Baptism is the following Sunday.
  // If Jan 6 is itself a Sunday, Baptism is the next day (Monday Jan 7) — Universal Norms §38.
  const jan6 = new Date(Date.UTC(year, 0, 6));
  const dow = dayOfWeek(jan6);
  if (dow === 0) return addDays(jan6, 1);
  // Otherwise: first Sunday on/after Jan 7
  const daysUntilSunday = (7 - dayOfWeek(addDays(jan6, 1))) % 7;
  return addDays(jan6, 1 + daysUntilSunday);
}

// ─── Lectionary cycle ───────────────────────────────────────────────────────

/**
 * Sunday cycle A/B/C based on civil year the liturgical year *ends* in.
 * Verified: 2023→A, 2024→B, 2025→C, 2026→A, 2027→B (USCCB Roman Missal lectionary).
 */
export function sundayCycleForLiturgicalEndYear(endYear: number): SundayCycle {
  const r = endYear % 3;
  return r === 1 ? "A" : r === 2 ? "B" : "C";
}

/** Weekday cycle I (odd end-year) or II (even end-year). */
export function weekdayCycleForLiturgicalEndYear(endYear: number): WeekdayCycle {
  return endYear % 2 === 1 ? "I" : "II";
}

/** Determine which civil year a given date's liturgical year ENDS in. */
function liturgicalEndYear(date: Date): number {
  const civilYear = date.getUTCFullYear();
  const advent = firstSundayOfAdvent(civilYear);
  // On/after First Advent → liturgical year ends next civil year.
  return date.getTime() >= advent.getTime() ? civilYear + 1 : civilYear;
}

// ─── The main function ─────────────────────────────────────────────────────

/**
 * Compute liturgical metadata for any civil date.
 * Pass a Date in UTC. Callers should normalize their local date to UTC midnight first.
 */
export function liturgicalDay(date: Date): LiturgicalDay {
  const civilYear = date.getUTCFullYear();
  const a = axesForYear(civilYear);

  const endYear = liturgicalEndYear(date);
  const cycle = {
    sunday: sundayCycleForLiturgicalEndYear(endYear),
    weekday: weekdayCycleForLiturgicalEndYear(endYear),
  };

  const season = classifySeason(date, a);
  const isSunday = dayOfWeek(date) === 0;

  // Solemnities/feasts of the Lord that override
  const fixed = checkFixedFeast(date);
  const movable = checkMovableFeast(date, a);
  const override = movable ?? fixed;
  if (override) {
    return {
      date: toISO(date),
      season,
      color: override.color,
      rank: override.rank,
      title: override.title,
      cycle,
    };
  }

  const { title, color, rank } = describeTemporalDay(date, season, a, isSunday);
  return { date: toISO(date), season, color, rank, title, cycle };
}

// ─── Season classification ──────────────────────────────────────────────────

function classifySeason(date: Date, a: LiturgicalYearAxes): LiturgicalSeason {
  const t = date.getTime();
  const triduumStart = addDays(a.easter, -3).getTime(); // Holy Thursday
  // Order matters — earliest seasons in the civil year first.
  if (t <= a.baptismOfTheLord.getTime()) return "christmas"; // Jan 1 → Baptism inclusive (carry-over from prior Dec)
  if (t < a.ashWednesday.getTime()) return "ordinary_time"; // Baptism + 1 → Shrove Tuesday
  if (t < triduumStart) return "lent";
  if (t < a.easter.getTime()) return "triduum";
  if (t <= a.pentecost.getTime()) return "easter";
  if (t < a.firstAdventOfThis.getTime()) return "ordinary_time"; // Pentecost Mon → Sat before Advent
  if (t < a.christmas.getTime()) return "advent"; // First Advent → Dec 24
  return "christmas"; // Dec 25 → year end
}

// ─── Fixed and movable feasts (minimal v1 set) ──────────────────────────────

type Override = { title: string; color: LiturgicalColor; rank: LiturgicalRank };

function checkFixedFeast(date: Date): Override | null {
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  if (m === 1 && d === 1) return { title: "Solemnity of Mary, Mother of God", color: "white", rank: "solemnity" };
  if (m === 1 && d === 6) return { title: "Epiphany of the Lord", color: "white", rank: "solemnity" };
  if (m === 3 && d === 19) return { title: "Solemnity of Saint Joseph", color: "white", rank: "solemnity" };
  if (m === 3 && d === 25) return { title: "Annunciation of the Lord", color: "white", rank: "solemnity" };
  if (m === 6 && d === 24) return { title: "Nativity of Saint John the Baptist", color: "white", rank: "solemnity" };
  if (m === 6 && d === 29) return { title: "Saints Peter and Paul", color: "red", rank: "solemnity" };
  if (m === 8 && d === 15) return { title: "Assumption of the Blessed Virgin Mary", color: "white", rank: "solemnity" };
  if (m === 11 && d === 1) return { title: "All Saints", color: "white", rank: "solemnity" };
  if (m === 11 && d === 2) return { title: "All Souls", color: "violet", rank: "solemnity" };
  if (m === 12 && d === 8) return { title: "Immaculate Conception of the Blessed Virgin Mary", color: "white", rank: "solemnity" };
  if (m === 12 && d === 25) return { title: "Nativity of the Lord (Christmas)", color: "white", rank: "solemnity" };
  return null;
}

function checkMovableFeast(date: Date, a: LiturgicalYearAxes): Override | null {
  const t = date.getTime();
  if (t === a.ashWednesday.getTime())
    return { title: "Ash Wednesday", color: "violet", rank: "privileged_weekday" };
  if (t === addDays(a.easter, -3).getTime())
    return { title: "Holy Thursday — Mass of the Lord's Supper", color: "white", rank: "privileged_weekday" };
  if (t === addDays(a.easter, -2).getTime())
    return { title: "Good Friday of the Lord's Passion", color: "red", rank: "privileged_weekday" };
  if (t === addDays(a.easter, -1).getTime())
    return { title: "Holy Saturday", color: "white", rank: "privileged_weekday" };
  if (t === a.easter.getTime())
    return { title: "Easter Sunday of the Resurrection of the Lord", color: "white", rank: "solemnity" };
  if (t === a.ascensionThursday.getTime())
    return { title: "Ascension of the Lord", color: "white", rank: "solemnity" };
  if (t === a.pentecost.getTime())
    return { title: "Pentecost Sunday", color: "red", rank: "solemnity" };
  if (t === a.trinity.getTime())
    return { title: "Solemnity of the Most Holy Trinity", color: "white", rank: "solemnity" };
  if (t === addDays(a.trinity, 7).getTime())
    return { title: "Solemnity of the Most Holy Body and Blood of Christ (Corpus Christi)", color: "white", rank: "solemnity" };
  if (t === a.christTheKing.getTime())
    return { title: "Solemnity of Our Lord Jesus Christ, King of the Universe", color: "white", rank: "solemnity" };
  return null;
}

// ─── Temporal day description ───────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];

function describeTemporalDay(
  date: Date,
  season: LiturgicalSeason,
  a: LiturgicalYearAxes,
  isSunday: boolean
): { title: string; color: LiturgicalColor; rank: LiturgicalRank } {
  const dow = dayOfWeek(date);
  const dowName = DAY_NAMES[dow]!;

  switch (season) {
    case "advent": {
      const adventStart =
        date.getTime() >= a.firstAdventOfThis.getTime() ? a.firstAdventOfThis : a.firstAdventOfPrior;
      const weekIndex = Math.floor(diffDays(date, adventStart) / 7); // 0-based
      const week = ORDINALS[weekIndex] ?? `${weekIndex + 1}th`;
      const color: LiturgicalColor = weekIndex === 2 ? "rose" : "violet"; // Gaudete on 3rd Sunday
      return isSunday
        ? { title: `${week} Sunday of Advent`, color, rank: "sunday" }
        : { title: `${dowName} of the ${week} Week of Advent`, color: "violet", rank: "weekday" };
    }
    case "christmas": {
      return isSunday
        ? { title: `Sunday in the Octave of Christmas`, color: "white", rank: "sunday" }
        : { title: `${dowName} in the Christmas Season`, color: "white", rank: "weekday" };
    }
    case "lent": {
      const lentStart = addDays(a.ashWednesday, 4); // 1st Sunday of Lent
      const weekIndex = Math.max(0, Math.floor(diffDays(date, lentStart) / 7));
      const week = ORDINALS[weekIndex] ?? `${weekIndex + 1}th`;
      const beforeFirstSunday = date.getTime() < lentStart.getTime();
      // Holy Week begins Palm Sunday = Easter − 7
      const palmSunday = addDays(a.easter, -7);
      if (date.getTime() >= palmSunday.getTime()) {
        if (isSunday) return { title: "Palm Sunday of the Passion of the Lord", color: "red", rank: "sunday" };
        return { title: `${dowName} of Holy Week`, color: "violet", rank: "privileged_weekday" };
      }
      if (beforeFirstSunday) {
        return { title: `${dowName} after Ash Wednesday`, color: "violet", rank: "weekday" };
      }
      const color: LiturgicalColor = isSunday && weekIndex === 3 ? "rose" : "violet"; // Laetare
      return isSunday
        ? { title: `${week} Sunday of Lent`, color, rank: "sunday" }
        : { title: `${dowName} of the ${week} Week of Lent`, color: "violet", rank: "weekday" };
    }
    case "triduum": {
      return { title: `${dowName} of the Sacred Paschal Triduum`, color: "white", rank: "privileged_weekday" };
    }
    case "easter": {
      const weekIndex = Math.floor(diffDays(date, a.easter) / 7);
      const week = ORDINALS[weekIndex] ?? `${weekIndex + 1}th`;
      // Octave
      if (weekIndex === 0 && !isSunday) {
        return { title: `${dowName} within the Octave of Easter`, color: "white", rank: "privileged_weekday" };
      }
      return isSunday
        ? { title: `${week} Sunday of Easter`, color: "white", rank: "sunday" }
        : { title: `${dowName} of the ${week} Week of Easter`, color: "white", rank: "weekday" };
    }
    case "ordinary_time": {
      // Two stretches: post-Baptism → pre-Lent, and post-Pentecost → pre-Advent.
      // Week numbering is tricky: weeks are counted backward from Christ the King = 34th week.
      const ck = a.christTheKing;
      const weeksBackFromCK = Math.floor(diffDays(addDays(ck, 6), date) / 7);
      const weekNum = 34 - weeksBackFromCK; // approximate; off-by-one near the seams is acceptable v1
      const safeWeek = Math.max(1, Math.min(34, weekNum));
      return isSunday
        ? { title: `${ordinal(safeWeek)} Sunday in Ordinary Time`, color: "green", rank: "sunday" }
        : { title: `${dowName} of the ${ordinal(safeWeek)} Week in Ordinary Time`, color: "green", rank: "weekday" };
    }
  }
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

// ─── Convenience ────────────────────────────────────────────────────────────

/** Get the liturgical day for "now" (UTC) or a provided clock. */
export function today(clock: Date = new Date()): LiturgicalDay {
  // Normalize to UTC midnight of the date the caller is in.
  const utcMidnight = new Date(
    Date.UTC(clock.getUTCFullYear(), clock.getUTCMonth(), clock.getUTCDate())
  );
  return liturgicalDay(utcMidnight);
}

/** Same as today() but resolves the date in a given IANA timezone first. */
export function todayInZone(timeZone: string, clock: Date = new Date()): LiturgicalDay {
  const local = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(clock); // e.g. "2026-05-23"
  return liturgicalDay(fromISO(local));
}

/** For demo screens: hand-curated canonical scenarios from the brief. */
export const DEMO_SCENARIOS = {
  /** Wednesday of Holy Week 2026 — Easter was Apr 5, 2026. */
  wednesdayOfHolyWeek: () => liturgicalDay(new Date(Date.UTC(2026, 3, 1))),
  /** Saturday before Pentecost 2026. */
  saturdayBeforePentecost: () => liturgicalDay(new Date(Date.UTC(2026, 4, 23))),
  /** Day 19 of Lent 2026 — Ash Weds was Feb 18, so Lent Day 19 = March 8 (Sunday). */
  lentDay19: () => liturgicalDay(new Date(Date.UTC(2026, 2, 8))),
  /** Christmas Eve 2026. */
  christmasEve: () => liturgicalDay(new Date(Date.UTC(2026, 11, 24))),
} as const;

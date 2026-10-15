// Computus — date of Easter Sunday for any Gregorian year.
// Anonymous Gregorian algorithm (Meeus–Jones–Butcher), valid for all Gregorian years.

/** Returns Easter Sunday for the given Gregorian year as a UTC midnight Date. */
export function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Add `days` to a Date and return a fresh Date (UTC-safe). */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

/** Day-of-week 0..6, Sunday = 0, in UTC (which is what we compute everything in). */
export function dayOfWeek(d: Date): number {
  return d.getUTCDay();
}

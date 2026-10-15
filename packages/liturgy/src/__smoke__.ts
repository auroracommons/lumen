// Quick smoke test — run with: node --experimental-strip-types packages/liturgy/src/__smoke__.ts
// Not a real test suite; replaces vitest until @lumen/liturgy gets one in Pass 4+.

import { easter } from "./computus.ts";
import { DEMO_SCENARIOS, todayInZone, liturgicalDay } from "./calendar.ts";

function expect(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) console.log(`   expected: ${JSON.stringify(expected)}\n   actual:   ${JSON.stringify(actual)}`);
  if (!ok) process.exitCode = 1;
}

// Easter dates (verified against USCCB)
expect("Easter 2024 = March 31", easter(2024).toISOString().slice(0, 10), "2024-03-31");
expect("Easter 2025 = April 20", easter(2025).toISOString().slice(0, 10), "2025-04-20");
expect("Easter 2026 = April 5", easter(2026).toISOString().slice(0, 10), "2026-04-05");
expect("Easter 2027 = March 28", easter(2027).toISOString().slice(0, 10), "2027-03-28");

// Today (May 23, 2026 = Saturday of the 7th Week of Easter; Pentecost is the next day)
const may23 = liturgicalDay(new Date(Date.UTC(2026, 4, 23)));
expect("May 23 2026 season is easter", may23.season, "easter");
expect("May 23 2026 color is white", may23.color, "white");
expect("May 23 2026 cycle is A/II", may23.cycle, { sunday: "A", weekday: "II" });
console.log(`  title: ${may23.title}`);

// Wednesday of Holy Week 2026 = April 1
const woh = DEMO_SCENARIOS.wednesdayOfHolyWeek();
expect("Holy Wed 2026 title", woh.title, "Wednesday of Holy Week");
expect("Holy Wed 2026 season", woh.season, "lent");
expect("Holy Wed 2026 color", woh.color, "violet");

// Pentecost 2026 = May 24
const pent = liturgicalDay(new Date(Date.UTC(2026, 4, 24)));
expect("Pentecost 2026 title", pent.title, "Pentecost Sunday");
expect("Pentecost 2026 color", pent.color, "red");

// Trinity 2026 = May 31
const trinity = liturgicalDay(new Date(Date.UTC(2026, 4, 31)));
expect("Trinity 2026 title", trinity.title, "Solemnity of the Most Holy Trinity");

// Christmas 2026
const xmas = liturgicalDay(new Date(Date.UTC(2026, 11, 25)));
expect("Christmas 2026 title", xmas.title, "Nativity of the Lord (Christmas)");
expect("Christmas 2026 rank", xmas.rank, "solemnity");

// today() in America/New_York
const nowNYC = todayInZone("America/New_York");
console.log(`\nNow (NYC): ${nowNYC.date} — ${nowNYC.title} (${nowNYC.color}, cycle ${nowNYC.cycle.sunday}/${nowNYC.cycle.weekday})`);

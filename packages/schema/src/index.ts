// @lumen/schema — single source of truth for cross-app data shapes.
//
// Every entity here maps to docs/ARCHITECTURE.md. Add a new shape here BEFORE adding it
// to any app — that way the contract is explicit and the apps stay in sync.

import { z } from "zod";

// ─── Identifiers ────────────────────────────────────────────────────────────

export const PersonId = z.string().brand<"PersonId">();
export const ParishId = z.string().brand<"ParishId">();
export const DioceseId = z.string().brand<"DioceseId">();
export const NeedId = z.string().brand<"NeedId">();
export const GiftId = z.string().brand<"GiftId">();

export type PersonId = z.infer<typeof PersonId>;
export type ParishId = z.infer<typeof ParishId>;
export type DioceseId = z.infer<typeof DioceseId>;
export type NeedId = z.infer<typeof NeedId>;
export type GiftId = z.infer<typeof GiftId>;

// ─── Locale ─────────────────────────────────────────────────────────────────

export const Locale = z.enum([
  "en",
  "es",
  "la", // Latin liturgical
  "pt",
  "fr",
  "tl", // Tagalog
  "ig", // Igbo
  "sw", // Swahili
  "vi",
  "ar",
  "zh",
  "pl",
]);
export type Locale = z.infer<typeof Locale>;

// ─── Liturgical ─────────────────────────────────────────────────────────────

export const LiturgicalSeason = z.enum([
  "advent",
  "christmas",
  "ordinary_time",
  "lent",
  "triduum",
  "easter",
]);
export type LiturgicalSeason = z.infer<typeof LiturgicalSeason>;

export const LiturgicalColor = z.enum(["green", "violet", "white", "red", "rose", "black", "gold"]);
export type LiturgicalColor = z.infer<typeof LiturgicalColor>;

/** Roman Rite rank, simplified. Universal Norms for the Liturgical Year §10–15. */
export const LiturgicalRank = z.enum([
  "solemnity",
  "feast_of_the_lord",
  "feast",
  "memorial",
  "optional_memorial",
  "weekday",
  "sunday",
  "privileged_weekday", // Holy Week, Easter Octave, etc.
]);
export type LiturgicalRank = z.infer<typeof LiturgicalRank>;

export const LiturgicalDay = z.object({
  /** ISO date in the day's local civil calendar — not a Date object; LiturgicalDay is timezone-naive. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  season: LiturgicalSeason,
  color: LiturgicalColor,
  rank: LiturgicalRank,
  /** Human-readable English title — e.g., "Wednesday of Holy Week", "Solemnity of the Most Holy Trinity". */
  title: z.string(),
  /** Optional title for the proper of saints when overriding (e.g., "Memorial of Saint Rita"). */
  saintTitle: z.string().optional(),
  /** Lectionary cycle letter for Sunday + weekday (A/B/C, I/II). */
  cycle: z.object({ sunday: z.enum(["A", "B", "C"]), weekday: z.enum(["I", "II"]) }),
});
export type LiturgicalDay = z.infer<typeof LiturgicalDay>;

// ─── Citation ───────────────────────────────────────────────────────────────

/** Every AI output must carry at least one Citation. Runtime-enforced in @lumen/catechism-rag. */
export const Citation = z.object({
  /** Source class — what kind of authority. */
  kind: z.enum([
    "scripture",
    "catechism", // CCC
    "vatican_ii",
    "encyclical",
    "apostolic_exhortation",
    "magisterium_other",
    "doctor", // Doctors of the Church
    "saint", // saints' writings (non-Doctor)
    "code_of_canon_law",
    "liturgical_text",
  ]),
  /** Human-readable reference — e.g., "CCC 1422", "Lumen Gentium §13", "Mt 5:3–10". */
  reference: z.string(),
  /** Optional URL to a resolvable canonical source (vatican.va, USCCB, etc.). */
  url: z.string().url().optional(),
  /** Optional quoted text supporting the claim. Short. */
  quote: z.string().optional(),
});
export type Citation = z.infer<typeof Citation>;

// ─── Person / Parish / Diocese ──────────────────────────────────────────────

export const Parish = z.object({
  id: ParishId,
  dioceseId: DioceseId,
  name: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string().length(2),
  }),
  coords: z.object({ lat: z.number(), lng: z.number() }),
  languages: z.array(Locale),
  /** Mass times — array of weekly recurring entries. */
  massSchedule: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday
      time: z.string().regex(/^\d{2}:\d{2}$/), // 24h local
      locale: Locale,
      rite: z.enum(["novus_ordo", "extraordinary_form", "eastern"]).default("novus_ordo"),
      notes: z.string().optional(),
    })
  ),
  confessionSchedule: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
  accessibility: z.object({
    wheelchair: z.boolean().default(false),
    hearingLoop: z.boolean().default(false),
    asl: z.boolean().default(false),
  }),
});
export type Parish = z.infer<typeof Parish>;

export const Diocese = z.object({
  id: DioceseId,
  name: z.string(),
  country: z.string().length(2),
  bishop: z.string().optional(),
});
export type Diocese = z.infer<typeof Diocese>;

// ─── Charity ────────────────────────────────────────────────────────────────

export const Need = z.object({
  id: NeedId,
  parishId: ParishId.optional(),
  dioceseId: DioceseId.optional(),
  /** Title — short, human, no jargon. "Rent for the Morales family", not "Q2 housing assistance". */
  title: z.string(),
  description: z.string(),
  category: z.enum(["food", "rent", "utilities", "medical", "immigration", "education", "disaster", "other"]),
  amountUsdCents: z.number().int().nonnegative(),
  raisedUsdCents: z.number().int().nonnegative().default(0),
  status: z.enum(["surfaced", "funded", "in_progress", "completed", "audited"]),
  surfacedAt: z.string().datetime(),
});
export type Need = z.infer<typeof Need>;

export const Gift = z.object({
  id: GiftId,
  personId: PersonId,
  needId: NeedId.optional(),
  amountUsdCents: z.number().int().positive(),
  recurring: z.boolean().default(false),
  givenAt: z.string().datetime(),
});
export type Gift = z.infer<typeof Gift>;

// ─── Encounter (engagement signal for the Now screen) ───────────────────────

export const Encounter = z.object({
  personId: PersonId,
  kind: z.enum(["mass", "confession", "group", "homily", "reading", "rosary"]),
  parishId: ParishId.optional(),
  at: z.string().datetime(),
});
export type Encounter = z.infer<typeof Encounter>;

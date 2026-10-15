// Types intentionally duplicated from @lumen/schema to keep @lumen/liturgy zero-dependency
// (so it can be tree-shaken into edge runtimes, used in workers, etc.). The shapes match.

export type LiturgicalSeason =
  | "advent"
  | "christmas"
  | "ordinary_time"
  | "lent"
  | "triduum"
  | "easter";

export type LiturgicalColor = "green" | "violet" | "white" | "red" | "rose" | "black" | "gold";

export type LiturgicalRank =
  | "solemnity"
  | "feast_of_the_lord"
  | "feast"
  | "memorial"
  | "optional_memorial"
  | "weekday"
  | "sunday"
  | "privileged_weekday";

export type SundayCycle = "A" | "B" | "C";
export type WeekdayCycle = "I" | "II";

export type LiturgicalDay = {
  /** ISO-8601 date string, civil calendar. Engine is timezone-naive — caller passes the local date. */
  date: string;
  season: LiturgicalSeason;
  color: LiturgicalColor;
  rank: LiturgicalRank;
  title: string;
  saintTitle?: string;
  cycle: { sunday: SundayCycle; weekday: WeekdayCycle };
};

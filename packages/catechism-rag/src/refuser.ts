// Runtime check that hard-rejects sacrament-substitution-shaped output BEFORE it renders.
// See docs/AI_GUARDRAILS.md enforcement rule #2.

const ABSOLUTION_PATTERNS = [
  /\bI\s+absolve\s+you\b/i,
  /\bego\s+te\s+absolvo\b/i,
  /\byou\s+are\s+(now\s+)?absolved\b/i,
  /\byour\s+sins\s+are\s+forgiven\b/i,
];

const CONSECRATION_PATTERNS = [
  /\bthis\s+is\s+my\s+body\b/i,
  /\bthis\s+is\s+my\s+blood\b/i,
  /\bhoc\s+est\s+(enim\s+)?corpus\s+meum\b/i,
];

const ORDINATION_VOW_PATTERNS = [
  /\bI\s+ordain\s+you\b/i,
  /\bI\s+now\s+pronounce\s+you\b/i,
];

const NAMED_IMITATION_PATTERNS = [
  /\bas\s+(pope|saint|st\.)\s+\w+\s+(would|might)\s+say\b/i,
  /\bspeaking\s+as\s+(pope|saint)\s+\w+\b/i,
];

export type RefusalReason = "sacrament_substitution" | "named_imitation" | null;

export function sacramentSubstitutionRefuser(text: string): RefusalReason {
  for (const p of [...ABSOLUTION_PATTERNS, ...CONSECRATION_PATTERNS, ...ORDINATION_VOW_PATTERNS]) {
    if (p.test(text)) return "sacrament_substitution";
  }
  for (const p of NAMED_IMITATION_PATTERNS) {
    if (p.test(text)) return "named_imitation";
  }
  return null;
}

// @lumen/catechism-rag — doctrinal RAG over CCC, Vatican II, encyclicals, magisterial corpus, Doctors of the Church.
//
// This package is the single chokepoint for ALL AI calls in LUMEN. See docs/AI_GUARDRAILS.md.
// Three guarantees enforced here, not in app code:
//   1. Every response carries Citation[].
//   2. Every response passes through the sacrament-substitution refuser.
//   3. No imitation of named living or historical figures.

import type { Citation } from "@lumen/schema";

export type AiInvocation = {
  prompt: string;
  /** Liturgical / pastoral context — informs retrieval, never injected as instruction. */
  context?: {
    liturgicalDay?: string;
    locale?: string;
    surface: "now" | "pray" | "learn" | "serve" | "threshold" | "homily" | "pastoral";
  };
};

export type AiResponse = {
  text: string;
  citations: Citation[];
  /** Set when the refuser blocked output. The text will be a graceful redirect, not an apology. */
  refusedReason?: "sacrament_substitution" | "named_imitation" | "crisis_routing";
};

/**
 * Single entry point for AI in LUMEN. App code never imports the Anthropic SDK directly.
 *
 * Phase 1 implementation is a stub that returns shaped responses with placeholder citations.
 * Real implementation wires Anthropic Claude (primary) with the doctrinal corpus.
 */
export async function invoke(_call: AiInvocation): Promise<AiResponse> {
  return {
    text: "[catechism-rag stub: real implementation pending Phase 1 corpus ingestion]",
    citations: [],
  };
}

export { sacramentSubstitutionRefuser } from "./refuser";

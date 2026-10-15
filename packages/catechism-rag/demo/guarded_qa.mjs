#!/usr/bin/env node
/**
 * Guarded catechism Q&A demo for @lumen/catechism-rag.
 *
 * This wires the package's actual guardrail (src/refuser.ts) into a
 * small, runnable retrieval demo over a public domain corpus
 * (Baltimore Catechism No. 2, selected lessons; see corpus.json).
 *
 * How a question flows, mirroring docs/AI_GUARDRAILS.md:
 *
 *   1. Request screen (layer two). Prompts that ask the system to
 *      perform a sacrament or imitate a named figure are refused with
 *      a graceful redirect before any retrieval happens.
 *   2. Retrieval. Keyword overlap against the corpus questions and
 *      answers. Below the score threshold the demo says the corpus
 *      does not cover the question instead of inventing an answer.
 *   3. Answer. The answer is the corpus passage, verbatim, with its
 *      citation. This demo is extractive on purpose: with no LLM API
 *      key in this environment there is no honest way to generate
 *      prose, and verbatim quotation is grounded by construction.
 *      The production design retrieves the same passages for a model;
 *      the guard layers are identical either way.
 *   4. Output refuser (layer one, the runtime check). Every candidate
 *      answer passes through sacramentSubstitutionRefuser before it
 *      is returned. Verbatim catechism text should never trip it; the
 *      check runs anyway, and if it ever fired the answer would be
 *      replaced by the redirect.
 *
 * Usage:
 *   node guarded_qa.mjs "Why did God make you?"
 *   node guarded_qa.mjs --eval        # run eval_cases.json, write eval_results.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sacramentSubstitutionRefuser } from "../src/refuser.ts";

const here = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(join(here, "corpus.json"), "utf-8"));

export const REDIRECT =
  "That is something only a priest can do, in person, in the sacrament. " +
  "I cannot do it, and I will not imitate it. I can show you what the Church teaches about it instead.";

const IMITATION_REDIRECT =
  "I do not speak in the voice of the Pope or the saints. I can show you " +
  "what the Church teaches, in the Church's own catechism text, with the source named.";

// ── Layer two: request screen ────────────────────────────────────────

const REQUEST_RULES = [
  { reason: "sacrament_substitution", pattern: /\babsolve\s+me\b/i },
  { reason: "sacrament_substitution", pattern: /\bforgive\s+my\s+sins\b/i },
  { reason: "sacrament_substitution", pattern: /words\s+of\s+(absolution|consecration)/i },
  { reason: "sacrament_substitution", pattern: /\bconsecrate\b/i },
  { reason: "sacrament_substitution", pattern: /\bordain\s+me\b/i },
  { reason: "sacrament_substitution", pattern: /\bsay\b[^.?!]{0,40}["']?\s*i\s+absolve/i },
  { reason: "sacrament_substitution", pattern: /\bpretend\s+(you\s+are|to\s+be)\s+a\s+priest\b/i },
  { reason: "named_imitation", pattern: /\bas\s+(pope|saint|st\.)\s+\w+\s+would\s+say\b/i },
  { reason: "named_imitation", pattern: /\banswer\s+as\s+(pope|saint|st\.)\s/i },
  { reason: "named_imitation", pattern: /\bspeaking\s+as\s+(pope|saint)\b/i },
];

export function screenRequest(prompt) {
  for (const rule of REQUEST_RULES) {
    if (rule.pattern.test(prompt)) return rule.reason;
  }
  return null;
}

// ── Retrieval ────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "what", "is", "the", "a", "an", "of", "to", "in", "on", "for", "and",
  "or", "do", "does", "did", "how", "why", "who", "when", "where",
  "are", "was", "were", "be", "been", "it", "its", "this", "that",
  "you", "your", "me", "my", "we", "our", "can", "could", "should",
  "would", "tell", "please", "about", "many",
]);

function terms(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map((w) => (w.endsWith("s") ? w.slice(0, -1) : w));
}

const ANSWER_THRESHOLD = 3;

function retrieve(query) {
  const q = new Set(terms(query));
  let best = null;
  for (const passage of corpus.passages) {
    const inQuestion = new Set(terms(passage.question));
    const inAnswer = new Set(terms(passage.answer));
    let score = 0;
    for (const term of q) {
      if (inQuestion.has(term)) score += 2;
      if (inAnswer.has(term)) score += 1;
    }
    if (!best || score > best.score) best = { passage, score };
  }
  return best;
}

// ── The guarded pipeline ─────────────────────────────────────────────

export function ask(prompt) {
  const screenReason = screenRequest(prompt);
  if (screenReason) {
    return {
      prompt,
      status: "refused",
      refusedReason: screenReason,
      text: screenReason === "named_imitation" ? IMITATION_REDIRECT : REDIRECT,
      citations: [],
    };
  }

  const { passage, score } = retrieve(prompt);
  if (score < ANSWER_THRESHOLD) {
    return {
      prompt,
      status: "no_coverage",
      text:
        "This demo's corpus (selected lessons of the Baltimore Catechism) " +
        "does not cover that question, so I will not guess at an answer.",
      citations: [],
      retrieval_score: score,
    };
  }

  const candidate = passage.answer;
  const refusal = sacramentSubstitutionRefuser(candidate);
  if (refusal) {
    return {
      prompt,
      status: "refused",
      refusedReason: refusal,
      text: REDIRECT,
      citations: [],
      retrieval_score: score,
    };
  }

  return {
    prompt,
    status: "answered",
    text: candidate,
    citations: [
      {
        id: passage.id,
        lesson: passage.lesson,
        question: passage.question,
        source: passage.source,
      },
    ],
    retrieval_score: score,
  };
}

// ── Evaluation ───────────────────────────────────────────────────────

function runEval() {
  const cases = JSON.parse(readFileSync(join(here, "eval_cases.json"), "utf-8"));
  const results = { generated_by: "node guarded_qa.mjs --eval" };

  // Output refuser, block cases: expect refusal with the named reason.
  let blocked = 0;
  const blockDetail = cases.output_block.map((c) => {
    const got = sacramentSubstitutionRefuser(c.text);
    const pass = got === c.expect_reason;
    if (pass) blocked += 1;
    return { ...c, got, pass };
  });
  results.output_block = {
    total: cases.output_block.length,
    passed: blocked,
    cases: blockDetail,
  };

  // Output refuser, allow cases: expect no refusal.
  let allowed = 0;
  const allowDetail = cases.output_allow.map((c) => {
    const got = sacramentSubstitutionRefuser(c.text);
    const pass = got === null;
    if (pass) allowed += 1;
    return { ...c, got, pass };
  });
  results.output_allow = {
    total: cases.output_allow.length,
    passed: allowed,
    cases: allowDetail,
  };

  // Borderline cases: reported, not scored. These quote or describe
  // the guarded forms; the suite records what the refuser does so the
  // tradeoff stays visible.
  results.borderline = cases.borderline.map((c) => ({
    ...c,
    got: sacramentSubstitutionRefuser(c.text),
  }));

  // Full pipeline on prompts.
  const promptDetail = cases.prompts.map((c) => {
    const r = ask(c.prompt);
    const pass = r.status === c.expect_status &&
      (c.expect_status !== "refused" || r.refusedReason === c.expect_reason);
    return { ...c, got_status: r.status, got_reason: r.refusedReason ?? null, pass };
  });
  results.prompts = {
    total: cases.prompts.length,
    passed: promptDetail.filter((c) => c.pass).length,
    cases: promptDetail,
  };

  writeFileSync(join(here, "eval_results.json"), JSON.stringify(results, null, 2));
  console.log(`output_block : ${results.output_block.passed}/${results.output_block.total} refused with the expected reason`);
  console.log(`output_allow : ${results.output_allow.passed}/${results.output_allow.total} allowed through`);
  console.log(`borderline   : ${results.borderline.map((c) => `${c.name}=${c.got ?? "allowed"}`).join(", ")}`);
  console.log(`prompts      : ${results.prompts.passed}/${results.prompts.total} behaved as expected`);
  console.log("wrote eval_results.json");
}

// ── CLI ──────────────────────────────────────────────────────────────

if (process.argv[2] === "--eval") {
  runEval();
} else if (process.argv[2]) {
  console.log(JSON.stringify(ask(process.argv.slice(2).join(" ")), null, 2));
} else {
  console.error('Usage: node guarded_qa.mjs "your question"   or   node guarded_qa.mjs --eval');
  process.exit(1);
}

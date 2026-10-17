#!/usr/bin/env node
/**
 * Guarded Proverbs Q&A exhibit for Lumen.
 *
 * This is the second exhibit. It stands on its own: its corpus is
 * the Book of Proverbs in the World English Bible (see
 * corpus.json for the source edition), and it answers only from
 * that book. Its text is not merged with any other exhibit's text.
 *
 * It runs the same guard architecture as the first exhibit:
 *
 *   1. Request screen. Prompts that ask the system to perform a
 *      sacrament or imitate a named figure are refused with a
 *      plain refusal before any retrieval happens. The screen
 *      carries the shared rules and adds this exhibit's own named
 *      figure: a request to answer as Solomon is refused the same
 *      way a request to answer as a pope or a saint is refused.
 *   2. Retrieval. Keyword overlap against the corpus questions
 *      and answers. Below the score threshold the exhibit says
 *      its corpus does not cover the question instead of
 *      inventing an answer.
 *   3. Answer. The answer is the corpus passage, verbatim, with
 *      its citation. This exhibit is extractive on purpose, for
 *      the same reason the first exhibit is: verbatim quotation
 *      is grounded by construction.
 *   4. Output refuser. Every candidate answer passes through
 *      sacramentSubstitutionRefuser before it is returned. The
 *      refuser is imported from the shared guard code at
 *      packages/catechism-rag/src/refuser.ts and is executed
 *      here unchanged, not reimplemented.
 *
 * Usage:
 *   node guarded_qa.mjs "What is the beginning of knowledge?"
 *   node guarded_qa.mjs --eval        # run eval_cases.json, write eval_results.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sacramentSubstitutionRefuser } from "../../packages/catechism-rag/src/refuser.ts";

const here = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(join(here, "corpus.json"), "utf-8"));

export const REFUSAL =
  "I cannot do that, and I will not imitate it. This exhibit answers only from " +
  "the Book of Proverbs in the World English Bible, with the passage named. " +
  "Ask a question that book covers and I will show you its own words.";

export const IMITATION_REFUSAL =
  "I do not speak in the voice of Solomon or of any named figure. I can show you " +
  "what the Book of Proverbs says, in its own text, with the passage named.";

// Layer two: request screen. The shared rules are adopted by reference
// from the guardrail policy package (packages/guardrail-policy/policy.json,
// adopted October 17, 2026): they are loaded and compiled from that file
// at startup, not copied here, so a policy change cannot leave this
// exhibit screening with yesterday's rules. Only this exhibit's own
// named figure rules, for Solomon, are kept locally, appended after the
// shared rules in the package's source order.
const policy = JSON.parse(
  readFileSync(join(here, "..", "..", "packages", "guardrail-policy", "policy.json"), "utf-8"));

function compilePattern(serialized) {
  const lastSlash = serialized.lastIndexOf("/");
  const body = serialized.slice(1, lastSlash);
  const flags = serialized.slice(lastSlash + 1);
  return new RegExp(body, flags);
}

const SHARED_REQUEST_RULES = policy.request_screen.rules.map((rule) => ({
  reason: rule.reason,
  pattern: compilePattern(rule.pattern),
}));

const REQUEST_RULES = [
  ...SHARED_REQUEST_RULES,
  { reason: "named_imitation", pattern: /\bas\s+(king\s+)?solomon\s+would\s+say\b/i },
  { reason: "named_imitation", pattern: /\banswer\s+as\s+(king\s+)?solomon\b/i },
  { reason: "named_imitation", pattern: /\bspeaking\s+as\s+(king\s+)?solomon\b/i },
];

export function screenRequest(prompt) {
  for (const rule of REQUEST_RULES) {
    if (rule.pattern.test(prompt)) return rule.reason;
  }
  return null;
}

// Retrieval. Same scoring and threshold as the first exhibit.

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

// The guarded pipeline.

export function ask(prompt) {
  const screenReason = screenRequest(prompt);
  if (screenReason) {
    return {
      prompt,
      status: "refused",
      refusedReason: screenReason,
      text: screenReason === "named_imitation" ? IMITATION_REFUSAL : REFUSAL,
      citations: [],
    };
  }

  const { passage, score } = retrieve(prompt);
  if (score < ANSWER_THRESHOLD) {
    return {
      prompt,
      status: "no_coverage",
      text:
        "This exhibit's corpus (selected sayings from the Book of Proverbs " +
        "in the World English Bible) does not cover that question, so I will " +
        "not guess at an answer.",
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
      text: REFUSAL,
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
        reference: passage.reference,
        question: passage.question,
        source: passage.source,
      },
    ],
    retrieval_score: score,
  };
}

// Evaluation, in the same format as the first exhibit's eval.

function runEval() {
  const cases = JSON.parse(readFileSync(join(here, "eval_cases.json"), "utf-8"));
  const results = { generated_by: "node guarded_qa.mjs --eval (exhibits/proverbs)" };

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

  results.borderline = cases.borderline.map((c) => ({
    ...c,
    got: sacramentSubstitutionRefuser(c.text),
  }));

  const promptDetail = cases.prompts.map((c) => {
    const r = ask(c.prompt);
    const pass = r.status === c.expect_status &&
      (c.expect_status !== "refused" || r.refusedReason === c.expect_reason) &&
      (c.expect_status !== "answered" || r.citations[0]?.reference === c.expect_reference);
    return {
      ...c,
      got_status: r.status,
      got_reason: r.refusedReason ?? null,
      got_reference: r.citations[0]?.reference ?? null,
      pass,
    };
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

// CLI.

if (process.argv[2] === "--eval") {
  runEval();
} else if (process.argv[2]) {
  console.log(JSON.stringify(ask(process.argv.slice(2).join(" ")), null, 2));
} else {
  console.error('Usage: node guarded_qa.mjs "your question"   or   node guarded_qa.mjs --eval');
  process.exit(1);
}

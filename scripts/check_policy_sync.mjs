#!/usr/bin/env node
/**
 * Guardrail policy sync check.
 *
 * Verifies packages/guardrail-policy/policy.json against the real
 * code: every reason code, output pattern, request screen pattern,
 * and corpus exclusion named in policy.json must appear verbatim
 * in the source files it claims as its source of truth.
 *
 * Usage: node scripts/check_policy_sync.mjs
 * Exits 0 when in sync; exits 1 naming every mismatch otherwise.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf-8");

const policyPath = "packages/guardrail-policy/policy.json";
const policy = JSON.parse(read(policyPath));
const refuserSrc = read("packages/catechism-rag/src/refuser.ts");
const demoSrc = read("packages/catechism-rag/demo/guarded_qa.mjs");
const corpus = JSON.parse(read("packages/catechism-rag/demo/corpus.json"));

const failures = [];
let checked = 0;
function requireIn(label, needle, haystack, haystackName) {
  checked += 1;
  if (!haystack.includes(needle)) {
    failures.push(`${label}: ${needle} not found verbatim in ${haystackName}`);
  }
}

// Reason codes: must appear as quoted literals in both layers.
for (const code of policy.refusal_reasons ?? []) {
  requireIn("refusal_reasons (refuser)", `"${code}"`, refuserSrc, "packages/catechism-rag/src/refuser.ts");
  requireIn("refusal_reasons (request screen)", `"${code}"`, demoSrc, "packages/catechism-rag/demo/guarded_qa.mjs");
}

// Output refuser categories: source constant, reason code, patterns.
for (const cat of policy.refusal_categories ?? []) {
  requireIn(`category ${cat.id} source_constant`, cat.source_constant, refuserSrc, "refuser.ts");
  requireIn(`category ${cat.id} reason_code`, `"${cat.reason_code}"`, refuserSrc, "refuser.ts");
  for (const pattern of cat.patterns ?? []) {
    requireIn(`category ${cat.id} pattern`, pattern, refuserSrc, "refuser.ts");
  }
}

// Request screen rules: pattern and reason, in the demo.
for (const rule of policy.request_screen?.rules ?? []) {
  requireIn("request_screen pattern", rule.pattern, demoSrc, "guarded_qa.mjs");
  requireIn("request_screen reason", `"${rule.reason}"`, demoSrc, "guarded_qa.mjs");
}

// Corpus exclusion rule: ids and reasons recorded in corpus.json.
const excludedById = new Map((corpus.excluded ?? []).map((e) => [e.id, e.reason]));
for (const ex of policy.corpus_exclusion_rule?.excluded ?? []) {
  checked += 1;
  if (!excludedById.has(ex.id)) {
    failures.push(`corpus exclusion: ${ex.id} not present in corpus.json excluded list`);
  } else if (excludedById.get(ex.id) !== ex.reason) {
    failures.push(
      `corpus exclusion ${ex.id}: reason in policy.json does not match corpus.json (${JSON.stringify(excludedById.get(ex.id))})`,
    );
  }
}

// Tradeoff must be stated (presence is checkable; wording is human-reviewed).
checked += 1;
if (!policy.tradeoff || !/verbatim/i.test(policy.tradeoff) || !/blocked/i.test(policy.tradeoff)) {
  failures.push("tradeoff: policy.json must state that verbatim quotation of guarded formulas in teaching text is blocked");
}

// Eval cases reference must point at a real file with the scored groups.
checked += 1;
try {
  const evalCases = JSON.parse(read(policy.eval_cases.path));
  for (const key of ["output_block", "output_allow", "prompts"]) {
    if (!Array.isArray(evalCases[key])) failures.push(`eval_cases: referenced file has no ${key} array`);
  }
} catch (err) {
  failures.push(`eval_cases: cannot read referenced file ${policy.eval_cases.path}: ${err.message}`);
}

if (failures.length > 0) {
  console.error(`policy sync check FAILED (${failures.length} mismatch(es), ${checked} checks):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`policy sync check: OK (${checked} checks, policy v${policy.version} matches refuser.ts, guarded_qa.mjs, and corpus.json)`);

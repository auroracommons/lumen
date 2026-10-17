# Lumen guardrail policy package

Machine-readable policy extracted from the guardrail code that
actually runs in this repo. Published in-repo only, under
`packages/guardrail-policy/`. No npm publication or other external
registry publication is claimed.

## What the policy is

Two enforcement layers, both in code, not only on a policy page:

1. **Request screen** (layer two): prompts that ask the system to
   perform a sacrament or imitate a named figure are refused with a
   graceful redirect before any retrieval happens. Source:
   `REQUEST_RULES` in `packages/catechism-rag/demo/guarded_qa.mjs`.
2. **Output refuser** (layer one, the runtime check): every
   candidate answer passes through `sacramentSubstitutionRefuser`
   in `packages/catechism-rag/src/refuser.ts` before it renders.
   A match hard-rejects the answer.

The only reason codes are the ones the code returns, exactly as
named there:

- `sacrament_substitution` — absolution-shaped, consecration-shaped,
  and ordination/vow-shaped output.
- `named_imitation` — generation in the voice of a named figure.
  Quotation and attributed summary are allowed; generation in voice
  is not.

`policy.json` in this folder lists, in machine-readable form:

- the package version (`1.0.0`),
- the refusal categories with their reason codes, source constants,
  and every output pattern, verbatim from `refuser.ts`,
- the request screen pattern list, in source order, verbatim from
  the catechism demo,
- the corpus exclusion rule for Baltimore Catechism questions 241
  and 242, with the reasons recorded in `corpus.json`,
- the stated tradeoff below.

## The stated tradeoff

Verbatim quotation of guarded formulas in teaching text is blocked.
The refuser rejects the shape regardless of intent, so teaching
texts that quote the guarded formulas are refused. That tradeoff is
recorded as borderline cases (reported, not scored) in the eval,
and it is why corpus questions 241 and 242 are excluded.

## Eval cases

Eval cases are **referenced, not duplicated**. Use:

- `packages/catechism-rag/demo/eval_cases.json`

Provenance: that is the published case set the demos run. This
package does not carry a second copy that could drift from it.

Published baseline counts (each exhibit measured within itself):

| Exhibit | Refused | Allowed | Prompts |
| --- | --- | --- | --- |
| Baltimore Catechism No. 2 | 12 of 12 | 8 of 8 | 13 of 13 |
| Book of Proverbs (WEB) | 12 of 12 | 8 of 8 | 10 of 10 |
| Tao Te Ching (Legge) | 12 of 12 | 8 of 8 | 10 of 10 |

## How another project adopts it

1. Copy this package (`packages/guardrail-policy/`) into your repo.
2. Keep the reason codes. Map your own non-negotiables onto
   `sacrament_substitution`-style and `named_imitation`-style
   categories, or add categories with your own codes — but do not
   rename these codes while claiming this policy, because eval
   results are compared by code.
3. Implement both layers: a request screen before retrieval or
   generation, and an output refuser that checks every candidate
   answer before it renders. A prompt instruction alone is not
   this policy.
4. Run the eval cases against your own answers: feed your
   `output_block` texts to your refuser and require the expected
   reason for each, feed `output_allow` texts and require no
   refusal, and run the prompts through your full pipeline.
   Report borderline cases; do not score them.
5. Run the sync check after any change (below). If your patterns
   and `policy.json` disagree, the check fails and the policy is
   not the code.

An adopting project sets the rules for its own texts. Each
community sets the rules for its own texts; this project does not
set them for others. The Proverbs and Tao exhibits in this repo
show the pattern: they keep the core rules and add exhibit-specific
named-imitation rules (Solomon, Laozi) in their own pipelines.
Since October 17, 2026 the Proverbs exhibit adopts the shared
request screen by reference: it loads and compiles the rules from
this package's `policy.json` at startup and keeps only its three
Solomon rules locally, so the shared screen cannot drift between
the package and that exhibit. Its refusal eval after the change is
unchanged (12 of 12 blocked, 8 of 8 allowed, 10 of 10 prompts, the
result file byte identical). The Tao exhibit still carries its own
copy; adopting by reference there is the next step of the same kind.

## Sync check

```sh
node scripts/check_policy_sync.mjs
```

The check reads `policy.json` and verifies, mechanically, that
every reason code, every output pattern, every request screen
pattern, and each corpus exclusion named there appears verbatim in
`packages/catechism-rag/src/refuser.ts`,
`packages/catechism-rag/demo/guarded_qa.mjs`, or
`packages/catechism-rag/demo/corpus.json` as appropriate. It exits
0 when all match and exits non-zero naming each mismatch when any
does not. It is also wired into CI (`.github/workflows/ci.yml`).

## Honesty limits

- This is an extractive demo study, not a deployed platform. The
  demos answer verbatim from small public-domain corpora, show the
  source, and say no when the corpus does not cover a question.
  There is no LLM generation in the verified surface.
- The policy covers only the categories in `policy.json`. It is
  not a general safety system, and passing this eval proves only
  these cases, on these texts.
- No external publication is claimed for this package. Adoption
  today means copying it from this repo.

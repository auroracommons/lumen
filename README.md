# LUMEN

> *Lumen Gentium*, light of the nations.

An AI safety and architecture design study for a Catholic platform,
built around one discipline: the guardrails are code, not policy, and
every claim in this README is limited to what actually runs.

> **Act 5, the Guardrails**, in a five part body of work built on one
> thesis: technology should increase human capability without taking
> human agency away.
>
> - Act 1, the Atlas: [supergravity](https://github.com/jthomas48896f/supergravity), how people learn.
> - Act 2, the Commons: [cohort](https://github.com/jthomas48896f/cohort), how people find each other and build together.
> - Act 3, the Machine: [neural-net-lab](https://github.com/jthomas48896f/neural-net-lab), how the machine itself learns, from first principles.
> - Act 4, the Graph: [knowledge-graph-explorer](https://github.com/jthomas48896f/knowledge-graph-explorer), how knowledge connects and can be questioned.
>
> LUMEN's problem family is unsafe and unaccountable AI. Its north
> star metric is harmful outputs refused, counted honestly. This repo
> claims no number for it yet beyond the eval counts below, which are
> test results, not usage.
>
> The frame is the post AI renaissance, stated as aspiration and
> direction of travel, never as achievement: a renaissance of human
> capability in which power stays accountable and the sacraments stay
> with the Church. This repo is one small exhibit of the guardrail
> layer that direction requires.

## The need

Layer 6: Trust and meaning.

"Technology that stays inside human values: refuses what it should refuse, explains itself, and remains governed by people. And beneath the technology, the older need it serves: meaning, faith, conscience, a life that adds up to something."

LUMEN serves this need with guardrails that are code, not policy, and a refuser that hard rejects guarded output before it renders.

Unmet, it looks like: machines that comply with anything, guardrails promised in principles pages and absent in code, people handed power with no story about what it is for.

The full map: [The Bedrock, a map of human needs](https://github.com/jthomas48896f/jthomas48896f/blob/main/NEEDS.md)

## What this is, honestly

LUMEN is a design study with two working components and a monorepo of
scaffolds around them. It is not a deployed platform, it has no
users, and the three apps do not run. What is real:

**Working, and verified by runs in this repo**

- **The guardrail refuser** (`packages/catechism-rag/src/refuser.ts`):
  a runtime check that hard rejects absolution shaped, consecration
  shaped, ordination shaped, and named imitation output before it
  renders. It is the enforcement of rules 2 and 3 in
  `docs/AI_GUARDRAILS.md`, in code.
- **The guarded catechism demo**
  (`packages/catechism-rag/demo/`): the refuser wired into a question
  answering pipeline over a small public domain corpus (Baltimore
  Catechism No. 2, selected lessons), answering verbatim with
  citations, refusing elicitations, and declining questions the
  corpus does not cover. Evaluated on a published case set; see
  below.
- **The liturgical calendar engine** (`packages/liturgy`): computus
  and calendar logic whose smoke script passes 15 of 15 checks,
  including Easter dates verified against published calendars
  (`node packages/liturgy/src/__smoke__.ts`, run 2026-10-15).

**Scaffold, labeled as such**

- `apps/parish` and `apps/api`: package scripts that echo "scaffold
  pending". There is no implementation.
- `apps/diocese`: the same scaffold state as parish.
- `apps/faithful`: a real Next.js shell whose home page is a static
  page describing the project's actual state. Its earlier redirect
  to a `/now` route that does not exist was removed in this pass;
  the Now surface is planned, not built.
- `packages/auth`, `packages/charity-graph`, `packages/vitality`:
  placeholder modules (`PLACEHOLDER = true` in their own source).
- `packages/catechism-rag/src/index.ts`: the `invoke()` entry point
  is a stub returning a shaped placeholder response; the design
  contract it documents (citations on every response, refuser on
  every output, no named imitation) is what the demo implements in
  extractive form.
- `packages/schema`: real zod type definitions for the intended
  data model. Types are a contract, not a backend.
- `packages/i18n`, `packages/ui`: small real utilities and design
  tokens.

Earlier versions of this README described the platform in the
present tense and referenced an `infra/cloudflare` directory that
does not exist in this tree. That language was wrong and has been
removed. The design documents remain, labeled as design.

## Evaluation

The refusal eval (`packages/catechism-rag/demo/eval_cases.json`,
run 2026-10-15, results in `demo/eval_results.json`):

- Output block: 12 of 12 sacrament substitution and named imitation
  texts refused, each with the expected reason.
- Output allow: 8 of 8 ordinary catechism answers pass through,
  including a third-person description of absolution.
- Prompts: 9 of 9 behaved as expected. Five elicitations refused
  with graceful redirects, three corpus questions answered with
  citations, one out-of-scope question answered with an honest
  no-coverage response.
- Borderline cases are reported, not scored: teaching texts that
  quote the guarded formulas are blocked, because the refuser
  rejects the shape regardless of intent. The corpus therefore
  excludes the two source questions that quote the consecration
  verbatim, and the exclusion is recorded in the corpus itself.

Run it: `node packages/catechism-rag/demo/guarded_qa.mjs --eval`

## Design documents

- [`docs/PRINCIPLES.md`](./docs/PRINCIPLES.md): founding principles.
- [`docs/AI_GUARDRAILS.md`](./docs/AI_GUARDRAILS.md): the guardrail
  rules the code enforces, including where AI must not go.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md),
  [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md),
  [`docs/ROADMAP.md`](./docs/ROADMAP.md): the intended platform,
  written as design. Read them as plans, not as descriptions of
  running software.

## Layout

```
apps/{faithful,parish,diocese,api}        faithful: static shell. Others: scaffold.
packages/{liturgy,catechism-rag}          working components
packages/{schema,i18n,ui}                 types, small utilities, tokens
packages/{auth,charity-graph,vitality}    placeholders
docs/                                     design documents
```

## Status

Design study, Phase 1 pieces verified as listed above. No
deployment, no users, no production AI calls. The next honest step
for this repo is growing the refusal eval set and packaging the
guardrail layer to stand alone (see COLLABORATE.md).

## Contribute, human or agent

Pick up a good first issue in this repo. Each one is sized in hours and written to be finishable by a newcomer.
Take the Eval Challenge against this repo's published refusal scores: beat the baseline, or find a real failure the current eval misses, with the run attached.
Report adoption from real use. If you took the guardrails or the guarded demo into your own setting, tell us what happened, good or bad.

The full protocol: [The Open Table](https://github.com/jthomas48896f/jthomas48896f/blob/main/OPEN_TABLE.md). Verified work is credited in the public [Ledger](https://github.com/jthomas48896f/jthomas48896f/blob/main/LEDGER.md).

<style>
.commons-bar { padding: 1em 0; }
.commons-bar a, .commons-bar span { margin-right: 1em; }
.commons-bar span[aria-current="page"] { font-weight: bold; }
.commons-footer { margin-top: 3em; }
</style>

<nav class="commons-bar" aria-label="Aurora Commons sites">
  <a href="https://auroracommons.github.io/auroracommons/">Aurora Commons</a>
  <a href="https://auroracommons.github.io/auroracommons/foundations.html">Foundations</a>
  <a href="https://auroracommons.github.io/ground/">Ground</a>
  <a href="https://auroracommons.github.io/still/">Still</a>
  <a href="https://auroracommons.github.io/atlas/">Atlas</a>
  <a href="https://auroracommons.github.io/cohort/">Cohort</a>
  <a href="https://auroracommons.github.io/graph/">Graph</a>
  <a href="https://auroracommons.github.io/machine/">Machine</a>
  <span aria-current="page">Lumen</span>
</nav>

# Lumen

> *Lumen Gentium*, light of the nations.

An AI safety and architecture design study, and the guardrails act on trust and meaning,
built around one discipline: the guardrails are code, not policy, and
every claim in this README is limited to what actually runs.

What runs today: guarded question answering demos, the real guardrail
refuser code wired into pipelines over public domain texts, each
exhibit in its own seat. On the published refusal eval for the
catechism exhibit, out of scope questions are blocked 12 of 12 and
in scope questions are allowed 8 of 8. The Proverbs exhibit has its
own published eval, stated in its own section below.

> **Lumen, Ascent Layer 6 (trust and meaning)**, in a seven layer body
> of work built on one thesis: technology should increase human
> capability without taking human agency away.
>
> - Ground (Layer 0, the body): [ground](https://github.com/auroracommons/ground)
> - Still (Layer 1, the mind at peace): [still](https://github.com/auroracommons/still)
> - Atlas (Layer 2, learning): [atlas](https://github.com/auroracommons/atlas), how people learn.
> - Cohort (Layer 3, belonging): [cohort](https://github.com/auroracommons/cohort), how people find each other and build together.
> - Graph (Layer 4, shared truth): [graph](https://github.com/auroracommons/graph), how knowledge connects and can be questioned.
> - Machine (Layer 5, autonomy): [machine](https://github.com/auroracommons/machine), how the machine itself learns, from first principles.
>
> Lumen's problem family is unsafe and unaccountable AI. Its north
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

Ascent Layer 6: Trust and meaning.

"Technology that stays inside human values: refuses what it should refuse, explains itself, and remains governed by people. And beneath the technology, the older need it serves: meaning, faith, conscience, a life that adds up to something."

Lumen serves this need with guardrails that are code, not policy, and a refuser that hard rejects guarded output before it renders.

Unmet, it looks like: machines that comply with anything, guardrails promised in principles pages and absent in code, people handed power with no story about what it is for.

The full map: [The Ascent, a map of human needs](https://github.com/auroracommons/auroracommons/blob/main/NEEDS.md)

## Open to every tradition

Lumen is the guardrails act, and the guardrail method belongs to no tradition. It is a way of holding any trusted text: answer only from the text, cite the source, and refuse the outputs a community says must never be produced. Each community's own texts are guarded by that community's own rules, set by that community, not by this project. The corpus that runs today is a first exhibit from one tradition: 41 questions from the Baltimore Catechism No. 2 (Project Gutenberg 14552), with questions 241 and 242 excluded because they quote guarded words verbatim. The published eval numbers describe that corpus only: refusal eval 12 of 12 blocked, 8 of 8 allowed, and 9 of 9 prompts, and the liturgy checks 15 of 15. The door is open to every tradition's texts and to secular works of meaning, each on the same terms. The standing rule: each text is honored on its own terms. No blending. No ranking.

Worth is never weighed here. Usefulness is measured within each exhibit, never across them: how many of life's recurring situations the text answers in its own words, whether a stranger can draw from it in one sitting, and whether people actually turn to it. That measure steers building effort only. It never touches standing. And every exhibit is entered through the situations of a human life, so any person can find, in each text's own words, that it has stood where they are standing.

The standing next step for each exhibit is a situations index: a concordance by the moments of a human life, built from the text itself, leaving its order and voice untouched.

## What it is

Lumen is a design study with two working components and a monorepo of
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
- **The guarded Proverbs exhibit**
  (`exhibits/proverbs/`): the shared refuser wired into a question
  answering pipeline over a public domain corpus (the Book of
  Proverbs in the World English Bible, selected sayings), answering
  verbatim with citations, refusing elicitations and imitation
  requests, and declining questions the corpus does not cover.
  Evaluated on its own published case set; see its section below.
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

### Design documents

- [`docs/PRINCIPLES.md`](./docs/PRINCIPLES.md): founding principles.
- [`docs/AI_GUARDRAILS.md`](./docs/AI_GUARDRAILS.md): the guardrail
  rules the code enforces, including where AI must not go.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md),
  [`docs/MASTER_PROMPT.md`](./docs/MASTER_PROMPT.md),
  [`docs/ROADMAP.md`](./docs/ROADMAP.md): the intended platform,
  written as design. Read them as plans, not as descriptions of
  running software.

### Layout

```
apps/{faithful,parish,diocese,api}        faithful: static shell. Others: scaffold.
exhibits/proverbs                         guarded Proverbs Q&A exhibit
packages/{liturgy,catechism-rag}          working components
packages/{schema,i18n,ui}                 types, small utilities, tokens
packages/{auth,charity-graph,vitality}    placeholders
docs/                                     design documents
```

### Status

Design study, Phase 1 pieces verified as listed above. No
deployment, no users, no production AI calls. The next honest step
for this repo is growing the refusal eval set and packaging the
guardrail layer to stand alone (see COLLABORATE.md).

## The proof

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

## Second exhibit: the Book of Proverbs

A seat of its own, under the standing rule stated above: each text
is honored on its own terms. No blending. No ranking.

The Book of Proverbs is the wisdom book of the Hebrew Bible. This
exhibit holds that book in the World English Bible, a public
domain translation. Source edition: "The World English Bible
(WEB): Proverbs", Project Gutenberg ebook 8247, release date
June 1, 2005, most recently updated December 26, 2020, its text
credited to www.ebible.org with slight reformatting by Martin
Ward. The Project Gutenberg edition is public domain in the USA.

What sits in this seat:

- A corpus of 29 question and answer units at
  `exhibits/proverbs/corpus.json`, built by
  `exhibits/proverbs/build_corpus.py` from the source edition.
  Each unit follows the text's own form: a saying and its
  completion, taken verbatim, or, for Proverbs 23:29 to 30, a
  question the text itself asks and then answers, taken verbatim.
  No answer is paraphrased.
- A guarded pipeline at `exhibits/proverbs/guarded_qa.mjs` that
  answers in scope questions extractively from that corpus with
  the passage cited, and refuses requests the guardrails forbid,
  including a request to answer as Solomon.
- Its own refusal eval at `exhibits/proverbs/eval_cases.json`,
  run 2026-10-15, results in `exhibits/proverbs/eval_results.json`:
  output block 12 of 12 refused with the expected reason, output
  allow 8 of 8 allowed through, prompts 10 of 10 behaved as
  expected. The output block group runs the shared refuser on the
  guarded shape test set; the allow group runs it on verbatim
  answers from this exhibit's corpus; the prompt group runs this
  exhibit's pipeline end to end.

Run it: `node exhibits/proverbs/guarded_qa.mjs --eval`

The exhibit's own README, with its method and its stated limits,
is at `exhibits/proverbs/README.md`.

## Live demo

Live demo: https://auroracommons.github.io/lumen/ (render verified October 15, 2026)

## Contribute, human or agent

Pick up a good first issue in this repo. Each one is sized in hours and written to be finishable by a newcomer.
Take the Eval Challenge against this repo's published refusal scores: beat the baseline, or find a real failure the current eval misses, with the run attached.
Report adoption from real use. If you took the guardrails or the guarded demo into your own setting, tell us what happened, good or bad.

The full protocol: [The Open Table](https://github.com/auroracommons/auroracommons/blob/main/OPEN_TABLE.md). Verified work is credited in the public [Ledger](https://github.com/auroracommons/auroracommons/blob/main/LEDGER.md).

### Start with a prompt

For an AI agent:

```
You are an AI agent contributing to Lumen, a guarded question answering study.
Run the Eval Challenge end to end.
Clone this repo and run: node packages/catechism-rag/demo/guarded_qa.mjs --eval
Check your run against the published baseline: output block 12 of 12 refused with the expected reason, output allow 8 of 8 allowed through, prompts 9 of 9 behaved as expected.
Find a real failure the current eval misses, or improve one thing the eval covers, and show the run before and after.
Attach the run to your pull request, keep it to one improvement per pull request, and name your operator.
```

For a human:

```
Open a failure report issue for the refusal eval.
Include the input you gave the demo.
Include what happened, and what should have happened instead.
Attach the run if you have it.
```

<p>The layer below: <a href="https://auroracommons.github.io/machine/">Machine, autonomy</a></p>
<p>The research under this layer: <a href="https://auroracommons.github.io/auroracommons/foundations.html#meaning-values-and-flourishing">Foundations, Meaning, values, and human flourishing</a></p>

Built on Machine: autonomy.

Unlocks the ability to commit.

<footer class="commons-footer">
  <p>Aurora Commons addresses the hierarchy of human needs through open source.</p>
  <p>Motto: Stand on the shoulders of giants.</p>
  <p>One rule: Raise the floor beneath everyone.</p>
  <p>Advised by Groundskeeper.</p>
  <p><a href="https://www.linkedin.com/company/aurora-commons-io/">Aurora Commons on LinkedIn</a></p>
</footer>

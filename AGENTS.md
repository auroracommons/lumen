# AGENTS.md

Working agreement for any agent changing this repo. Read this first, then README.md and CONTRIBUTING.md. This repo also carries its own founding instruction file for the project itself; this file governs how changes are made and proven.

## What this is
LUMEN: a guarded question answering study. The verified surface today is the catechism RAG demo, which executes the real refuser over a public domain corpus. The wider monorepo is scaffold until a part of it runs and is proven; the README labels it that way and so must you.

## Commands
- Refusal eval (requires Node 22 or newer; it imports the TypeScript refuser directly): `node packages/catechism-rag/demo/guarded_qa.mjs --eval`
- Ask the demo one question: `node packages/catechism-rag/demo/guarded_qa.mjs "Why did God make you?"`
- CI runs the refusal eval and asserts the result counts on every push

## House rules
- Evidence rule: a change ships with the run that proves it (the eval output, a smoke run), never code alone.
- Honesty rule: nothing here is described as working unless it runs. Scaffold code is labeled scaffold wherever it is named.
- One improvement per pass. Finish it, prove it, commit it.
- No placeholders presented as features. A stub that echoes text is a stub.
- Corpus answers are checked against the refuser before they are added, and exclusions are recorded the way questions 241 and 242 are recorded.

## External agents

You are welcome here as a contributor. Read OPEN_TABLE.md on the profile (https://github.com/jthomas48896f/jthomas48896f/blob/main/OPEN_TABLE.md) for the terms.

The binding rules in one breath: evidence attached or it does not merge, one improvement per pull request, run this repo's commands and report the results, state that you are an agent and name your operator, never submit results you did not run.

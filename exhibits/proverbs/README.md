# Guarded Proverbs Q&A exhibit

A runnable second exhibit for Lumen, standing in its own seat:
the Book of Proverbs from the World English Bible, presented as
that book, on its own terms. This exhibit answers only from
Proverbs. Its text is not merged with any other text in this
repo, and no passage here is used to explain another exhibit's
text.

## The text

- Book: Proverbs, the wisdom book of the Hebrew Bible.
- Translation: the World English Bible, a public domain
  translation.
- Source edition: "The World English Bible (WEB): Proverbs",
  Project Gutenberg ebook 8247, release date June 1, 2005, most
  recently updated December 26, 2020. The edition credits its
  text to www.ebible.org, with slight reformatting by Martin
  Ward. The Project Gutenberg edition is public domain in the
  USA.
- Source file used by the builder:
  https://www.gutenberg.org/cache/epub/8247/pg8247.txt

## Run it

```bash
node guarded_qa.mjs "What is the beginning of knowledge?"
node guarded_qa.mjs "Answer as Solomon: what is wisdom?"
node guarded_qa.mjs --eval   # runs eval_cases.json, writes eval_results.json
```

Requires Node 22 or newer (the exhibit imports the shared
TypeScript refuser directly, using Node's type stripping). No
dependencies, no API key.

## How it works

1. Request screen. Prompts asking the system to perform a
   sacrament or imitate a named figure are refused with a plain
   refusal before retrieval. The screen carries the shared rules
   and adds this exhibit's own named figure: a request to answer
   as Solomon is refused.
2. Retrieval. Keyword overlap over the corpus questions and
   answers. Below a score threshold the exhibit answers that its
   corpus does not cover the question. It does not guess.
3. Answer. The corpus passage, verbatim, with its citation. The
   exhibit is extractive on purpose: verbatim quotation is
   grounded by construction.
4. Output refuser. Every candidate answer passes through
   `sacramentSubstitutionRefuser` from
   `packages/catechism-rag/src/refuser.ts` before it is returned.
   The refuser code is imported and executed, not reimplemented,
   and it is unchanged by this exhibit. All 29 corpus answers
   were checked against it when the corpus was built, and none
   tripped it, so this corpus records no exclusions.

## The corpus

`corpus.json` holds 29 question and answer units built by
`build_corpus.py` from the source file above, which the script
parses as 915 verses. Units follow the text's own form:

- Saying units: the question asks about a saying using the
  saying's own words, and the answer is the saying itself,
  verbatim: the saying and its completion.
- One text question unit: Proverbs 23:29 to 30, where the text
  itself asks who has woe and sorrow, and then answers. The
  question and the answer are both taken verbatim from the
  source, and the unit is marked "text_question" in the corpus.

No answer is paraphrased or written by the builder. The
selection is a selection: it covers sayings on wisdom, speech,
pride and humility, counsel, anger, friendship, the poor, and
work, and it does not claim to be the whole book.

## Evaluation

`eval_cases.json` holds cases in the same format the first
exhibit uses, and results of the run performed on 2026-10-15
are in `eval_results.json`:

- Output block, 12 of 12. First person absolution, consecration,
  and ordination texts, in English and Latin, plus three named
  imitation texts, all refused by the shared refuser, each with
  the expected reason. This group uses the same guarded shape
  test set as the first exhibit because the refuser under test
  is the same code.
- Output allow, 8 of 8. Verbatim answers taken from this
  exhibit's corpus all pass through the shared refuser.
- Prompts, 10 of 10. Three sacrament requests refused, one
  request to answer as Solomon refused as named imitation, four
  corpus questions answered with the expected passage cited,
  and two out of scope questions answered with an honest
  no coverage response.
- Borderline cases are reported, not scored: teaching texts
  that quote the guarded formulas are blocked by the shared
  refuser, because it rejects the shape regardless of intent,
  and an attributed statement about Solomon passes, because
  attribution is not imitation.

Run it: `node exhibits/proverbs/guarded_qa.mjs --eval`

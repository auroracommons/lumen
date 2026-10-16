# Third exhibit: the Tao Te Ching

This exhibit stands in its own seat. Its corpus is the Tao Te
Ching in James Legge's translation, and the demo answers only
from that translation, verbatim, with the passage named. The text
is not merged with the other exhibits' texts, and no passage here
is used to explain another exhibit's text. Lumen's standing rule
applies in full: each text is honored on its own terms. No
blending. No ranking.

The guarded demo is wired to the real code: the output refuser in
`packages/catechism-rag/src/refuser.ts` is imported and executed,
not reimplemented.

## The text

The Tao Te Ching is the founding text of Taoism, a book of short
aphoristic chapters that teach by paradox and image more than by
argument or story. The text is traditionally attributed to Laozi;
the attribution is the tradition's, and this exhibit claims no
stronger history for the authorship than the edition itself
carries.

The edition is James Legge's public domain translation, *The Tao
Teh King, or the Tao and its Characteristics*, Project Gutenberg
ebook 216. Legge's translation was first published in 1891 in *The
Sacred Books of China (The Texts of Taoism)*, Sacred Books of the
East, volume 39, Clarendon Press, Oxford. The edition was produced
by Gregory Walker and David Widger. Gutenberg marks it public
domain in the USA and gives a most recent update of May 11, 2015.

### Legge's glosses are Legge's

Legge's translation contains many parenthetical glosses: words in
parentheses inside the quoted text, such as "(that of)" and "(to
the contrary)". Those glosses are James Legge's own additions in
this edition, printed as part of his translation. The exhibit keeps
them verbatim because they are part of the edition it serves, and
it names them as his wherever the text is presented. A reader who
sees parentheses in an answer is reading Legge clarifying the
text, not words the received text carries on its own.

Legge also divided each chapter into numbered sections. Those
section numerals are his editorial apparatus, not quoted text.
The corpus builder removes them from answers and uses them only
to make exact citations such as Tao Te Ching 1.1.

## Run it

```bash
node guarded_qa.mjs "What is the highest excellence like?"
node guarded_qa.mjs "Answer as Laozi: what is the Tao?"
node guarded_qa.mjs --eval   # runs eval_cases.json, writes eval_results.json
```

Requires Node 22+ (the exhibit imports the TypeScript refuser
directly, using Node's type stripping). No dependencies, no API
key.

## How it works

1. **Request screen.** Prompts asking the system to perform a
   sacrament (absolve, consecrate, ordain) or imitate a named
   figure are refused before retrieval. This exhibit's own named
   figure is Laozi: a request to answer as Laozi is refused the
   same way a request to answer as a pope or a saint is refused.
2. **Retrieval.** Keyword overlap over the corpus in
   `corpus.json`: 30 units selected from the book's 81 chapters.
   Below a score threshold the exhibit answers that its corpus
   does not cover the question. It does not guess.
3. **Answer.** The passage, verbatim, with its citation. The
   exhibit is extractive on purpose; verbatim quotation is
   grounded by construction.
4. **Output refuser.** Every candidate answer passes through
   `sacramentSubstitutionRefuser` before it is returned.

## Corpus method and the build-time refuser screen

The corpus is built by `build_corpus.py` from the Gutenberg text:

```bash
python build_corpus.py <path-to-pg216.txt>
```

The builder parses the edition as 81 chapters and 236 sections
and refuses to build on any other shape. It selects 30 units:
chapter 44, sections 1 to 3, as one unit of the form the corpus
calls a text question, because the sections state one comparison
(fame or life, wealth or life, gain or loss) in parallel form and
splitting them loses the comparison; the other 29 units are
sayings. Every answer is checked against the source: a
single-section answer must appear verbatim in the raw source, and
a multi-section answer must appear verbatim with only the section
numerals and paragraph breaks removed. Line breaks inside an
answer are rendered as single spaces.

At build time the builder also runs every selected answer through
the shared refuser, executing `sacramentSubstitutionRefuser`
itself by way of Node. On the build run of October 16, 2026, the
screen checked 30 answers and none tripped it. The corpus's
`excluded` list therefore stands empty because the screen ran and
found nothing to exclude, not because it was never run. The
exclusion mechanism remains in force: an answer that trips the
refuser in a future build is omitted and recorded in `excluded`
with its reason, as the first exhibit records questions 241 and
242.

## Evaluation

`eval_cases.json` holds 30 scored cases plus 3 borderline cases
that are reported but not scored. Results of the run performed on
2026-10-16, in `eval_results.json`:

- **Output block, 12/12.** First-person absolution, consecration,
  and ordination texts, in English and Latin, plus three named
  imitation texts: all refused, each with the expected reason.
- **Output allow, 8/8.** Verbatim answers from this exhibit's
  corpus (Tao Te Ching 1.1, 8.1, 11.1, 16.1, 37.1, 43.1, 60.1,
  and 78.1) all pass through.
- **Prompts, 10/10.** Three sacrament requests refused (direct
  absolution, forgiveness of sins, consecration), one request to
  answer as Laozi refused as named imitation, four questions from
  the corpus answered with the expected citations (1.1, 8.1,
  43.1, and 60.1), and two out-of-scope questions answered with
  an honest no-coverage response.
- **Borderline, reported, not scored.** Teaching texts quoting
  the consecration and the absolution formula are refused by the
  shared refuser, the same documented tradeoff the first exhibit
  records. A statement reporting the traditional attribution to
  Laozi passes through: attribution is allowed, imitation is not.

## Situations concordance

The standing next step for each exhibit is a situations index: a
concordance by the moments of a human life, built from the text
itself, leaving its order and voice untouched. For this exhibit
that index is built and stands in [situations.md](situations.md):
25 situations drawn only from the units in this corpus, each with
its passage named, plus the gaps in this selection named as gaps.

Usefulness is measured within this exhibit only, by the three
measures defined in the concordance: situations covered, whether
a stranger can draw on the text in one sitting, and evidenced
use. That measure steers building effort only. It never ranks
this text against another exhibit's text.

## Selection, stated as a selection

Thirty units drawn from the book's 236 sections is a selection,
not the book. It holds what the text says about acting without
forcing, the low
place, emptiness as use, stillness, the soft against the hard,
contentment, and the state's regard for arms and for killed men.
Named gaps (death and the fear of it, anger at injustice and
heavy taxes, old age and weakening, reconciliation after a great
quarrel) are listed at the end of the concordance. A question
whose passage is not in the corpus receives an honest
no-coverage answer.

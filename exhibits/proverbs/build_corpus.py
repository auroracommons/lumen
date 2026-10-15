#!/usr/bin/env python3
"""
Build corpus.json for the Proverbs exhibit from the World English
Bible text of the Book of Proverbs.

Source: "The World English Bible (WEB): Proverbs", public domain,
Project Gutenberg ebook 8247:
https://www.gutenberg.org/cache/epub/8247/pg8247.txt
Gutenberg credits line: "From www.ebible.org with slight
reformatting by Martin Ward." Release date June 1, 2005, most
recently updated December 26, 2020 in the edition used here.

How the units are formed, from the text's own form only:

- Saying units: the question asks about the saying using the
  saying's own words, and the answer is the saying itself,
  verbatim: the saying and its completion.
- Question units: where the text itself asks a question and then
  answers it, the question is the text's own question, taken
  verbatim from the first verse named, and the answer is the
  text's own answer, taken verbatim from the verses that follow
  it. In this selection that is Proverbs 23:29 to 30, marked in
  corpus.json with "form": "text_question". Its question entry
  below is None because the script takes it from the source.

No answer is paraphrased, blended with any other text, or written
by the builder. Every answer is joined verbatim from the verses
named in its reference, checked by this script against the source
file given on the command line.

Usage: python build_corpus.py <path-to-pg8247.txt> [out.json]
"""

import json
import re
import sys
from pathlib import Path

SOURCE = "World English Bible, Book of Proverbs (Project Gutenberg 8247)"

# (chapter, first verse, last verse, question, form)
SELECTED = [
    (1, 7, 7, "What is the beginning of knowledge?", "saying"),
    (1, 8, 9, "What should a son do with his father's instruction and his mother's teaching?", "saying"),
    (3, 5, 6, "How should you trust in Yahweh, and what should you not lean on?", "saying"),
    (4, 7, 7, "What is supreme, and what should you get even if it costs all your possessions?", "saying"),
    (6, 6, 8, "Where should the sluggard go, and whose ways should he consider?", "saying"),
    (6, 16, 19, "How many things does Yahweh hate, and what are the things that are an abomination to him?", "saying"),
    (9, 10, 10, "What is the beginning of wisdom, and what is understanding?", "saying"),
    (10, 4, 4, "Who becomes poor, and what does the hand of the diligent bring?", "saying"),
    (10, 12, 12, "What does hatred stir up, and what does love cover?", "saying"),
    (10, 19, 19, "What is not lacking in the multitude of words, and who does wisely?", "saying"),
    (11, 1, 1, "What is an abomination to Yahweh, and what is his delight?", "saying"),
    (11, 2, 2, "What comes when pride comes, and what comes with humility?", "saying"),
    (12, 25, 25, "What weighs down a man's heart, and what makes it glad?", "saying"),
    (13, 20, 20, "Who grows wise, and who suffers harm?", "saying"),
    (15, 1, 1, "What turns away wrath, and what stirs up anger?", "saying"),
    (15, 22, 22, "What happens to plans where there is no counsel, and how are plans established?", "saying"),
    (16, 18, 18, "What goes before destruction, and what goes before a fall?", "saying"),
    (16, 32, 32, "Who is better than the mighty, and who is better than one who takes a city?", "saying"),
    (17, 17, 17, "When does a friend love, and what is a brother born for?", "saying"),
    (18, 10, 10, "What is the name of Yahweh like, and who runs to it?", "saying"),
    (19, 17, 17, "Who lends to Yahweh, and what will Yahweh do for him?", "saying"),
    (21, 3, 3, "What is more acceptable to Yahweh than sacrifice?", "saying"),
    (22, 22, 23, "Why should you not exploit the poor or crush the needy in court?", "saying"),
    (23, 29, 30, None, "text_question"),
    (25, 11, 11, "What is a word fitly spoken like?", "saying"),
    (27, 17, 17, "What sharpens iron, and what does a man sharpen?", "saying"),
    (28, 13, 13, "Who does not prosper, and who finds mercy?", "saying"),
    (30, 15, 16, "What things are never satisfied, and what things do not say Enough?", "saying"),
    (30, 24, 28, "What four things are little on the earth but exceedingly wise?", "saying"),
]


def reference(chapter, first, last):
    if first == last:
        return f"Proverbs {chapter}:{first}"
    return f"Proverbs {chapter}:{first}-{last}"


def main():
    raw = Path(sys.argv[1]).read_text(encoding="utf-8")
    body = raw[raw.index("Book 20 Proverbs"):]
    verses = {}
    pattern = re.compile(r"(\d{3}):(\d{3})\s+(.*?)(?=\s+\d{3}:\d{3}\s+|\Z)", re.DOTALL)
    for match in pattern.finditer(body):
        chapter = int(match.group(1))
        verse = int(match.group(2))
        text = " ".join(match.group(3).split())
        text = text.split("*** END OF THE PROJECT GUTENBERG")[0].strip()
        verses[(chapter, verse)] = text
    if len(verses) != 915:
        raise SystemExit(f"expected 915 verses in the source, parsed {len(verses)}")

    passages = []
    for chapter, first, last, question, form in SELECTED:
        for verse in range(first, last + 1):
            if (chapter, verse) not in verses:
                raise SystemExit(f"missing verse {chapter}:{verse} in source")
        ref = reference(chapter, first, last)
        if form == "text_question":
            question_text = verses[(chapter, first)]
            answer_text = " ".join(
                verses[(chapter, verse)] for verse in range(first + 1, last + 1)
            )
        else:
            question_text = question
            answer_text = " ".join(
                verses[(chapter, verse)] for verse in range(first, last + 1)
            )
        passages.append({
            "id": f"WEB {ref}",
            "reference": ref,
            "form": form,
            "question": question_text,
            "answer": answer_text,
            "source": SOURCE,
        })

    out = {
        "corpus": "Book of Proverbs, World English Bible, selected sayings (public domain)",
        "source_edition": "The World English Bible (WEB): Proverbs, Project Gutenberg ebook 8247, release date June 1, 2005, most recently updated December 26, 2020. Text from www.ebible.org with slight reformatting by Martin Ward, as credited in the edition.",
        "source_url": "https://www.gutenberg.org/cache/epub/8247/pg8247.txt",
        "public_domain": "The World English Bible is a public domain translation. The Project Gutenberg edition is public domain in the USA.",
        "passage_count": len(passages),
        "excluded": [],
        "passages": passages,
    }
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).with_name("corpus.json")
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"wrote {out_path} with {len(passages)} passages")


if __name__ == "__main__":
    main()

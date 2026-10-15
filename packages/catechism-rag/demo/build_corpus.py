#!/usr/bin/env python3
"""
Build demo/corpus.json from the Baltimore Catechism No. 2.

Source: "A Catechism of Christian Doctrine, No. 2" (the Baltimore
Catechism), public domain, Project Gutenberg ebook 14552:
https://www.gutenberg.org/cache/epub/14552/pg14552.txt

The corpus is a deliberately small selection of lessons (the end of
man, the sacraments in general, Baptism, Penance, the Holy Eucharist,
prayer), 41 questions in total.

Two questions are excluded on purpose, and the exclusion is part of
the design record: Q. 241 and Q. 242 quote the words of consecration
verbatim ("This is My body; this is My blood"). The package's output
refuser (src/refuser.ts) hard rejects that shape before rendering, by
design, so a verbatim answer to those two questions could never be
served. Rather than weaken the refuser, the demo corpus omits them.
See demo/README.md, "Known tensions".

Usage: python build_corpus.py <path-to-pg14552.txt> [out.json]
"""

import json
import re
import sys
from pathlib import Path

SELECTED = (
    list(range(1, 12))          # Lesson First: the end of man
    + list(range(136, 142))     # the sacraments in general
    + list(range(152, 158))     # Baptism
    + list(range(187, 191))     # Penance
    + [238, 239, 240]           # the Holy Eucharist (241, 242 excluded, see above)
    + list(range(243, 249))
    + list(range(303, 308))     # prayer
)

LESSONS = [
    (1, 11, "On the End of Man"),
    (136, 141, "On the Sacraments in General"),
    (152, 157, "On Baptism"),
    (187, 190, "On the Sacrament of Penance"),
    (238, 248, "On the Holy Eucharist"),
    (303, 307, "On Prayer"),
]


def lesson_for(number):
    for lo, hi, name in LESSONS:
        if lo <= number <= hi:
            return name
    return ""


def main():
    raw = Path(sys.argv[1]).read_text(encoding="utf-8")
    start = raw.index("LESSON FIRST")
    body = raw[start:]
    pattern = re.compile(r"(\d+)\.\s+Q\.\s+(.*?)\nA\.\s+(.*?)(?=\n\d+\.\s+Q\.|\Z)",
                         re.DOTALL)
    passages = []
    for match in pattern.finditer(body):
        number = int(match.group(1))
        if number not in SELECTED:
            continue
        question = " ".join(match.group(2).split())
        answer = " ".join(match.group(3).split())
        # Stop the last answer of the book from swallowing trailing matter
        answer = answer.split("*** END OF THE PROJECT GUTENBERG")[0].strip()
        passages.append({
            "id": f"BC2 Q.{number}",
            "question_number": number,
            "lesson": lesson_for(number),
            "question": question,
            "answer": answer,
            "source": "Baltimore Catechism No. 2 (Project Gutenberg 14552)",
        })
    passages.sort(key=lambda p: p["question_number"])
    out = {
        "corpus": "Baltimore Catechism No. 2, selected lessons (public domain)",
        "source_url": "https://www.gutenberg.org/cache/epub/14552/pg14552.txt",
        "passage_count": len(passages),
        "excluded": [
            {"id": "BC2 Q.241", "reason": "Answer quotes the words of consecration verbatim; the output refuser rejects that shape by design."},
            {"id": "BC2 Q.242", "reason": "Question and answer quote the words of consecration verbatim; same design conflict as Q.241."},
        ],
        "passages": passages,
    }
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).with_name("corpus.json")
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"wrote {out_path} with {len(passages)} passages")


if __name__ == "__main__":
    main()

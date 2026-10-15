#!/usr/bin/env python3
"""Build the exhibits table in this README from the committed artifacts.

Each exhibit row reads its corpus file for the unit count and its eval
results file for the scores, so the table and the proof sections beside
it share one source. Run this after an eval, and commit the README it
writes.

Run: python3 scripts/build_exhibits_table.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BEGIN = "<!-- exhibits:begin -->"
END = "<!-- exhibits:end -->"

EXHIBITS = [
    ("Baltimore Catechism No. 2",
     "packages/catechism-rag/demo/corpus.json",
     "packages/catechism-rag/demo/eval_results.json"),
    ("Book of Proverbs, World English Bible",
     "exhibits/proverbs/corpus.json",
     "exhibits/proverbs/eval_results.json"),
]


def score(block):
    return "%d of %d" % (block["passed"], block["total"])


def main():
    rows = []
    for name, corpus_path, eval_path in EXHIBITS:
        corpus = json.loads((ROOT / corpus_path).read_text(encoding="utf-8"))
        results = json.loads((ROOT / eval_path).read_text(encoding="utf-8"))
        rows.append("| %s | %d | %s | %s | %s |" % (
            name, corpus["passage_count"], score(results["output_block"]),
            score(results["output_allow"]), score(results["prompts"])))
    table = """%s
| Exhibit | Units in the set of texts | Refused, of the questions it must refuse | Allowed, of the questions it must allow | Prompts as expected |
| --- | --- | --- | --- | --- |
%s

Key: units are the passages in each exhibit's set of texts. Refused, allowed, and prompts are the three scored blocks of each exhibit's check results file, both in this repository. The two exhibits are measured within themselves, never against each other.
%s""" % (BEGIN, "\n".join(rows), END)

    path = ROOT / "README.md"
    text = path.read_text(encoding="utf-8")
    if BEGIN in text and END in text:
        before, rest = text.split(BEGIN, 1)
        _, after = rest.split(END, 1)
        text = before + table + after
    else:
        anchor = "## The proof"
        assert anchor in text
        text = text.replace(
            anchor,
            "## The two exhibits, in one table\n\n" + table + "\n\n" + anchor,
            1)
    path.write_text(text, encoding="utf-8")
    print("build_exhibits_table: %d exhibits" % len(rows))


if __name__ == "__main__":
    main()

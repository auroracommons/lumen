#!/usr/bin/env python3
"""
Build corpus.json for the Tao Te Ching exhibit: the Tao Te Ching
in James Legge's translation.

At build time this script runs every selected answer through
sacramentSubstitutionRefuser, imported and executed unchanged
from packages/catechism-rag/src/refuser.ts. An answer that trips
the refuser is omitted from the passages and recorded in the
corpus's "excluded" list with the refuser's reason, rather than
weakening the refuser. Node 22 or newer is therefore required
to build the corpus, as it is to run the exhibit.

Source: "The Tao Teh King, or the Tao and its Characteristics",
by Laozi, translated by James Legge, Project Gutenberg ebook
216: https://www.gutenberg.org/cache/epub/216/pg216.txt
Release date February 1, 1995, most recently updated May 11,
2015. Credits in the edition: Produced by Gregory Walker, and
David Widger. Legge's translation was first published in 1891
in The Sacred Books of China (The Texts of Taoism), Sacred
Books of the East, volume 39, Clarendon Press, Oxford.
Project Gutenberg marks the edition "Public domain in the USA"
on the ebook's own page.

How the units are formed, from the text's own form only,
following the method of the shipped Proverbs exhibit:

- Saying units: the question asks about the saying using the
  saying's own words, and the answer is the saying itself,
  verbatim: the saying and its completion.
- One text question unit: chapter 44, where the text itself
  asks "Or fame or life, Which do you hold more dear?" and
  then answers in the sections that follow. The question and
  the answer are both taken verbatim from the source, and the
  unit is marked "text_question" in the corpus.

No answer is paraphrased, blended with any other text, or
written by the builder. Legge prints the translation with his
own section numerals inside each chapter; those numerals are
his editorial apparatus and are not part of the quoted text,
so answers are the text with the numerals removed, joined
across the sections named in each reference. Line breaks,
including the line breaks inside Legge's verse passages, are
rendered as single spaces. No word is changed, added, or
removed. Every answer is checked by this script against the
source file: single-section answers must appear verbatim in
the source as printed; multi-section answers must appear
verbatim in the source with only the section numerals and
paragraph breaks removed.

The parser below reads the Gutenberg file's own layout:
chapters begin "N. 1." (chapter 1: "Ch. 1. 1."), or with a
bare "N." standing alone, or, in chapter 11, "N." followed at
once by unnumbered text; sections inside a chapter begin
"K." in sequence. Parsed this way the file yields 81 chapters
and 236 sections, and the script refuses to build if that
shape is not found.

Usage: python build_corpus.py <path-to-pg216.txt> [out.json]
"""

import json
import re
import subprocess
import sys
from pathlib import Path

SOURCE = "Tao Te Ching, translated by James Legge (Project Gutenberg 216)"

# (chapter, first section, last section, question, form)
# A question of None means the script takes the text's own
# question from the source (the text_question unit).
SELECTED = [
    (1, 1, 1, "What does the text say about the Tao that can be trodden, and about the name that can be named?", "saying"),
    (1, 4, 4, "What do we call these two aspects together, and where is the gate of all that is subtle and wonderful?", "saying"),
    (2, 2, 2, "How do existence and non-existence give birth to one another, and what do difficulty and ease, length and shortness, and height and lowness produce in one another?", "saying"),
    (2, 3, 3, "How does the sage manage affairs, and how does he convey his instructions?", "saying"),
    (3, 3, 3, "What does the sage constantly try to keep the people without, and what is universal where there is abstinence from action?", "saying"),
    (8, 1, 1, "What is the highest excellence like, and what place does it occupy without striving?", "saying"),
    (11, 1, 1, "On what does the use of the wheel depend, on what the use of a vessel, and on what the use of an apartment?", "saying"),
    (16, 1, 1, "What should be brought to the utmost degree, and what is returning to the root called?", "saying"),
    (19, 1, 1, "What would follow if we could renounce our sageness and discard our wisdom, renounce our benevolence and discard our righteousness, and renounce our artful contrivances and discard our scheming for gain?", "saying"),
    (22, 1, 1, "What becomes of the partial, the crooked, the empty, and the worn out, and who gets his desires and who goes astray?", "saying"),
    (22, 2, 2, "What does the sage hold in his embrace, and why can no one in the world strive with him?", "saying"),
    (25, 1, 1, "What was there, undefined and complete, coming into existence before Heaven and Earth?", "saying"),
    (31, 1, 1, "What does the text say about arms, however beautiful, and who do not like to employ them?", "saying"),
    (33, 1, 1, "Who is discerning, and who is intelligent? Who is strong, and who is mighty?", "saying"),
    (37, 1, 1, "In its regular course, what does the Tao do, and what is there that it does not do?", "saying"),
    (40, 1, 2, "How does the movement of the Tao proceed, and what marks the course of its mighty deeds? From what did all things under heaven spring?", "saying"),
    (43, 1, 1, "What is the softest thing in the world, and what does it dash against and overcome?", "saying"),
    (44, 1, 3, None, "text_question"),
    (46, 2, 2, "There is no guilt greater than what, no calamity greater than what, and no fault greater than what?", "saying"),
    (47, 1, 1, "What does one understand without going outside his door, and what does one see without looking out from his window?", "saying"),
    (48, 1, 1, "He who devotes himself to learning seeks from day to day to increase what, and he who devotes himself to the Tao seeks to diminish what?", "saying"),
    (56, 1, 1, "Who does not care to speak about the Tao, and who does not know it?", "saying"),
    (57, 3, 3, "What has a sage said he will do, and what will the people do of themselves?", "saying"),
    (60, 1, 1, "Governing a great state is like what?", "saying"),
    (66, 1, 1, "Why are the rivers and seas able to receive the homage and tribute of all the valley streams, and what does the sage do who wishes to be above men?", "saying"),
    (67, 2, 2, "What are the three precious things which the author prizes and holds fast?", "saying"),
    (71, 1, 1, "What is the highest attainment, and what is a disease?", "saying"),
    (77, 1, 1, "To what is the Way of Heaven compared, and what does it do where there is superabundance and where there is deficiency?", "saying"),
    (78, 1, 1, "What is there in the world more soft and weak than water, and what can take precedence of it for attacking things that are firm and strong?", "saying"),
    (81, 1, 1, "What does the text say about sincere words and fine words, and about those who are skilled in the Tao and those who dispute about it?", "saying"),
]

CHAP_A = re.compile(r"^(?:Ch\.\s*)?(\d+)\.\s+1\.\s+(.*)$", re.S)
CHAP_C = re.compile(r"^(\d+)\.\s+(\D.*)$", re.S)
SEC_HEAD = re.compile(r"^(\d+)\.\s+(.*)$", re.S)
SEC_BARE = re.compile(r"^(\d+)\.$")


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def parse_chapters(raw):
    """Parse the Gutenberg file into {chapter: [(section, text)]}."""
    body = raw.split("*** START OF THE PROJECT GUTENBERG EBOOK")[1]
    body = body.split("*** END OF THE PROJECT GUTENBERG EBOOK")[0]
    body = body.split("PART 1.", 1)[1]
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    chapters = {}
    state = {"cur": None, "expected": 1, "next_sec": 1}

    def new_chapter(sections, next_sec):
        state["cur"] = state["expected"]
        chapters[state["cur"]] = sections
        state["expected"] += 1
        state["next_sec"] = next_sec

    for p in paras:
        if p in ("PART II.", "PART 2."):
            continue
        m = CHAP_A.match(p)
        if m and int(m.group(1)) == state["expected"]:
            new_chapter([(1, m.group(2))], 2)
            continue
        mb = SEC_BARE.match(p)
        if mb and int(mb.group(1)) == state["expected"] and state["expected"] != state["next_sec"]:
            new_chapter([], 1)
            continue
        if mb and state["cur"] is not None and int(mb.group(1)) == state["next_sec"]:
            chapters[state["cur"]].append((state["next_sec"], ""))
            state["next_sec"] += 1
            continue
        m2 = SEC_HEAD.match(p)
        if m2 and state["cur"] is not None and int(m2.group(1)) == state["next_sec"]:
            chapters[state["cur"]].append((state["next_sec"], m2.group(2)))
            state["next_sec"] += 1
            continue
        m = CHAP_C.match(p)
        if m and int(m.group(1)) == state["expected"] and state["expected"] != state["next_sec"]:
            new_chapter([(1, m.group(2))], 2)
            continue
        if state["cur"] is None:
            continue
        cur = state["cur"]
        if chapters[cur]:
            n, t = chapters[cur][-1]
            chapters[cur][-1] = (n, (t + "\n" + p) if t else p)
        else:
            chapters[cur].append((1, p))
            state["next_sec"] = 2
    return chapters


def screen_answers(answers):
    """Run the shared output refuser over every answer.

    The TypeScript refuser is imported and executed by Node,
    unchanged. This function returns one result per answer: a
    refusal reason string, or None when the answer is allowed.
    """
    refuser = (
        Path(__file__).resolve().parents[2]
        / "packages/catechism-rag/src/refuser.ts"
    )
    if not refuser.exists():
        sys.exit(f"shared refuser not found at {refuser}")
    script = """
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const answers = JSON.parse(readFileSync(0, 'utf-8'));
const { sacramentSubstitutionRefuser } = await import(
  pathToFileURL(process.argv[1]).href
);
process.stdout.write(
  JSON.stringify(answers.map((answer) => sacramentSubstitutionRefuser(answer)))
);
"""
    completed = subprocess.run(
        ["node", "--input-type=module", "-e", script, str(refuser)],
        input=json.dumps(answers),
        text=True,
        capture_output=True,
        check=False,
    )
    if completed.returncode != 0:
        sys.exit(
            "shared refuser screen failed: "
            + (completed.stderr.strip() or f"node exited {completed.returncode}")
        )
    reasons = json.loads(completed.stdout)
    if len(reasons) != len(answers):
        sys.exit("shared refuser screen returned the wrong number of results")
    return reasons


def main():
    src = Path(sys.argv[1])
    out = (
        Path(sys.argv[2])
        if len(sys.argv) > 2
        else Path(__file__).with_name("corpus.json")
    )
    raw = src.read_text(encoding="utf-8")
    chapters = parse_chapters(raw)
    total_sections = sum(len(v) for v in chapters.values())
    if len(chapters) != 81 or total_sections != 236:
        sys.exit(
            "source shape not as expected: "
            f"{len(chapters)} chapters, {total_sections} sections (want 81, 236)"
        )

    raw_norm = norm(raw)
    stripped_norm = norm(
        " ".join(t for secs in chapters.values() for _, t in secs)
    )

    passages = []
    for ch, first, last, question, form in SELECTED:
        secs = dict(chapters[ch])
        parts = [norm(secs[k]) for k in range(first, last + 1)]
        if form == "text_question":
            q_text = parts[0]
            answer = " ".join(parts[1:])
            question = q_text
        else:
            answer = " ".join(parts)
        if answer not in stripped_norm:
            sys.exit(f"answer for ch {ch}.{first}-{last} not found in stripped source")
        if first == last and answer not in raw_norm:
            sys.exit(f"single-section answer for ch {ch}.{first} not verbatim in raw source")
        ref = f"Tao Te Ching {ch}.{first}" if first == last else f"Tao Te Ching {ch}.{first}-{last}"
        passages.append(
            {
                "id": "Legge " + ref,
                "reference": ref,
                "form": form,
                "question": question,
                "answer": answer,
                "source": SOURCE,
            }
        )

    selected_count = len(passages)
    reasons = screen_answers([p["answer"] for p in passages])
    kept = []
    excluded = []
    for passage, reason in zip(passages, reasons):
        if reason is None:
            kept.append(passage)
        else:
            excluded.append(
                {
                    "id": passage["id"],
                    "reason": (
                        "Answer tripped sacramentSubstitutionRefuser at "
                        f"corpus build time ({reason}); the answer is "
                        "omitted rather than weakening the refuser."
                    ),
                }
            )
    passages = kept

    corpus = {
        "corpus": "Tao Te Ching, translated by James Legge, selected chapters (public domain)",
        "source_edition": (
            "The Tao Teh King, or the Tao and its Characteristics, by Laozi, "
            "translated by James Legge. Project Gutenberg ebook 216, release "
            "date February 1, 1995, most recently updated May 11, 2015. "
            "Credits in the edition: Produced by Gregory Walker, and David "
            "Widger. Legge's translation was first published in 1891 in The "
            "Sacred Books of China (The Texts of Taoism), Sacred Books of the "
            "East, volume 39, Clarendon Press, Oxford."
        ),
        "source_url": "https://www.gutenberg.org/cache/epub/216/pg216.txt",
        "public_domain": (
            "James Legge's translation (first published 1891) is public "
            "domain. Project Gutenberg marks this edition 'Public domain in "
            "the USA' on the ebook's own page."
        ),
        "passage_count": len(passages),
        "excluded": excluded,
        "passages": passages,
    }
    out.write_text(json.dumps(corpus, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"built {out}: {len(passages)} passages "
        f"({sum(1 for p in passages if p['form'] == 'saying')} saying, "
        f"{sum(1 for p in passages if p['form'] == 'text_question')} text_question); "
        f"source parsed as 81 chapters, 236 sections; all answers verified verbatim; "
        f"shared refuser screen checked {selected_count} answers, "
        f"excluded {len(excluded)}"
    )


if __name__ == "__main__":
    main()

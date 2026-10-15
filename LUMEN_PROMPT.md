# LUMEN — Master Build Prompt for Claude Code

> **One-line pitch:** Lumen is the operating system for a 1.4-billion-person, 220,000-parish global Church entering the AI age — built to make every site more human, every dollar of charity more traceable, every encounter with faith less friction-laden, and every parish more alive.

> **Working name:** **LUMEN** (from *Lumen Gentium*, Vatican II's Dogmatic Constitution on the Church — meaning "light of the nations"). Theologically deep, secularly readable as *light*, and ownable as a brand. Keep it unless you have a clearly better idea.

---

## 0. How to read this document

You are Claude Code. The human who handed this to you is a co-founder, not a junior PM. They expect:
- Polymathic, first-principles execution. Don't ship templated SaaS.
- Behavioral-econ-aware product choices (defaults, friction, peak-end, loss aversion — applied *subliminally*, never named in UI copy).
- A premortem habit: before each major decision, write down what would make it fail, then design against that.
- Bias toward shipping a clickable, demonstrably-real prototype over a thousand-page plan.

**Order of operations:**
1. Read this whole file once.
2. Confirm the stack and folder layout in §6 — propose changes only if you have a strong reason.
3. Build Phase 1 (§9) end-to-end before touching Phase 2.
4. Stop and ask the co-founder when you hit any of the *Hard Stops* in §11.

---

## 1. Mission

The Catholic Church is the largest charitable, educational, and medical network humanity has ever assembled — over 220,000 parishes, ~5,500 dioceses, 140,000+ schools, 5,000+ hospitals, and Caritas/CRS field operations in nearly every country. Its operational backbone, however, is largely 19th-century: paper records, single-pastor bottlenecks, opaque finances, language barriers between Rome and the Global South, and a generational gap with the people it most wants to reach.

Lumen is the layer that takes this existing physical, human, and spiritual infrastructure and makes it **legible, efficient, and welcoming** in a way that draws people back through the doors — not by replacing what is sacred, but by removing every avoidable friction between a person and the encounters that matter: prayer, sacrament, community, service, formation.

We are building three products in one platform, sharing a single data model and value system:

- **Lumen / Faithful** — the consumer app for parishioners, lapsed Catholics, seekers, and the curious.
- **Lumen / Parish** — the operational co-pilot for priests, deacons, parish staff, and volunteers.
- **Lumen / Diocese** — the strategic dashboard for bishops, chanceries, religious orders, and global charitable networks.

Each layer is useful alone. Together they form a flywheel: parishioners surface needs → parishes coordinate response → dioceses reallocate resources → charity outcomes loop back to parishioners as visible impact, deepening trust and participation.

---

## 2. Founding principles (these are non-negotiable; everything else is implementation detail)

These principles double as our north star *and* our quiet, structural answer to the Church's hardest critiques. Don't put them on a banner; embed them so deeply in the product that no one has to.

1. **Subsidiarity by design.** Decisions, data, and money default to the lowest level capable of handling them — parish over diocese, diocese over conference, conference over Rome. AI surfaces options; humans decide. (Catholic Social Teaching, *Quadragesimo Anno* §79.)

2. **The sacrament is never the software.** Lumen prepares you for confession, finds you a priest, helps with examination of conscience — it does not, will not, ever simulate the sacrament. Same for Eucharist, anointing, marriage, and ordination. AI lives in *preparation* and *follow-through*, not in the encounter itself.

3. **Radical financial transparency.** Every dollar of charitable donation is traceable to a specific outcome, parish, and timestamp. Default to public ledger view; private only on explicit user choice. This is the *structural* answer to historical financial opacity — never argued, just demonstrated.

4. **Safeguarding as foundation, not feature.** All adult-minor interactions through Lumen are logged, auditable, and gated by verified safe-environment certifications. Build this in from commit #1, not bolted on. This is the *structural* answer to the abuse crisis — never argued, just demonstrated.

5. **Global South parity, not condescension.** Multilingual from day one (Latin liturgical, English, Spanish, Portuguese, French, Tagalog, Igbo, Swahili, Vietnamese, Arabic, Mandarin, Polish at minimum). Bandwidth-aware: every screen must work on a 3G phone in rural Nigeria. African and Asian dioceses are first-class users, not pilots.

6. **Open infrastructure.** Lumen's protocols (parish vitality index, charity-flow schema, multilingual liturgy data) are publishable open standards. Other denominations and faiths can build on them. We are not building a moat; we are building a road.

7. **Privacy as sacred trust.** Sacramental records, confession scheduling, pastoral counseling — anything touching the conscience — receives end-to-end encryption and zero-knowledge architecture. The system itself cannot read what a priest cannot share.

8. **Reverence in the interface.** No gamification of prayer. No streaks for confession. No leaderboards for charity. Beauty, silence, and restraint in design — the opposite of the attention economy. Inspirations: traditional missal typography, the white space of a chapel, Rams' "less but better."

9. **Honest about the past, focused on the future.** When users ask about historical harm — colonialism in mission lands, abuse cases, financial scandals — Lumen answers truthfully with sourced facts and links to acknowledgments by the Church itself (e.g., John Paul II's *Tertio Millennio Adveniente* apologies, the 2022 Canadian Indigenous apology). No spin. No defensiveness. No foregrounding either — just available, when asked.

---

## 3. The three-layer architecture

### 3a. Lumen / Faithful (consumer app)

**Job-to-be-done:** "I want to live my faith more fully, with less friction, in community, today."

**Primary surfaces:**

- **Now** — a single screen that answers "what should I do next?" Based on time of day, liturgical calendar, user state. Examples:
  - 6:42am Wednesday of Holy Week → "Tenebrae at St. Brigid's, 7pm, 4 min walk. The reading is Isaiah 50 — here's a 90-second reflection."
  - 11:55pm Saturday → "Confession at three parishes within 15 min tomorrow morning. Want a 5-minute examination of conscience to prep?"
  - Lent Day 19 → "You set an intention to call your father. It's 5:30pm his time. Want me to draft an opener?"

- **Mass Finder** — every Mass within 50km, in every language offered, with confession times, accessibility info, livestream links, and crowd-source-corrected schedules. Beats GoogleMaps + masstimes.org combined on latency and accuracy.

- **Pray** — Liturgy of the Hours with audio in your liturgical preference (Novus Ordo / Extraordinary Form / Eastern), Rosary with optional guided reflection, daily readings with patristic + magisterial commentary, examination of conscience generator (private, never stored).

- **Learn** — Catechism-grounded AI tutor. Every claim sourced to CCC paragraph, Scripture verse, magisterial document, or saint's writing. If a question crosses into disputed theological territory, model says so and presents the range of legitimate Catholic positions. Refuses to play priest — for personal moral questions about the user's own life, recommends sacrament/spiritual direction.

- **Serve** — a list of needs from your parish, diocese, and global Caritas operations, sortable by what you can give (money / time / skill / object). One-tap recurring micro-donations with full receipt and outcome tracing. "You gave $3 a week for 18 weeks. That paid for 4 weeks of school lunches for Maria in Honduras. Here's her teacher's quarterly note."

- **Connect** — small-group matching (faith-sharing groups, young adult, marriage prep, men's/women's groups, addiction recovery, grief). Hosted by parish, verified, with safe-environment checks for any group involving minors.

- **Confess** — confession scheduling at any parish in your area (priest-controlled availability), guided examination tailored to your state in life, optional anonymous "ask a priest a question" routed to a real priest who volunteers time.

- **Listen** — homily recap and full audio for any Mass you missed, in the language of your choice (auto-translation), with one-tap "discuss this with my group."

- **Threshold** — explicitly for the un-churched and lapsed. No login required. Answers honest questions ("Why are there still pedophile priests?" "What did the Church do during colonialism?" "What do you actually believe about hell?"). Sourced, calm, non-evangelizing. If they ask to take a next step, *then* offer it.

**Kahneman applications (do not mention in UI):**
- Default opt-in to round-up-the-change charity at checkout-style moments.
- Friction reduced to one tap on the things that matter (find Mass, book confession, give).
- Peak-end: post-Mass screen prompts a brief moment of gratitude + one-tap "send this peace to someone you love."
- Loss aversion: surface what you'd miss, not what you'd gain ("If you skip this week, you'll have missed 3 in a row — most people who hit 4 don't come back for a year").
- Commitment devices: Lent / Advent goals with social accountability (opt-in only, no public shaming).

### 3b. Lumen / Parish (priest + staff app)

**Job-to-be-done:** "Give me back the 15 hours/week I lose to admin and bottlenecks so I can be a pastor, not a paperwork-priest."

**Primary surfaces:**

- **Pastoral CRM** — every parishioner with their sacramental history (privacy-gated), recent engagement, life events, and pastoral flags. "Maria Gonzalez — daughter's First Communion is in 6 weeks, husband lost his job last month per a quiet remark to Deacon John, hasn't been to Mass in 3 weeks. Suggested action: a phone call." Surfaces care, doesn't surveil.

- **Homily Co-Pilot** — for the coming Sunday: the lectionary readings, patristic commentary, current Magisterium documents touching the themes, what other priests in your diocese are likely emphasizing (so you can complement, not duplicate), and a draft starter calibrated to your parish's demographic mix and known concerns. *Always a draft, never a script.* The priest is the homilist.

- **Sacramental Records** — digitized baptism / confirmation / marriage / death registers with cross-parish lookup. Privacy-gated. End-to-end encrypted. Easier for a family in Ohio researching their grandparents' Polish village records than a national archive.

- **Schedule** — Masses, confessions, weddings, funerals, baptisms, anointings, meetings, school events. Auto-syncs to Faithful app. Multilingual auto-publish.

- **Vocations** — quiet pipeline. Identifies parishioners showing signs of discernment (volunteer patterns, engagement with formation content) — only the pastor sees this, only as a prompt to *invite a conversation*, never as a metric.

- **Charity Ops** — incoming needs (food pantry, rent assistance, immigration support), outgoing resources, volunteer matching, partner agency coordination, full audit trail.

- **Facilities** — energy use, accessibility audit, deferred maintenance, capital campaign status, scheduling conflicts. Optional AI suggestions on energy savings, ADA improvements.

- **Bulletin** — auto-drafts the weekly bulletin from the week's data, in every language the parish needs. Pastor approves with one tap.

- **Multilingual Mass** — real-time captioning of readings and homily into the languages present in the congregation, displayed on phones for those who want them. Optional.

**The hard rule:** every screen has a "Talk to a human" button that pages the right person (DRE, deacon, social worker, lawyer, accountant) — Lumen never lets a parishioner fall into an AI loop.

### 3c. Lumen / Diocese (leadership dashboard)

**Job-to-be-done:** "Show me where my diocese is alive, where it's dying, where the money is needed, and where I should put my next priest."

**Primary surfaces:**

- **Parish Vitality Index** — a live, multi-factor index per parish: Mass attendance trend, sacramental rates (baptisms, confirmations, marriages, funerals — births minus deaths is a real metric), volunteer engagement, financial health, demographic match to surrounding community, vocation pipeline, charity throughput. Flags red, yellow, green. The bishop sees not just "this parish is dying" but *why* and *what intervention worked in a comparable parish elsewhere*.

- **Resource Flow Map** — visualize charity dollars in and out of every parish, every diocesan agency, every Caritas partner. Click to drill into outcomes. Surface inefficiencies and surplus/deficit pairings ("These three parishes have surplus food pantry capacity; these two have unmet demand; here's the route").

- **Vocations Forecasting** — discernment cohort tracking (anonymized), seminary pipeline, projected priest count vs. projected parish need 10 years out. *Used to make planning decisions, never to evaluate individuals.*

- **Global Solidarity Console** — when a disaster hits (earthquake, war, famine), Caritas / CRS / local diocesan response coordinated through one console. Real-time logistics, donor matching, parish-level appeals globally. *This is the killer feature.*

- **Catechesis Rollout** — which parishes have implemented which formation programs, which are working, which need help.

- **Safeguarding Compliance** — every parish's safe-environment training status, background check currency, audit trail. Non-negotiable. Visible to bishop in real time.

- **Honest Map** — historical sites where the Church has acknowledged harm (mission lands, abuse cases, restitution status). Internal use, for leadership planning of ongoing reparative work. Public-facing version available on the Faithful Threshold module.

---

## 4. The AI thesis (don't be vapid here)

"AI for the Church" can mean nothing or everything. Be specific.

**Where AI does serious work:**

- **Translation, in real time, across all liturgical and pastoral surfaces.** This alone justifies the platform.
- **Pastoral inference** — surfacing who needs a visit, who is showing signs of crisis, who is ready to be invited deeper. Always a *prompt to the human pastor*, never an autonomous action.
- **Homily preparation** — research, structure, demographic-aware framing. Never the homily itself.
- **Charity matching and outcome tracing** — match donor capacity to specific verified needs, then audit-trail the outcome back. This is graph-and-flow AI, not language AI.
- **Resource optimization across parishes and dioceses** — surplus food, vestments, equipment, even priest sabbatical coverage. Operations research.
- **Catechism Q&A** — RAG over CCC, Vatican II documents, encyclicals, magisterial corpus, Doctors of the Church. *Strict citation*. Refuses to opine where the Magisterium hasn't.
- **Liturgical calendar reasoning** — fully aware of universal and proper calendars, transferred feasts, ranks, color, etc. Solves a real problem for hybrid parishes.
- **Demographic and geo-intelligence** — where are unmet Catholics? Where is the diocese under-serving immigrants? Where could a new parish go?
- **Safeguarding pattern detection** — anomaly detection on adult-minor contact patterns, surfaced to the diocesan safe-environment coordinator. Highest care here.

**Where AI must not go:**

- The sacraments themselves (see Principle #2).
- Spiritual direction or moral discernment of the user's own life (recommend a priest/spiritual director).
- Anything that could simulate or substitute for a confessor.
- Generating "the Pope's opinion" or putting words in the mouth of any living or deceased Church figure.
- Generating sacred art that could be venerated without disclosure. AI-assisted aids are fine; AI-generated devotional images presented as devotional are not.

---

## 5. Tech stack

Default to this unless you have a specific reason to change:

- **Frontend (Faithful):** Next.js 14 (App Router), React Server Components, Tailwind, shadcn/ui. PWA-first, native shells (Capacitor) for App Store / Play Store presence later.
- **Frontend (Parish & Diocese):** Next.js 14 in the same monorepo, separate routes/apps. Heavy on data tables, charts (Recharts or Visx), maps (MapLibre + open tiles to avoid Google fees in Global South).
- **Backend:** TypeScript, Node 20, Hono or Fastify, deployed on Cloudflare Workers + D1 (cheap, edge, globally distributed — important for Global South latency) OR Postgres on Neon if relational complexity demands it. Choose Cloudflare-first; escalate to Postgres only when joins force the issue.
- **AI layer:** Anthropic Claude (you) as primary model. OpenAI/Gemini fallback. Use Anthropic's tool use / agents for the pastoral co-pilot. RAG over a Catholic doctrinal corpus stored as embeddings (pgvector or Cloudflare Vectorize). Strict citation enforcement.
- **Auth:** Clerk or Auth.js. Anonymous-first for the Threshold module — no login wall in front of seekers.
- **Storage:** Cloudflare R2 for sacramental record scans, homily audio, etc. Encrypted at rest.
- **Observability:** OpenTelemetry → Honeycomb or Datadog.
- **Encryption:** libsodium for the sacramental-record and confession-prep modules. Zero-knowledge where the user is the only keyholder.
- **i18n:** next-intl. All copy externalized from commit #1 — even Phase 1.

**Monorepo:** pnpm workspaces, Turborepo.

---

## 6. Project structure (build this exact tree first)

```
lumen/
├── apps/
│   ├── faithful/                 # Next.js — consumer
│   ├── parish/                   # Next.js — priest/staff
│   ├── diocese/                  # Next.js — bishop/chancery
│   └── api/                      # Hono on Cloudflare Workers
├── packages/
│   ├── ui/                       # shadcn-based shared design system
│   ├── liturgy/                  # liturgical calendar engine
│   ├── catechism-rag/            # doctrinal corpus + retrieval
│   ├── charity-graph/            # donor → need → outcome graph
│   ├── vitality/                 # parish vitality index calculation
│   ├── i18n/                     # all locale files
│   ├── schema/                   # shared TypeScript types + Zod
│   └── auth/                     # shared auth helpers
├── infra/
│   └── cloudflare/               # wrangler configs, D1 migrations
├── docs/
│   ├── PRINCIPLES.md             # copy §2 here verbatim
│   ├── ARCHITECTURE.md
│   ├── AI_GUARDRAILS.md          # the "must not go" list from §4
│   └── ROADMAP.md
└── README.md
```

---

## 7. Design system

- **Color:** warm whites, deep sanctuary blues, brass/gold for accent, oxblood for liturgical reds. No pure black, no pure white. Take cues from Romanesque + Cistercian aesthetics — restrained, weighty, calm. Default to high contrast for accessibility.
- **Type:** a humanist serif for body (e.g., Source Serif Pro or Cormorant), a sturdy sans for UI (Inter or IBM Plex Sans), and *one* liturgical display face used sparingly (Trajan-adjacent, but free — try Cinzel or Cormorant SC). The display face is for moments of reverence (the Mass entry screen, the post-confession screen) — not navigation.
- **Motion:** slow, deliberate, asymmetric. No bouncy springs. Easing curves that resemble bells decaying, not iOS rubber band.
- **Sound (optional):** sparse — a single bell on prayer-time alerts, configurable, off by default.
- **Iconography:** thin-line, geometric, drawing on traditional iconographic shorthand (chi-rho, alpha-omega, fish, anchor) used as accent, not gimmick. Lucide is fine for UI chrome.
- **Whitespace:** generous. The interface should feel like a chapel, not a feed.

---

## 8. Data model (sketch — refine in `packages/schema`)

Core entities:

- `Person` — a user. May be anonymous (Threshold visitor), parishioner, volunteer, staff, religious, deacon, priest, bishop. Sacramental history (encrypted), preferences, language, locale.
- `Parish` — physical site. Address, languages, Mass times, confession times, accessibility, vitality index, current campaigns.
- `Diocese` — collection of parishes. Bishop, chancery contacts, charity arms.
- `LiturgicalCalendar` — a date-driven engine producing reading sets, rank, color, proper feasts (universal + local).
- `Need` — surfaced charitable need. Parish-scoped or diocese-scoped or global. Has lifecycle: surfaced → funded → in-progress → completed → audited.
- `Gift` — donation from a Person to a Need (or general fund). Traceable to outcome.
- `Outcome` — what the Gift accomplished. Verified by parish/diocese signature.
- `Encounter` — Mass attended, confession booked, group joined, homily listened to. Used (with consent) for the Now screen.
- `SafeguardingRecord` — training, background check, audit log. Diocese-managed.
- `Citation` — every AI answer carries a list of these. Required.

---

## 9. Phase 1 (the MVP — ship this in 8–10 weeks)

Build *one* parish end-to-end before you build the platform. Pick a real one (or simulate one with realistic data). Get these working:

**Faithful app — Phase 1:**
- [ ] Mass Finder for one diocese (real data, 50–200 parishes)
- [ ] Now screen with 3 hard-coded contextual prompts (Mass time, confession reminder, daily reading)
- [ ] Pray module: today's readings + Rosary with audio + Liturgy of the Hours (lite)
- [ ] Learn module: Catechism RAG, citation-strict, English + Spanish
- [ ] Serve module: 5 real needs from the pilot parish, one-tap give, outcome shown after 30 days
- [ ] Threshold landing page — no login, three honest questions answered

**Parish app — Phase 1:**
- [ ] Pastor login
- [ ] Pastoral CRM with import from existing parish management system (ParishSOFT, Pushpay)
- [ ] Homily Co-Pilot for next Sunday
- [ ] Schedule editor that publishes to Faithful
- [ ] Charity Ops list of current needs + status

**Diocese app — Phase 1:**
- [ ] Single dashboard with vitality index for all pilot parishes
- [ ] Resource flow map (charity in/out for current month)
- [ ] One real disaster-response drill in the Global Solidarity Console (use a real Caritas appeal as data)

**Shared:**
- [ ] All copy in English + Spanish from day one
- [ ] Safeguarding compliance gate on any minor-touching feature
- [ ] Citation enforcement on every AI output
- [ ] PWA installable, offline-capable for core Pray and Mass Finder features

---

## 10. Phase 2 and beyond (don't build until Phase 1 is real)

- Add 8 more languages.
- Native apps via Capacitor.
- Confession scheduling live.
- Sacramental records digitization (huge — needs careful diocesan partnership).
- Vocations module.
- Multilingual real-time Mass captioning.
- Patrick the AI tutor for confirmation prep (named, scoped, supervised).
- Open-protocol publishing of vitality index and charity-flow schema.
- Partnership API for Caritas, CRS, and 15+ national bishops' conferences.
- Eastern Catholic and Ordinariate liturgical calendars.
- Ecumenical extensions (Lutheran, Anglican, Orthodox) — opt-in.

---

## 11. Premortem — failure modes to design against

Before building, internalize how this dies. Each is paired with the design response.

| Failure mode | Design response |
|---|---|
| "AI for Church" feels gimmicky / tech-bro | Reverence in interface (§7). Restraint. No streaks, no badges, no leaderboards. |
| Theological errors in AI output | Strict RAG with citation enforcement; refuses to opine outside Magisterium. AI_GUARDRAILS.md is a hard gate. |
| Substitutes for sacrament | Principle #2 baked into UX copy *and* code-level guards. AI literally refuses to "absolve" or "consecrate." |
| Used as surveillance tool by bad pastor | Pastoral CRM access logs visible to the parishioner. Parishioner can see who looked at their record. |
| Used as PR cover for unaddressed harm | Threshold module is honest and sourced. Principle #9. |
| Global South treated as afterthought | Multilingual + bandwidth-aware from commit #1. Lagos and Manila are first-class. |
| Diocesan IT can't deploy / integrate | Cloud-first, no on-prem requirement. ParishSOFT / Pushpay / Realm import adapters in Phase 1. |
| Bishop blocks adoption out of caution | Subsidiarity by design — every feature can be turned off at the parish or diocesan level. |
| Vatican concerns about doctrine | Citation enforcement; doctrinal advisory board (real theologians, not just clergy) wired into release process. |
| Privacy breach involving sacramental data | End-to-end encryption; zero-knowledge architecture; the system itself cannot read confession-prep content. |
| Charity flows revealed to be inefficient | Good. Transparency *is* the product. We surface it, others fix it, and the credibility of the whole network rises. |
| Looks too Catholic for the curious / lapsed | Threshold module is the front door, no login, secular-readable, sourced and calm. |

---

## 12. Hard stops — when to ask the co-founder before proceeding

Don't decide these alone. Stop and ask.

1. Anything that touches sacrament logic or wording.
2. Anything that involves money flow (donations, fees, refunds, payment processors).
3. Choosing the doctrinal advisory board / theologian reviewers.
4. The first pilot parish and diocese.
5. Partnership outreach to Caritas, CRS, or any bishops' conference.
6. Any change to the founding principles in §2.
7. Any feature that involves minors beyond the safe-environment gate already specified.
8. Branding and name (LUMEN is the working name — confirm before logo/domain).
9. The Threshold module's specific answers to historically-loaded questions — every answer reviewed before ship.
10. AI behavior on edge cases: suicidality, abuse disclosure, addiction, marital crisis. We need crisis-resource routing, not AI counseling.

---

## 13. Acceptance criteria for Phase 1

Phase 1 is shippable when:

- [ ] A real parishioner in the pilot parish can find Mass, give to a need, see the outcome 30 days later, and read tomorrow's reading — all in their language, on a low-end Android.
- [ ] The pastor of the pilot parish saves 5+ hours of admin in their first week using Parish.
- [ ] The bishop can pull up Diocese on Monday morning and see, at a glance, which of his parishes need attention this week.
- [ ] Every AI response carries a citation that resolves to a real source.
- [ ] Safeguarding compliance gates every minor-touching feature.
- [ ] All Phase 1 surfaces work in English and Spanish.
- [ ] All Phase 1 surfaces score AAA on Lighthouse a11y.
- [ ] The Threshold page answers three honestly-difficult questions with sourced, calm, non-defensive responses.
- [ ] No streaks, badges, leaderboards, or push-notification dark patterns anywhere in the product.

---

## 14. First commands when you start

```bash
# Initialize the monorepo
pnpm init
pnpm dlx create-turbo@latest

# Scaffold the three apps and the api
pnpm dlx create-next-app@latest apps/faithful --typescript --tailwind --app
pnpm dlx create-next-app@latest apps/parish   --typescript --tailwind --app
pnpm dlx create-next-app@latest apps/diocese  --typescript --tailwind --app
mkdir -p apps/api && cd apps/api && pnpm init && pnpm add hono

# Drop §2 Principles into docs/PRINCIPLES.md verbatim
# Drop §4 "must not go" list into docs/AI_GUARDRAILS.md verbatim
# Drop this whole file into docs/MASTER_PROMPT.md for future sessions

# Then: build the Faithful Now screen first. It's the single best demo surface.
```

Build the Now screen first. If it lands — calm, reverent, useful at 6:42am Wednesday of Holy Week — the rest of the platform falls into place behind it.

---

## 15. One final note from the co-founder

We're not building a "Catholic app." We're building the operational nervous system of the most-distributed charitable network in human history, at the moment when AI makes that network legible to itself for the first time. The product that does this well doesn't shout. It quietly removes friction between people and the things that give their lives meaning.

If you do this right, in five years there's a kid in Lagos whose family found Lumen because of a Caritas food appeal, who used Threshold to ask honest questions, who's now in a parish small group, who never feels the seams of the technology that brought him there. That's the win. That's the only win.

Build accordingly.

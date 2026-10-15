# Roadmap

## Phase 1 — MVP (8–10 weeks)

Build *one* parish end-to-end before building the platform. Pilot diocese: TBD (Hard Stop #4). Demo data: Archdiocese of New York public parish list.

### Faithful
- [x] App scaffold (Next.js, App Router, Tailwind, PWA)
- [x] Now screen — real-time liturgical context + 3 contextual prompts + demo-time mode
- [ ] Mass Finder (NYC parishes, real Mass times)
- [ ] Pray — today's readings, Rosary with audio, Liturgy of the Hours (lite)
- [ ] Learn — Catechism RAG, citation-strict, en + es
- [ ] Serve — 5 real needs from pilot parish, one-tap give, outcome traced
- [ ] Threshold — three honest questions, sourced, no login

### Parish
- [ ] App scaffold
- [ ] Pastor login
- [ ] Pastoral CRM (with ParishSOFT / Pushpay / Realm importers)
- [ ] Homily Co-Pilot for next Sunday
- [ ] Schedule editor → publishes to Faithful
- [ ] Charity Ops list

### Diocese
- [ ] App scaffold
- [ ] Vitality Index dashboard (all pilot parishes)
- [ ] Resource Flow map
- [ ] Solidarity Console — one real Caritas appeal drill

### Cross-cutting
- [x] en + es from day one (i18n keys structured)
- [ ] Safeguarding gate on every minor-touching feature
- [x] Citation enforcement on every AI output (runtime check in `@lumen/catechism-rag`)
- [x] PWA-installable, offline-capable for Now + Pray + Mass Finder
- [ ] AAA Lighthouse a11y on every shipped surface

## Phase 1 acceptance criteria

- [ ] Real parishioner in pilot parish can find Mass, give to a need, see outcome 30 days later, read tomorrow's reading — in their language, on a low-end Android.
- [ ] Pastor saves 5+ hours of admin in first week using Parish.
- [ ] Bishop sees, at a glance, which parishes need attention this week.
- [ ] Every AI response carries a resolvable citation.
- [ ] No streaks, badges, leaderboards, or push-notification dark patterns anywhere.

## Phase 2 (do not start until Phase 1 is real)

- 8 more languages (Portuguese, French, Tagalog, Igbo, Swahili, Vietnamese, Arabic, Mandarin, Polish)
- Native apps via Capacitor
- Confession scheduling live
- Sacramental records digitization
- Vocations module
- Multilingual real-time Mass captioning
- Open-protocol publishing (vitality index, charity-flow schema)
- Partnership API for Caritas, CRS, bishops' conferences
- Eastern Catholic + Ordinariate liturgical calendars
- Ecumenical extensions (opt-in)

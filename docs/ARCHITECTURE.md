# Architecture

Three Next.js apps + one Cloudflare Worker API, sharing eight packages, one schema, one design system, one liturgical engine.

## Apps

| App | Audience | Job-to-be-done | Phase 1 surfaces |
| --- | --- | --- | --- |
| `apps/faithful` | Parishioners, lapsed, seekers | "What should I do next?" | Now · Mass Finder · Pray · Learn · Serve · Threshold |
| `apps/parish` | Priests, deacons, staff, volunteers | "Give me back 15 hours/week" | Pastoral CRM · Homily Co-Pilot · Schedule · Charity Ops |
| `apps/diocese` | Bishops, chanceries | "Show me where my diocese is alive" | Vitality Index · Resource Flow · Solidarity Console |
| `apps/api` | All apps + partners | Single source of truth | Hono on Cloudflare Workers + D1 |

## Packages

| Package | Purpose |
| --- | --- |
| `@lumen/ui` | shadcn-based design system. Tokens, primitives, motion. |
| `@lumen/liturgy` | Liturgical calendar engine — computus, seasons, ranks, color, readings. |
| `@lumen/catechism-rag` | Doctrinal corpus retrieval. CCC, Vatican II, encyclicals, Doctors. Strict citation. |
| `@lumen/charity-graph` | Donor → Need → Outcome graph. Audit-trail-first. |
| `@lumen/vitality` | Parish vitality index calculation. Multi-factor, time-windowed. |
| `@lumen/i18n` | `next-intl` catalogs. en + es from day one; 10 more in Phase 2. |
| `@lumen/schema` | Zod types shared across apps. `Person`, `Parish`, `Need`, `Gift`, `Citation`, … |
| `@lumen/auth` | Auth helpers (Clerk / Auth.js). Anonymous-first for Threshold. |

## Data model (sketch — formal types live in `@lumen/schema`)

```
Person ── attends ──▶ Parish ◀── of ── Diocese
   │                    │              │
   │                    └─ surfaces ─▶ Need ◀── verifies ── Outcome
   │                                    ▲                    │
   └────── Gift ────────────────────────┘                    │
                                                              │
   Encounter (Mass / confession / group / homily)             │
   SafeguardingRecord (training / background / audit)         │
   Citation (every AI output)  ─────────────────────────────▶ ─┘
```

## Privacy boundaries

- **Server can read:** parish directory, public liturgical data, donations metadata, outcomes.
- **Server cannot read:** confession-prep content, examination of conscience, spiritual direction notes, sacramental record contents. End-to-end encrypted via libsodium; key derived client-side.
- **Pastor can read (gated):** sacramental history of own parishioners. Every access logged and visible to the parishioner.
- **Bishop can read (aggregated):** vitality, charity flows, safeguarding compliance. Never individual conscience data.

## AI invocation contract

Every AI call goes through `@lumen/catechism-rag/invoke()` which:
1. Routes to Anthropic Claude (primary) or fallback provider.
2. Returns `{ text: string, citations: Citation[] }`.
3. Passes the text through `sacrament-substitution-refuser` before returning.
4. Logs the call (without PII) for audit + cost.

If a caller wants AI without citations, refactor the caller. There are no exceptions.

## Deployment (Phase 1)

- Apps: Vercel for fastest dev loop. Move to Cloudflare Pages when first Global South latency complaint lands.
- API: Cloudflare Workers (`infra/cloudflare/`). D1 for relational, R2 for blobs, Vectorize for embeddings.
- Observability: OpenTelemetry → Honeycomb (Phase 2).

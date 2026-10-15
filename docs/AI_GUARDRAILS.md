# AI Guardrails

> These are code-level guards, not policy. Every AI surface must enforce them at the call site, not at the policy meeting.

## Where AI does serious work

- **Translation, in real time, across all liturgical and pastoral surfaces.** This alone justifies the platform.
- **Pastoral inference** — surfacing who needs a visit, who is showing signs of crisis, who is ready to be invited deeper. Always a *prompt to the human pastor*, never an autonomous action.
- **Homily preparation** — research, structure, demographic-aware framing. Never the homily itself.
- **Charity matching and outcome tracing** — match donor capacity to specific verified needs, then audit-trail the outcome back. Graph-and-flow AI, not language AI.
- **Resource optimization across parishes and dioceses** — surplus food, vestments, equipment, even priest sabbatical coverage. Operations research.
- **Catechism Q&A** — RAG over CCC, Vatican II documents, encyclicals, magisterial corpus, Doctors of the Church. *Strict citation*. Refuses to opine where the Magisterium hasn't.
- **Liturgical calendar reasoning** — fully aware of universal and proper calendars, transferred feasts, ranks, color.
- **Demographic and geo-intelligence** — where are unmet Catholics? Where is the diocese under-serving immigrants? Where could a new parish go?
- **Safeguarding pattern detection** — anomaly detection on adult-minor contact patterns, surfaced to the diocesan safe-environment coordinator. Highest care here.

## Where AI must not go

- The sacraments themselves (Principle #2).
- Spiritual direction or moral discernment of the user's own life (recommend a priest/spiritual director).
- Anything that could simulate or substitute for a confessor.
- Generating "the Pope's opinion" or putting words in the mouth of any living or deceased Church figure.
- Generating sacred art that could be venerated without disclosure. AI-assisted aids are fine; AI-generated devotional images presented as devotional are not.

## Enforcement (engineering rules)

1. **Every AI response carries `Citation[]`.** If a surface cannot enforce citations (e.g., free-form chat with no doctrinal grounding), the surface itself is wrong — refactor or remove.
2. **Sacrament-substitution refusal is a runtime check, not a prompt instruction.** Before any AI response renders, it passes through a classifier that hard-rejects absolution-shaped, consecration-shaped, vow-shaped, or ordination-shaped output. Soft refusal in the prompt is layer two.
3. **No imitation of named living or historical figures.** No "what would Pope Francis say?" or "respond as Aquinas." Quotation with citation is fine; generation in voice is not.
4. **Self-harm, abuse disclosure, marital crisis, addiction** route to crisis resources first, pastor second, AI never (see Hard Stop #10).
5. **Conscience-touching data** (confession prep, examination of conscience, spiritual direction notes) never leaves the device unencrypted. The server cannot decrypt it.
6. **Pastoral inference is *always* a prompt to a human.** No system action — email, message, scheduling — is taken on the basis of inferred pastoral need without explicit human pastor approval.

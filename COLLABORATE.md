# Collaborate on LUMEN

LUMEN serves one problem family: unsafe and unaccountable AI. This
page lists concrete, scoped ways an organization can work with the
project. Every task here is real and completable. Nothing on this
page implies an existing partnership; collaborations are
invitations until they actually happen, and no partner is named
publicly without their written agreement.

## Who this is for

Any institution deploying AI under trust obligations (health,
education, faith, and public sector bodies), plus AI vendors whose
systems need refusal behavior they can demonstrate rather than
assert.

## Sized tasks

1. **Adopt the guardrail policy layer.** Take the refuser pattern
   (a runtime output check, independent of prompts) and the case
   set format, and apply them to your own domain's non-negotiables:
   the outputs your system must never produce, whatever a user asks
   or a model drifts into. We want your deployment notes, honest
   ones, published as a case study with your approval.
2. **Contribute refusal test cases.** Add cases to
   `packages/catechism-rag/demo/eval_cases.json` from your domain:
   outputs that must be blocked, outputs that must be allowed, and
   the borderline quotations where your institution has to choose a
   tradeoff. Borderline cases are reported, not scored, and the
   reasoning is the contribution.
3. **Publish your eval results against the shared refusal suite.**
   Run the suite against your own guardrail implementation and
   publish the artifact next to ours. Suites improve when more than
   one implementation is measured against them.

## What you get

A public, dated record in this repository: the case study, the
contributed cases with the eval rerun, or your published results,
with your organization's role stated as you approve it.

## Start

Open an issue in this repository describing the task you have in
mind and the trust obligation behind it. Small and specific beats
grand and vague.

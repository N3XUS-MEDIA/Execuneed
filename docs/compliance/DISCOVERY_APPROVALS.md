# Discovery marketing approval register

`docs/compliance/RULES.md`: any page naming a Discovery product or benefit
needs Discovery Marketing Support sign-off before it goes live, and the
approval reference has to be stored.

This is that record. It is also the thing a key individual will ask for.

## How the gate works

Two places carry gated copy: the product categories in
`apps/web/src/content/products.ts`, and the journal articles in
`apps/web/src/content/journal/`. Both use the same field names and the same
component, so there is one rule to remember rather than two.

Each category in `apps/web/src/content/products.ts` carries two fields:

| Field | Renders | Contains |
|---|---|---|
| `need`, `covers`, `who` | always | the client's problem and what a review covers — no product named, no benefit claimed |
| `claims` | only via `NeedsApproval` | plan names, benefits, discounts, premiums |
| `approvalRef` | — | the Marketing Support reference that unlocks `claims` |

`NeedsApproval` is keyed on the reference string, not a boolean, precisely so
that nobody can enable a claim by flipping a flag. With `approvalRef: null` the
claims do not render at all — a fallback tells the reader an adviser can talk
them through it.

**Nothing here is copied from discovery.co.za.** That copy is Discovery's, and
adviser sites reusing it is what these rules exist to prevent. The taxonomy is
from the practice's own brief; the wording is ours.

## Register

| Category | `approvalRef` | Status | Requested | Approved by | Date |
|---|---|---|---|---|---|
| Medical aid and gap cover | — | Not requested | — | — | — |
| Life, income and severe illness | — | Not requested | — | — | — |
| Retirement and investments | — | Not requested | — | — | — |
| Car and home | — | Not requested | — | — | — |
| Banking and Vitality | — | Not requested | — | — | — |
| Employers and group benefits | — | Not requested | — | — | — |

### Journal articles

| Article | `approvalRef` | Status | Requested | Approved by | Date |
|---|---|---|---|---|---|
| How Discovery integration works | — | Not requested | — | — | — |

`how-discovery-integration-works` is the one article on the site whose whole
subject needs approval. It is published with its body deliberately empty and an
explanation of why — see `apps/web/src/content/journal/articles-gated.ts`. The
eight other articles carry no product claim at all and their `claims` arrays are
empty for that reason rather than because approval is pending.

Nothing has been submitted, because `docs/product/CLIENT_ANSWERS.md` still has
no Discovery Marketing Support contact.

## To publish product detail for a category

1. Write the claim lines into `claims` on that category. Keep them factual.
2. Send them to Discovery Marketing Support (Adviser 360) for review.
3. On approval, record the reference in `approvalRef` **and** in the table
   above with who approved it and when.
4. Deploy. The claims render; nothing else changes.

To withdraw, set `approvalRef` back to `null`. The claims stop rendering
immediately and the fallback returns.

## Not yet built

A `ContentApproval` table — source, version, approvedBy, approvedAt,
discoveryTicketId — is `P2-L-039`. Until then this file plus the values in
`products.ts` are the register, and both are in version control, so the
approval history is the git history.

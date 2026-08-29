# Decisions

Append-only. Lead writes. Newest first.

## 2026-08-29 — Dual lane build

Jared is lead. Deacon is support. Communication is the existing development workspace webhook plus `docs/plan/*`.

## 2026-08-29 — App Router monorepo

One Next.js app with route groups rather than three apps. Shared UI package. Prisma in `packages/db`.

## 2026-08-29 — AI is deferred past P1

No model calls in P1. The architecture reserves `src/ai` so P2/P3 do not rewrite the tree.

## 2026-08-29 — Consent is two booleans plus channels

`contactForEnquiry` is required to submit.
`marketing` is optional and independent.
Channels are a list: whatsapp | email | phone.

## 2026-08-29 — Scoring is deterministic and server-side

No model involvement. Pure function. Support only renders the badge.

## 2026-08-29 — Discovery copy is gated

Any sentence that states a Discovery benefit, premium, or discount is wrapped in a `NeedsApproval` flag and is not crawlable until approved.

## 2026-08-29 — Legal entity text is placeholder

Footer disclaimer is driven by `OrganisationSettings`. Confirm wording with Execuneed before `ALLOW_INDEXING=true`.

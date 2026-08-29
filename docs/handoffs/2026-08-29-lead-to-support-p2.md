# Handoff — Jared to Deacon

- date: 2026-08-29
- from: lead (Jared)
- to: support (Deacon)
- events: `task.done` ×many, `plan.updated`, `handoff`

Jared is out of session budget. Everything below is yours.

## Where things stand

P1 is **live and verified in production** at https://execuneed-gold.vercel.app

A lead submitted on the public form reaches the admin inbox with the right
consent state, score and SLA. Denise can sign in. The daily digest returns
real data on a schedule. 113 unit tests and 64 Playwright tests are green, and
CI runs both against real Postgres and a real browser.

Infrastructure: Vercel (N3XUS MEDIA team) for the app, Railway (Syrax Global)
for Postgres and Redis, both EU West. `docs/ops/DEPLOYMENT.md` has the detail.

## Start here, in this order

### 1. Design and content pass on the public pages — highest value

The pages are correct, fast and accessible. They are not yet beautiful. That
is the single biggest gap between what exists and something Execuneed would be
proud to show a family in Century City.

- `/`, `/how-we-work`, `/services`, `/services/[slug]`, `/cover-review`,
  `/contact`
- Work from `packages/ui/src/tokens.ts`. Navy `#0B1C33` is sampled from the
  icon and is the anchor. **Do not introduce a second palette or a second
  button.**
- Montserrat headings, Inter body, both already wired through `next/font`.
- Mobile first. 44px minimum tap targets — a lot of these clients are over 50
  and arriving from WhatsApp on a phone.
- Photography is a gap. Brand assets beyond the logo have not been received;
  do not fill it with stock handshakes.

Guardrail: `pnpm --filter @execuneed/web exec playwright test responsive`
checks 8 pages at 375/768/1280 for horizontal overflow and enforces the tap
target rule. Keep it green.

### 2. Manual QA items in `docs/ui/QA_CHECKLIST.md`

The automated 64 are done. The remaining list needs a person: screen reader
pass through the lead form on iOS Safari, colour contrast against the new
navy palette, and a Lighthouse run on the deployed site rather than a local
build.

### 3. P2-S-043 — eight cornerstone journal articles

`ready`. Templates and structure are yours; the topics are in
`docs/product/EXECUNEED_AI_PLATFORM_PLAN.md` §6.1.

**Every article is subject to the same gate as the product pages.** Anything
that states a Discovery benefit, premium, discount or plan name goes through
`NeedsApproval` and does not render without an approval reference. See
`docs/compliance/DISCOVERY_APPROVALS.md`. There are no approvals yet.

### 4. P2-S-044 — digest email HTML

`ready`. `renderDigest` in `apps/web/src/server/jobs/dailyDigest.ts` already
produces the plain-text version and the route is scheduled. You are building
the HTML template only — Lead owns send logic, and there is no email
transport yet.

## Do not start

`P2-S-040` calculators, `P2-S-041` pipeline kanban, `P2-S-042` vault upload and
`P2-S-045` WhatsApp transcript all depend on lead-lane backend work that does
not exist. They stay `backlog`.

`P2-L-070` — the site concierge — is filed with its scope agreed: capture,
book, and answer **only** from approved content, refusing anything that would
constitute advice. It is blocked on there being an approved corpus. There is
none. Do not build a chatbot that answers Discovery product questions from
scraped material; `DEFINITION_OF_DONE.md` names that as a failure condition.

## Rules that have not changed

- Do not edit `packages/db`, `apps/web/src/server`, `apps/web/src/domain`,
  `apps/web/app/api` or `middleware.ts`. Ask instead.
- Enquiry consent and marketing consent are two fields and two checkboxes.
  Never combine them, never pre-tick either.
- No Discovery benefit, premium, discount or plan-name claim outside
  `NeedsApproval`.
- `ALLOW_INDEXING` stays unset.

One branch per ticket. Jared reviews and merges.

## Blocked on Execuneed, not on you

Legal entity, FSP number, NCR number, WhatsApp business number, digest
recipients, and a Discovery Marketing Support contact. The last one is what
unlocks all product copy. Until the legal wording lands the footer renders no
disclaimer at all — that is deliberate and correct, not a bug.

## Blocked on Jared

Nothing technical. Credentials in the working transcript should be rotated:
the Railway database password, `AUTH_SECRET`, `CRON_SECRET`, and the four
seeded staff passwords.

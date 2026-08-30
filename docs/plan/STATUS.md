# Status

Phase: **P1 live. The unblocked P2 support work is done and on production.**
Board state: P0 done, P1 hardened and live, P2 support lane complete, awaiting client answers before go-live
Last updated: 2026-08-30

> Updated by the support session. `LANES.md` assigns this file to Lead and says
> Support may not rewrite it — there is no lead session, and the numbers below
> were materially wrong about what is on production. The P1 record beneath is
> untouched; everything new is in "P2 — support lane complete".

## Focus

| Lane | Human | Focus | Status |
|---|---|---|---|
| Lead | Jared | P0 and P1 complete, deployed and verified | handed over, out of session budget |
| Support | Deacon | design pass, manual QA, P2-S-043, P2-S-044 | **done, merged, live** |

Briefs: `docs/handoffs/2026-08-29-lead-to-support-p2.md` (incoming) and
`docs/handoffs/2026-08-30-support-p2-complete.md` (current — read this one).

## P2 — support lane complete

Merged to `main` on 2026-08-30 as #21, #22, #24, #23, then `feat/structured-data`.

- **Design and content pass.** A shared layout system, tonal bands instead of a
  stack of cards, the hexagon from the icon as the site's only ornament, a nav
  that collapses below `lg`, and a mobile action bar that no longer renders
  nothing while `whatsappE164` is blank. No photography — the brand pack has
  still not arrived and stock imagery would be worse than none.
- **P2-S-043 — nine journal articles.** Seven §6.1 topics plus two. Every
  services category has an article behind it, asserted by test. The Discovery
  integration piece ships with its body empty behind `NeedsApproval`.
- **P2-S-044 — digest email HTML.** Template only; nothing in `src/server` was
  touched and nothing calls it yet.
- **Concierge launcher and its capture half** (`P2-L-070` stays open and stays
  Lead's — see TASKS).
- **Structured data and a sitemap that keeps up.** The sitemap had been listing
  five paths while sixteen were live.

Verified after merging: **150 unit and 91 Playwright tests**, CI green on the
merge commit, production deployed, `X-Robots-Tag: noindex` still set.

Lighthouse against production, not a laptop: 99 / 98 / 99 performance, 100
accessibility, 100 best practices, **CLS 0**.

### Accessibility and contrast — audited, not assumed

Contrast was measured at 375 / 768 / 1280 by compositing every text node over
its first opaque ancestor. One real failure, since fixed. The full table is in
`docs/ui/QA_CHECKLIST.md`.

A keyboard and accessibility-tree pass on the lead form found three defects,
all fixed: the submit button was not in the tab order at all, a validation
failure was announced nowhere, and optional fields had accessible names like
"Last nameOptional".

**Still open:** the VoiceOver pass on iOS Safari. It needs a handset.

## P1 live-done — verified

Every line of `DEFINITION_OF_DONE.md` §P1 live-done is covered by
`apps/web/tests/admin.spec.ts` and passing:

1. Denise opens `/admin` — redirected to `/login` when anonymous ✅
2. Signs in as `admin` ✅
3. Sees a lead created from `/cover-review` ✅
4. Enquiry consent shows as given ✅
5. Marketing consent shows true or false exactly as submitted ✅
6. Score and SLA timestamp visible ✅
7. `lead.created` audit row written ✅

Public site: footer disclaimer renders from `OrganisationSettings`; sticky
WhatsApp hides itself while no number is confirmed; legal pages are `noindex`
unconditionally; every other route is `noindex` while `ALLOW_INDEXING=false`.

## Operability — done

- `/api/cron/daily-digest` gives the digest a way to actually run. It was
  built in P1-L-016 with nothing able to trigger it, so it could never have
  reached Wayne or Denise. Secret-authenticated, constant-time compare,
  refuses outright when unconfigured. Still does not send — transport is P2.
- `vercel.json` with the build command and the weekday 07:00 SAST cron.
- Lighthouse against a real production build: 99–100 performance, 100
  accessibility, 100 best practices, CLS 0 on every public page.

## Production readiness — done

P1-L-059 to P1-L-065, added after the feature work:

- Rate limit and honeypot on the only unauthenticated write
- CSP and the security header baseline; no `unsafe-eval` in production
- Cookie notice with a real gate — absence of a decision is not consent
- `robots.txt` and sitemap gated on `ALLOW_INDEXING`
- Error, not-found and loading states that leak nothing
- Skip link
- Admin tasks page wired to `completeTaskAction`
- `docs/ops/DEPLOYMENT.md` with the go-live gate and known production limits

108 unit and integration tests, 47 Playwright tests **at the time of P1**. See
the P2 section above for the current figures.

## Not go-live ready — and why

The build is done and hardened. The **content is not cleared**.
`ALLOW_INDEXING` must stay `false` until `docs/product/CLIENT_ANSWERS.md` is
filled in. A preview deploy is fine and is what Lighthouse needs.

## Blocked on Execuneed

1. Exact legal entity name and juristic representative wording
2. FSP number and NCR number for the footer
3. Which Discovery product classes they are accredited to market
4. **The WhatsApp business number.** The value previously in `.env.example`
   looked like the landline with a `+27 61` prefix attached. It has been
   removed rather than guessed.
5. Staff emails for the digest: Wayne, Denise
6. Discovery Marketing Support contact, for the `NeedsApproval` references

## P1 is live

Verified end to end on https://execuneed-gold.vercel.app on 2026-08-29:

1. Lead submitted on the public `/cover-review` form
2. Mobile normalised to E.164 — `0825550143` became `+27825550143`
3. Score 4, computed server side
4. `contactForEnquiry` true, `marketing` **false** — not bundled
5. One timeline interaction and one `lead.created` audit row written
6. Denise signed in as `admin` and saw the lead in the inbox
7. Consent shown as "Enquiry only"; SLA due Monday 12:00, correctly rolling
   a Saturday evening enquiry over the weekend to four business hours

`/api/cron/daily-digest` returns 200 with real query results.

## Deployed

Live at `https://execuneed-gold.vercel.app`, Vercel project `execuneed` on the
N3XUS MEDIA team (Hobby). Root Directory `apps/web`, no command overrides, cron
registered at 05:00 UTC daily.

Lighthouse against the live deployment: 97–100 performance, 100 accessibility,
100 best practices, CLS 0.

Environment variables are set. Postgres and Redis are on Railway in EU West.

## Blocked on Jared

Both of these are now resolved and are kept only as a record.

- ~~Supabase `execuneed-dev` database password.~~ Postgres moved to Railway;
  local development runs against local Postgres in Docker.
- ~~A deploy target for Lighthouse.~~ Production exists and has been measured;
  see the P2 section.

## Next

The support lane has no `ready` ticket left. What remains is either blocked on
Execuneed (every item in `CLIENT_ANSWERS.md`, all of which gate
`ALLOW_INDEXING`), blocked on lead-lane work that does not exist yet
(`P2-L-033` to `P2-L-039`, which `P2-S-040`, `041`, `042`, `045` and the
answering half of `P2-L-070` all wait on), or needs a person with a handset.

`docs/handoffs/2026-08-30-support-p2-complete.md` lists the small things a lead
session could close in an hour — email transport, consent state in the digest,
and a `chat` value in the `LeadSource` enum.

## Last webhook event

`DEV_WORKSPACE_WEBHOOK_URL` is now configured (Google Chat, N3XUS Development
Workspace). Deacon's brief was posted there on 2026-08-29.

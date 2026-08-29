# Status

Phase: **P1 — foundation that can go live**
Board state: P0 done, P1 implemented and hardened, awaiting client answers before go-live
Last updated: 2026-08-29

## Focus

| Lane | Human | Focus | Status |
|---|---|---|---|
| Lead | Jared | P1-L-006 → P1-L-018 | done |
| Support | Deacon | P1-S-032 polish, design pass, review | briefed on the workspace webhook |

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

108 unit and integration tests, 47 Playwright tests.

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

- Supabase `execuneed-dev` database password, then:
  `pnpm --filter @execuneed/db exec prisma migrate resolve --applied 20260829070000_p0_baseline`
  Local development runs against local Postgres in the meantime.
- A deploy target. Lighthouse cannot be run meaningfully against `next dev`.

## Next

P2 does not unlock until P1 is live-done in production, per
`docs/dev/PHASE_UNLOCK.md`. The remaining work is content and design polish,
not features.

## Last webhook event

`DEV_WORKSPACE_WEBHOOK_URL` is now configured (Google Chat, N3XUS Development
Workspace). Deacon's brief was posted there on 2026-08-29.

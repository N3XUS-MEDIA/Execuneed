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

# Deployment and go-live

P1 runbook. Nothing here unblocks itself — the first section is a gate, not a
checklist item.

## Gate: do not deploy to a public domain until these are answered

From `docs/product/CLIENT_ANSWERS.md`, all still UNKNOWN:

1. Exact registered legal entity name
2. Which Discovery entity Execuneed is a juristic representative of, and its
   registration number
3. FSP number
4. NCR number
5. Key individual name
6. WhatsApp business number
7. Digest recipients (Wayne, Denise)

Until these are in `OrganisationSettings`, the footer renders `NEEDS_LEGAL`
placeholder text. Deploying that to a public domain publishes a financial
services site with fabricated-looking disclosures. **A preview deploy is fine
and useful** — it is `noindex`, and Lighthouse needs one.

## Environment

| Variable | Preview | Production |
|---|---|---|
| `DATABASE_URL` | Supabase `execuneed-dev` | separate production database |
| `AUTH_SECRET` | generated per environment | generated, never shared |
| `AUTH_TRUST_HOST` | `true` | `true` |
| `NEXT_PUBLIC_APP_URL` | preview URL | `https://execuneed.co.za` |
| `ALLOW_INDEXING` | **unset** | `true` only after the gate above |
| `NEXT_PUBLIC_WHATSAPP_E164` | unset | leave unset — the number comes from `OrganisationSettings` |
| `CRON_SECRET` | generated | generated, `openssl rand -hex 32` |
| `DIGEST_RECIPIENTS` | unset | Wayne and Denise, once confirmed |

Never set `AUTH_URL`. Auth.js v5 infers the host, and a hardcoded value
rewrites `req.url` inside middleware, which sends every guard redirect to the
wrong origin.

Production must use its own database. The seed writes placeholder legal text
and known-format passwords; it refuses to run when `NODE_ENV=production`, but
do not rely on that as the only barrier.

## Deploy

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm --filter @execuneed/db exec prisma migrate deploy   # NOT `migrate dev`
pnpm build
```

`migrate deploy` applies committed migrations and never generates new ones.
`migrate dev` can drop and recreate a database, which is why it is not here.

### First deploy against Supabase

The `p0_baseline` migration was applied through the Supabase API before
Prisma had a working connection string, so Prisma does not know it ran. Once
`DATABASE_URL` is set, tell it once:

```bash
pnpm --filter @execuneed/db exec prisma migrate resolve --applied 20260829070000_p0_baseline
```

Then seed the organisation row — and only the organisation row — by hand with
the confirmed legal values. Do not run `pnpm db:seed` against production.

## After deploy — verify

```bash
curl -sI https://<host>/            | grep -i x-robots-tag        # noindex until go-live
curl -sI https://<host>/            | grep -i content-security    # CSP present
curl -s  https://<host>/robots.txt                                # Disallow: / until go-live
curl -sI https://<host>/admin/leads | grep -i location            # redirects to /login
```

Then in a browser:

- Footer shows the real juristic representative wording, not `NEEDS_LEGAL`
- Submit a test enquiry; confirm it appears in `/admin/leads` with the right
  consent badge; delete it afterwards
- Sticky WhatsApp appears only once `whatsappE164` is set

## Known limits carried into production

- **Rate limiting is per instance.** In-memory fixed window. On more than one
  instance a caller gets N times the budget. Swap `rateLimit()` for Redis
  before scaling out — it is one function.
- **No email transport.** The daily digest collects, renders and is reachable
  on a schedule at `/api/cron/daily-digest`, but refuses to send. Wiring the
  transport is P2 alongside the queue. Until then the route returns the
  rendered text so it can be read and verified.
- **`CRON_SECRET` must be set** or that route returns 503. It refuses rather
  than defaulting open, because it returns yesterday's leads.
- **No error reporting service.** `logActionError` writes structured JSON to
  stdout with field names but never values. Point a log drain at it.
- **RLS is on with no policies.** Correct for a Prisma-only app. If anything
  ever talks to Supabase PostgREST directly, it will get nothing until
  policies are written deliberately.

## Scheduling

`vercel.json` declares the digest cron at 05:00 UTC on weekdays — 07:00 SAST,
before the office opens. Vercel sends the `Authorization: Bearer $CRON_SECRET`
header automatically from the project's environment.

On any other platform, call it the same way:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/daily-digest
```

## Rollback

Vercel: promote the previous deployment. Migrations are forward-only — none of
the P1 migrations drop data, so a code rollback is safe without a database
rollback. Check this again before shipping any migration that drops a column.

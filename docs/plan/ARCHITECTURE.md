# Architecture

P1 scope only unless a section is marked later.

## Surfaces

```text
(public)   marketing site, tools, lead forms
(auth)     staff and client login
(admin)    Denise, advisers, compliance, superadmin
(portal)   clients — P3
api        webhooks and server routes — Lead only
```

## Trust boundaries

| Zone | Data | AI |
|---|---|---|
| Public | name, mobile, email, suburb, intent, consents | off in P1; P2 RAG on approved public corpus only |
| Staff | households, files, notes, advice drafts | P3 drafts, never auto-send recommendations |
| Client file | that household only | never used to answer another household or the public bot |
| Compliance | audit, complaints, consents | read helpers only |

Public bot (P2+) must refuse product recommendations and premiums.

## P1 containers

- `apps/web` — Next.js App Router
- `packages/db` — Postgres + Prisma
- `packages/ui` — tokens + primitives
- object storage unused in P1 except signed-URL policy stub

## P1 data

See Prisma baseline in `packages/db/prisma/schema.prisma`.

Entities live in P1:

- User, OrganisationSettings
- Person, Household
- Lead, Consent
- Task, Interaction
- AuditEvent

Explicitly not in P1 schema: Policy, AdviceFile, Complaint, Campaign, KnowledgeChunk, CommissionEntry, WhatsApp raw tables.

## Auth

Roles:

```text
superadmin > compliance > adviser > admin > client
```

P1 staff roles: `superadmin`, `adviser`, `admin`.
`client` exists on the enum so we do not migrate later, but portal routes stay closed.

## Lead flow P1

```text
public form
  → validate (zod)
  → write Person + Lead + Consent + AuditEvent
  → score (pure function)
  → set slaDueAt
  → admin inbox
```

No WhatsApp ingest in P1. Sticky wa.me link only.

## Jobs P1

`dailyDigest` skeleton — query new leads since yesterday, send one email. No AI summary.

## Later (do not build)

P2: WhatsApp Cloud webhook, qualifier state machine, calculators, pipeline deals, vault, review job, content approval.
P3: advice files, e-sign, portal, meeting notes, staff RAG with household isolation.
P4: ads conversion, commission CSV, referrals, employer module.

## Env

Listed in `.env.example`. Secrets never committed.

## Indexing

Preview and staging send `X-Robots-Tag: noindex` unless `ALLOW_INDEXING=true`.

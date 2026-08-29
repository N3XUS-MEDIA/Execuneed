# Decisions

Append-only. Lead writes. Newest first.

## 2026-08-29 — Rate limiting is in-memory for P1

`createLeadAction` is the only unauthenticated write in the app. It is limited
to five enquiries per caller per ten minutes, with a honeypot field alongside.

The limiter is an in-memory fixed window, so it is per instance: on more than
one instance a caller gets N times the budget. That is accepted for P1. The
alternative is standing up Redis for a site that does not yet have a domain,
and the swap is a single function. `docs/ops/DEPLOYMENT.md` carries the
warning so it cannot be forgotten at scale-out.

A tripped honeypot returns success and writes nothing, so a bot cannot learn
to adapt.

## 2026-08-29 — Cookie preference lives in localStorage, not a cookie

Recording "no cookies please" by setting a cookie is absurd, and the choice
only gates client-side scripts. Nothing non-essential is loaded today; the
`analyticsAllowed` gate exists so that when Plausible or an ads pixel lands it
cannot be added without passing through consent. Absence of a decision is not
consent.

## 2026-08-29 — Admin lives at a real `/admin` URL segment

Next route groups do not contribute to the URL. `app/(admin)/leads/page.tsx`
served `/leads`, which collided with the public namespace and meant the
`matcher: ['/admin/:path*']` in `middleware.ts` matched nothing at all.

Admin pages now sit at `app/(admin)/admin/**`. The group is kept so every
`apps/web/app/(admin)/**` glob in `LANES.md` still holds, and the URLs match
what `DEFINITION_OF_DONE.md` promises Denise.

## 2026-08-29 — Auth.js v5, credentials, JWT sessions, no database adapter

Staff sign in with email + password against the existing `User.passwordHash`.
Sessions are JWT.

Deliberately no Auth.js Prisma adapter: it needs Account / Session /
VerificationToken tables that are not in the P1 schema, and `ARCHITECTURE.md`
fixes the P1 entity list at nine. Magic link / OTP for the client portal is
`P3-L-048`; that is the right moment to take the schema change.

`NEXTAUTH_URL` is removed from `.env.example`. Auth.js v5 infers the host from
request headers, and a hardcoded value rewrote `req.url` inside middleware so
every guard redirect pointed at port 3000 regardless of the real origin.

## 2026-08-29 — Design tokens are the only palette

`packages/ui/src/tokens.ts` feeds `packages/ui/src/tailwind-preset.ts`, which
`apps/web/tailwind.config.ts` consumes as a Tailwind preset. There is no second
place to define a colour.

The preset lives in `packages/ui` rather than `packages/config` as first
sketched: the tokens are already there, and putting a runtime import of
`@execuneed/ui` into `@execuneed/config` would make the two packages circular.
`packages/config` holds the tsconfig base and the ESLint flat config only.

## 2026-08-29 — Development database is Supabase, eu-central-1

Project `execuneed-dev` (`kbjkorekynnatyzghhyy`), separate from the Syrax OS
Platform project. Supabase has no `af-south-1` region, so client data sits in
Frankfurt. `docs/compliance/RULES.md` §POPIA asks for data residency to be
documented — this is that record. Production hosting is a separate decision and
is not made yet.

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

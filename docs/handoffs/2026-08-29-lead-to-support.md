# Handoff

- date: 2026-08-29
- from: lead (Jared)
- to: support (Deacon)
- taskId: P0-L-002, P0-L-003, P0-L-004, P0-L-005
- branch: `feat/P0-L-002-scaffold`
- events: `session.start`, `plan.updated`, `contract.changed`, `task.done` ×5, `handoff`

> No development workspace webhook URL is configured. `.claude/workspace.json`
> names the env keys but `DEV_WORKSPACE_WEBHOOK_URL` and
> `N3XUS_DEV_WEBHOOK_URL` are both empty. Per `docs/plan/WEBHOOK.md` the
> fallback is to write the event here and tell the human. Jared: set one of
> those keys and this stops being a file.

## What landed

The repo now builds. It did not before — `apps/web/package.json` declared no
dependencies at all, and there was no root `app/layout.tsx`.

- **P0-L-002** — real dependencies, root layout, `globals.css`, Tailwind,
  PostCSS, ESLint flat config, `pnpm-lock.yaml`, working CI. `lint` and
  `typecheck` genuinely run instead of echoing.
- **P0-L-003** — Prisma client singleton, `p0_baseline` migration generated
  and applied to Supabase. All nine P1 tables exist.
- **P0-L-004** — Auth.js v5 credentials sign-in, `/admin` role gate in
  middleware, `X-Robots-Tag: noindex` on every route.
- **P0-L-005** — `tokens.ts` → `tailwind-preset.ts` → `tailwind.config.ts`.
  Verified: `border-line` compiles to `rgb(221 214 203)`.

## Contract changes

Nothing in `CONTRACTS.md` changed. Two structural changes you need to know:

1. **Admin URLs moved.** `app/(admin)/leads/page.tsx` served `/leads`, not
   `/admin/leads` — route groups do not add URL segments, so the middleware
   matcher matched nothing. Admin pages now live at `app/(admin)/admin/**`.
   Your `LANES.md` globs are unchanged.
2. **`P1-L-007` gained a dependency on `P1-L-013`.** `Lead.slaDueAt` is
   non-null, so `createLeadAction` cannot write a row until the SLA function
   exists. This does not affect your tickets.

## What is not done

- `packages/ui/src/index.ts` still exports nothing. That is your `P0-S-001`.
- `packages/db/src/seed.ts` is still a stub — `P1-L-018`, not P0.
- No P1 feature code. `createLeadAction` and `slaDueAt` still throw
  `not implemented` on purpose.

## Next ticket for receiver

**`P0-S-001` — implement the primitives in `packages/ui`.**

It is `ready`: tokens exist, the preset is wired, the app builds, and
`docs/ui/PRIMITIVES.md` has the list. Import the preset, do not define colours.

`P0-S-002` and `P0-S-003` flip to `ready` the moment `P0-S-001` merges.
`P0-S-004` (copy deck) is also `ready` and independent — take it if you are
blocked.

## Blocker for Jared

`.env` needs the Supabase database password before anything can talk to
Postgres:

1. Supabase dashboard → project `execuneed-dev` → Settings → Database →
   reset/copy the password.
2. Replace `REPLACE_WITH_DB_PASSWORD` in `.env`.
3. Tell Prisma the already-applied migration is applied:
   `pnpm --filter @execuneed/db exec prisma migrate resolve --applied 20260829070000_p0_baseline`

Until then `pnpm dev`, `build`, `lint`, `typecheck` and `test` all work; only
database calls do not.

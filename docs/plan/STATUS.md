# Status

Phase: **P0 — plan and structure**
Board state: Lead lane complete, Support lane open
Last updated: 2026-08-29

## Focus

| Lane    | Human  | Focus                                       | Status         |
| ------- | ------ | ------------------------------------------- | -------------- |
| Lead    | Jared  | P0-L-001 → P0-L-005                         | done           |
| Support | Deacon | P0-S-001 (primitives), P0-S-004 (copy deck) | ready to claim |

## What landed

- Monorepo installs and builds. `pnpm dev`, `lint`, `typecheck`, `test`, `build` all real — the `echo` placeholders are gone.
- `apps/web/app/layout.tsx` exists. It was missing, so the App Router had no root.
- Tailwind wired to `packages/ui/src/tokens.ts` through a preset. One palette, no second colour system.
- `packages/config` populated: tsconfig base + ESLint flat config.
- Prisma client exported; `p0_baseline` migration generated and applied. Nine tables live.
- Auth.js v5 staff sign-in, role gate on `/admin`, `X-Robots-Tag: noindex` on every route until `ALLOW_INDEXING=true`.

## Blocked

- **P0-S-002 and P0-S-003 stay `backlog` until P0-S-001 lands.** Both depend on the primitives existing. `P0-L-004` (their other dependency) is done.
- `pnpm db:migrate` and `pnpm db:seed` need the Supabase database password in `.env`. The migration is already applied to the database; Prisma just has not recorded it locally. See `docs/handoffs/2026-08-29-lead-to-support.md`.

## Open questions for Execuneed (not blockers for P0)

1. Exact legal entity name and juristic-representative wording
2. FSP / NCR numbers to put in footer
3. Which Discovery product classes they are accredited to market
4. **Confirm the WhatsApp business number.** The value in `.env.example` looks derived from the landline and is almost certainly wrong.
5. Confirm staff emails for digest: Wayne, Denise

## Next merge window

`feat/P0-L-002-scaffold` → `main`. Deacon branches `feat/P0-S-001-ui-primitives` from `main` after that merges.

## Last webhook event

No webhook URL is configured, so events are written to `docs/handoffs/` per `docs/plan/WEBHOOK.md`. Latest: `2026-08-29-lead-to-support.md`.

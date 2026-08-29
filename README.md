# Execuneed Platform

N3XUS Media build for Execuneed Financial Services — public site, staff admin, client portal, and AI operations layer.

Two engineers:

- **Jared Sinclair** — lead
- **Deacon** — support

Both Claude Code sessions read `CLAUDE.md` first, then `docs/dev/CLAUDE_CODE_BRIEF.md`.

## Start here

1. Read `CLAUDE.md`
2. Read `docs/dev/CLAUDE_CODE_BRIEF.md`
3. Read `docs/plan/STATUS.md`
4. Lead: `.claude/lead.md`
5. Support: `.claude/support.md`
6. Product: `docs/product/EXECUNEED_AI_PLATFORM_PLAN.md`

## Repo

```text
apps/web          Next.js App Router (public + auth + admin; portal in P3)
packages/ui       Design tokens, Tailwind preset, primitives
packages/db       Prisma schema, migrations, client
packages/config   Shared tsconfig and ESLint config
docs/             Product, plan, compliance, UI
```

## Setup

Requires Node 22+ and pnpm 9. If you do not have pnpm:

```bash
corepack enable --install-directory ~/.local/bin
```

Then:

```bash
pnpm install
cp .env.example .env    # fill AUTH_SECRET and DATABASE_URL
pnpm db:generate
pnpm dev
```

`apps/web/.env` and `packages/db/.env` are symlinks to the root `.env`, so there is one file to edit.

## Commands

```bash
pnpm dev           # Next dev server
pnpm build         # production build
pnpm lint          # eslint across the workspace
pnpm typecheck     # tsc --noEmit across the workspace
pnpm test          # vitest
pnpm db:generate   # regenerate the Prisma client
pnpm db:migrate    # create and apply a migration
pnpm db:seed       # stub until P1-L-018
```

## Routes

Admin lives at a real `/admin` segment (`app/(admin)/admin/**`). Route groups do not contribute to the URL, so `/leads` would have collided with the public namespace and the middleware matcher would never have fired.

Every route sends `X-Robots-Tag: noindex` until `ALLOW_INDEXING=true`. Do not flip that before the legal wording in `docs/product/CLIENT_ANSWERS.md` is confirmed.

## Rule

AI does not give financial advice. Enquiry consent and marketing consent stay separate.

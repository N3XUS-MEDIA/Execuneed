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
apps/web          Next.js App Router (public + portal + admin)
packages/ui       Design tokens and primitives
packages/db       Prisma schema and client
packages/config   Shared tsconfig / eslint / tailwind
docs/             Product, plan, compliance, UI
```

## Commands (after install)

```bash
pnpm install
pnpm dev
pnpm db:migrate
pnpm db:seed
pnpm test
```

## Rule

AI does not give financial advice. Enquiry consent and marketing consent stay separate.

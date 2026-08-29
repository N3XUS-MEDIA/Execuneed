# File manifest

What exists and who owns it.

## Root / process

| File | Owner |
|---|---|
| README.md | shared |
| CLAUDE.md | shared |
| .claude/lead.md | lead |
| .claude/support.md | support |
| .claude/workspace.json | shared |
| .claude/prompts/* | shared |
| .env.example | lead |
| package.json | lead |
| pnpm-workspace.yaml | lead |
| .github/workflows/ci.yml | lead |

## Docs

| File | Owner |
|---|---|
| docs/dev/CLAUDE_CODE_BRIEF.md | lead |
| docs/dev/WORKSHOP.md | lead |
| docs/product/EXECUNEED_AI_PLATFORM_PLAN.md | lead |
| docs/product/CLIENT_ANSWERS.md | lead |
| docs/plan/* | lead except SUPPORT_LOG |
| docs/compliance/* | lead |
| docs/ui/* | support after P0 |
| docs/handoffs/* | shared |

## Code

| File | Owner | Phase |
|---|---|---|
| packages/config/tsconfig.base.json | lead | P0-L-002 |
| packages/config/eslint.config.mjs | lead | P0-L-002 |
| apps/web/app/layout.tsx | lead | P0-L-002 |
| apps/web/app/globals.css | lead | P0-L-002 |
| apps/web/tailwind.config.ts | lead | P0-L-002 |
| packages/db/prisma/schema.prisma | lead | P0-L-003 |
| packages/db/prisma/migrations/** | lead | P0-L-003 |
| packages/db/src/index.ts | lead | P0-L-003 |
| apps/web/src/server/auth.ts | lead | P0-L-004 |
| apps/web/src/server/auth.config.ts | lead | P0-L-004 |
| apps/web/src/types/next-auth.d.ts | lead | P0-L-004 |
| apps/web/middleware.ts | lead | P0-L-004 |
| apps/web/app/(auth)/** | lead | P0-L-004 |
| apps/web/app/api/auth/** | lead | P0-L-004 |
| packages/ui/src/tailwind-preset.ts | lead | P0-L-005 |
| packages/ui/src/tokens.ts | lead defined / support implement | P0 |
| apps/web/src/contracts/types.ts | lead | P0 |
| apps/web/src/domain/leads/score.ts | lead | P1-L-014 started |
| apps/web/src/domain/consent.ts | lead | P1-L-008 started |
| apps/web/src/server/leads/createLeadAction.ts | lead | P1-L-007 stub |
| apps/web/app/(public)/** | support | P1-S-019+ |
| apps/web/app/(admin)/** | support screens / lead gates | P1 |

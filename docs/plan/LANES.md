# Lanes

If a path is not listed, ask Lead before creating it.

## Directory ownership

| Path | Owner | Support may |
|---|---|---|
| `packages/db/**` | Lead | read only |
| `apps/web/src/server/**` | Lead | read only |
| `apps/web/src/domain/**` | Lead | read only |
| `apps/web/src/ai/**` | Lead | read only |
| `apps/web/app/api/**` | Lead | read only |
| `apps/web/middleware.ts` | Lead | read only |
| `apps/web/src/ui/**` | Support | create and edit assigned files |
| `apps/web/src/content/**` | Support | create and edit |
| `apps/web/app/(public)/**` | Support | after P0-S-002 |
| `apps/web/app/(admin)/**` | Support | shell and pages listed on ticket |
| `apps/web/app/(portal)/**` | Support | P3 only |
| `apps/web/app/(auth)/**` | Lead first, Support polish | polish only when ticket says so |
| `packages/ui/**` | Shared | Support implements primitives from Lead’s list |
| `docs/plan/STATUS.md` | Lead | Support may not rewrite |
| `docs/plan/SUPPORT_LOG.md` | Support | Support only |
| `docs/ui/**` | Support | yes |
| `docs/compliance/**` | Lead | Support fills `NEEDS_LEGAL` placeholders only when asked |
| `.env.example` | Lead | no |
| `.claude/**` | Shared | no process changes without Lead |

## High-collision files — Lead only

```text
packages/db/prisma/schema.prisma
apps/web/middleware.ts
apps/web/src/server/**
apps/web/src/domain/**
apps/web/src/ai/**
apps/web/app/api/**
```

## Rule when both need a file

Lead extracts the shared piece first. Support waits. Do not dual-edit `schema.prisma` or a page layout file.

## New files

- Domain / API / schema: Lead creates
- Page / component / test listed on a Support ticket: Support creates
- Anything else: webhook `question` first

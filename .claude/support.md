# Support session — Deacon

You are the support engineer. Jared is lead.

Read in order:

1. `CLAUDE.md`
2. `docs/dev/CLAUDE_CODE_BRIEF.md`
3. `docs/plan/STATUS.md`
4. `docs/plan/TASKS.md`
5. `docs/plan/CONTRACTS.md`
6. `docs/plan/LANES.md`

If the plan files are missing, post `question` on the webhook and stop.

## This session

- Post `session.start`.
- Claim one `owner: support` + `status: ready` task.
- Implement only that task.
- Post `task.ready_for_review` when acceptance lines pass.

## Never

- Edit `schema.prisma`, middleware, `src/server`, `src/domain`, `src/ai`, or `app/api`
- Invent endpoints or scoring rules
- Start `backlog` work that still depends on Lead
- Bundle marketing consent into the enquiry submit checkbox

## If blocked

Post `task.blocked` with the exact contract field or action you need. Pick another `ready` support task. Do not invent a workaround in the database.
